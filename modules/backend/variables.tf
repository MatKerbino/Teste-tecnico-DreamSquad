variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "backend_image_uri" {
  type        = string
  description = "Full ECR image URI for the backend container"
}

variable "billing_bucket_arn" {
  type = string
}

variable "billing_bucket_name" {
  type = string
}

variable "backup_bucket_arn" {
  type = string
}

variable "backup_bucket_name" {
  type = string
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "backend_cpu" {
  type    = number
  default = 256
}

variable "backend_memory" {
  type    = number
  default = 512
}

variable "backend_port" {
  type    = number
  default = 8080
}

variable "cron_secret" {
  description = "Secret token for administrative cron tasks"
  type        = string
  sensitive   = true
}
