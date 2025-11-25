resource "google_vpc_access_connector" "connector" {
  name          = "spartan-connector"
  region        = var.region
  subnet {
    name = google_compute_subnetwork.private.name
  }
  machine_type = "e2-micro"
  min_instances = 2
  max_instances = 10
}