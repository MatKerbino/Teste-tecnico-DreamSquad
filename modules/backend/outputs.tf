output "alb_dns_name" {
  value = aws_lb.backend.dns_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.main.name
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}
