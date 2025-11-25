resource "google_compute_network" "spartan" {
  name                    = "spartan-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "private" {
  name          = "spartan-private-subnet"
  ip_cidr_range = "10.0.0.0/20"
  region        = var.region
  network       = google_compute_network.spartan.id
  private_ip_google_access = true
}

resource "google_compute_subnetwork" "connector" {
  name          = "spartan-connector-subnet"
  ip_cidr_range = "10.0.16.0/28"
  region        = var.region
  network       = google_compute_network.spartan.id
  purpose       = "VPC_CONNECTOR"
}