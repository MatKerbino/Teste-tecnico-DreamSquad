output "billing_bucket_arn" {
  value = aws_s3_bucket.billing.arn
}

output "billing_bucket_name" {
  value = aws_s3_bucket.billing.bucket
}

output "backup_bucket_arn" {
  value = aws_s3_bucket.backup.arn
}

output "backup_bucket_name" {
  value = aws_s3_bucket.backup.bucket
}

output "lambda_function_name" {
  value = aws_lambda_function.billing_worker.function_name
}

output "lambda_function_arn" {
  value = aws_lambda_function.billing_worker.arn
}
