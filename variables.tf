variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Unique project name used as prefix for all resources"
  type        = string
  default     = "billing-manager"
}

variable "environment" {
  description = "Deployment environment (production, staging)"
  type        = string
  default     = "production"
}

variable "backend_image_uri" {
  description = "Full URI of the backend Docker image in ECR (e.g. 123456789.dkr.ecr.us-east-1.amazonaws.com/billing-manager-backend:latest)"
  type        = string
  default     = "nginx:alpine"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "billing_cron_schedule" {
  description = "EventBridge cron expression for the billing job (UTC)"
  type        = string
  default     = "cron(0 13 * * ? *)"
}
