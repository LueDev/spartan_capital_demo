resource "google_sql_database_instance" "main" {
  name             = "spartan-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro"
    availability_type = "REGIONAL"
    disk_type = "PD_SSD"
    disk_size = 10

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.spartan.id
      require_ssl     = true
    }

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
    }
  }

  deletion_protection = false

  depends_on = [
    google_compute_network.spartan,
    google_compute_subnetwork.private,
  ]
}

resource "google_sql_database" "app" {
  name     = "app"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "app" {
  name     = "app"
  instance = google_sql_database_instance.main.name
  password = random_password.db_password.result
}