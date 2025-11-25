resource "google_secret_manager_secret" "db_url" {
  secret_id = "db-url"
  replication { automatic = true }
}

resource "google_secret_manager_secret_version" "db_url_v1" {
  secret      = google_secret_manager_secret.db_url.id
  secret_data = "postgresql://app:${var.db_password}@/${google_sql_database.app.name}?host=/cloudsql/${google_sql_database_instance.main.connection_name}"

  depends_on = [
    google_sql_database_instance.main,
    google_sql_database.app,
    google_sql_user.app,
  ]
}