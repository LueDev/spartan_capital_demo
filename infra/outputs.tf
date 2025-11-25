output "url" {
  description = "Public URL of the application"
  value       = "https://${var.domain}"
}

output "backend_url" {
  description = "Direct Cloud Run URL for backend"
  value       = google_cloud_run_v2_service.backend.uri
}

output "frontend_url" {
  description = "Direct Cloud Run URL for frontend"
  value       = google_cloud_run_v2_service.frontend.uri
}

output "load_balancer_ip" {
  description = "IP address of the load balancer (for DNS configuration)"
  value       = google_compute_global_address.lb_ip.address
}

output "database_connection_name" {
  description = "Cloud SQL connection name"
  value       = google_sql_database_instance.main.connection_name
}