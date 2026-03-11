resource "random_id" "suffix" {
  byte_length = 4
}

# ─── S3 Bucket: Billing Reports ───────────────────────────────
resource "aws_s3_bucket" "billing" {
  bucket        = "${var.project_name}-billing-${random_id.suffix.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "billing" {
  bucket                  = aws_s3_bucket.billing.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "billing" {
  bucket = aws_s3_bucket.billing.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_lifecycle_configuration" "billing" {
  bucket = aws_s3_bucket.billing.id

  rule {
    id     = "archive_old_reports"
    status = "Enabled"

    filter {}

    transition {
      days          = 30
      storage_class = "GLACIER_IR"
    }

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }
}

# ─── S3 Bucket: Database Backups ──────────────────────────────
resource "aws_s3_bucket" "backup" {
  bucket        = "${var.project_name}-backup-${random_id.suffix.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "backup" {
  bucket                  = aws_s3_bucket.backup.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "backup" {
  bucket = aws_s3_bucket.backup.id

  rule {
    id     = "archive_old_backups"
    status = "Enabled"

    filter {}

    transition {
      days          = 30
      storage_class = "GLACIER_IR"
    }
  }
}

# ─── IAM Role for Lambda ──────────────────────────────────────
data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = "${var.project_name}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_policy" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["${aws_cloudwatch_log_group.lambda.arn}:*"]
  }
}

resource "aws_iam_role_policy" "lambda" {
  name   = "${var.project_name}-lambda-policy"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.lambda_policy.json
}

# ─── CloudWatch Log Group for Lambda ─────────────────────────
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${var.project_name}-billing-worker"
  retention_in_days = 14
}

# ─── Lambda Function ──────────────────────────────────────────
resource "aws_lambda_function" "billing_worker" {
  function_name = "${var.project_name}-billing-worker"
  role          = aws_iam_role.lambda.arn
  handler       = "bootstrap"
  runtime       = "provided.al2023"
  architectures = ["x86_64"]

  filename         = "${path.module}/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda.zip")

  timeout     = 60
  memory_size = 128

  environment {
    variables = {
      API_URL     = var.api_url
      CRON_SECRET = var.cron_secret
    }
  }

  depends_on = [aws_cloudwatch_log_group.lambda]
}

# ─── EventBridge Scheduler Rule (10:00am UTC daily) ──────────
resource "aws_cloudwatch_event_rule" "billing_schedule" {
  name                = "${var.project_name}-billing-schedule"
  description         = "Daily billing routine at 10:00am UTC"
  schedule_expression = var.billing_cron_schedule
}

resource "aws_cloudwatch_event_target" "billing_lambda" {
  rule      = aws_cloudwatch_event_rule.billing_schedule.name
  target_id = "BillingLambda"
  arn       = aws_lambda_function.billing_worker.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.billing_worker.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.billing_schedule.arn
}
