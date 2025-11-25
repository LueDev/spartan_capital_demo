resource "google_cloud_run_v2_service" "backend" {
  name     = "backend"
  location = var.region

  template {
    containers {
      image = "us-east1-docker.pkg.dev/${var.project_id}/spartan-repo/backend:latest"

      env {
        name  = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_url.secret_id
            version = "latest"
          }
        }
      }

      env {
        name  = "PORT"
        value = "8080"
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

resource "google_cloud_run_v2_service" "frontend" {
  name     = "frontend"
  location = var.region

  template {
    containers {
      image = "us-east1-docker.pkg.dev/${var.project_id}/spartan-repo/frontend:latest"
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "all_users_backend" {
  location = google_cloud_run_v2_service.backend.location
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "all_users_frontend" {
  location = google_cloud_run_v2_service.frontend.location
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
