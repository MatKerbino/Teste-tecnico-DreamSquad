output "cloudfront_url" {
  description = "Public URL of the static frontend via CloudFront"
  value       = "https://${module.frontend.cloudfront_domain_name}"
}

output "cloudfront_id" {
  description = "CloudFront Distribution ID (used for cache invalidation)"
  value       = module.frontend.cloudfront_distribution_id
}

output "alb_url" {
  description = "Public URL of the backend API via Application Load Balancer"
  value       = "http://${module.backend.alb_dns_name}"
}

output "ecr_repository_url" {
  description = "ECR repository URL for pushing the backend Docker image"
  value       = module.backend.ecr_repository_url
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = module.backend.dynamodb_table_name
}

output "billing_bucket_name" {
  description = "S3 bucket name for billing reports"
  value       = module.cronjob.billing_bucket_name
}

output "backup_bucket_name" {
  description = "S3 bucket name for database backups"
  value       = module.cronjob.backup_bucket_name
}

output "lambda_function_name" {
  description = "Name of the billing Lambda function"
  value       = module.cronjob.lambda_function_name
}

output "aws_region" {
  description = "AWS region where the infrastructure is deployed"
  value       = var.aws_region
}

output "frontend_bucket_name" {
  description = "S3 bucket name for the static frontend"
  value       = module.frontend.frontend_bucket_name
}

output "ecs_cluster_name" {
  description = "ECS cluster name (used by aws ecs update-service)"
  value       = module.backend.ecs_cluster_name
}

output "cron_secret" {
  description = "Token used by the Lambda to authenticate cron requests"
  value       = random_password.cron_secret.result
  sensitive   = true
}
