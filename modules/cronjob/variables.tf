variable "project_name" {
  type = string
}

variable "billing_cron_schedule" {
  type    = string
  default = "cron(0 10 * * ? *)"
}

variable "api_url" {
  description = "Backend API URL for the billing routine"
  type        = string
}

variable "cron_secret" {
  description = "Secret token for administrative cron tasks"
  type        = string
  sensitive   = true
}
