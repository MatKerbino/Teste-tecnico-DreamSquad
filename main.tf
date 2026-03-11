terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

resource "random_password" "cron_secret" {
  length  = 32
  special = false
}

# ─── Modules ─────────────────────────────────────────────────

module "network" {
  source       = "./modules/network"
  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
}

module "frontend" {
  source       = "./modules/frontend"
  project_name = var.project_name
  alb_dns_name = module.backend.alb_dns_name
}

module "cronjob" {
  source                = "./modules/cronjob"
  project_name          = var.project_name
  billing_cron_schedule = var.billing_cron_schedule
  api_url               = "http://${module.backend.alb_dns_name}/api/routines/system/billing"
  cron_secret           = random_password.cron_secret.result
}

module "backend" {
  source              = "./modules/backend"
  project_name        = var.project_name
  vpc_id              = module.network.vpc_id
  private_subnet_ids  = module.network.private_subnet_ids
  public_subnet_ids   = module.network.public_subnet_ids
  backend_image_uri   = var.backend_image_uri
  billing_bucket_arn  = module.cronjob.billing_bucket_arn
  billing_bucket_name = module.cronjob.billing_bucket_name
  backup_bucket_arn   = module.cronjob.backup_bucket_arn
  backup_bucket_name  = module.cronjob.backup_bucket_name
  aws_region          = var.aws_region
  cron_secret         = random_password.cron_secret.result
}
