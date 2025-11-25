resource "random_password" "db_password" {
  length  = 32
  special = true
  upper   = true
  lower   = true
  numeric = true
}

resource "google_secret_manager_secret" "db_password" {
  secret_id = "db-password"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_password_v1" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = random_password.db_password.result
}

resource "google_secret_manager_secret" "db_url" {
  secret_id = "db-url"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_url_v1" {
  secret      = google_secret_manager_secret.db_url.id
  secret_data = "postgresql://app:${random_password.db_password.result}@/${google_sql_database.app.name}?host=/cloudsql/${google_sql_database_instance.main.connection_name}"

  depends_on = [
    google_sql_database_instance.main,
    google_sql_database.app,
    google_sql_user.app,
  ]
}