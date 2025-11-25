resource "google_compute_backend_service" "backend" {
  name       = "backend-service"
  protocol   = "HTTP"
  port_name  = "http"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.backend_neg.id
  }

  security_policy = google_compute_security_policy.armor.id
}

resource "google_compute_backend_service" "frontend" {
  name       = "frontend-service"
  protocol   = "HTTP"
  port_name  = "http"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.frontend_neg.id
  }

  security_policy = google_compute_security_policy.armor.id
}

resource "google_compute_region_network_endpoint_group" "backend_neg" {
  name                  = "backend-neg"
  region                = var.region
  network_endpoint_type = "SERVERLESS"
  cloud_run {
    service = google_cloud_run_v2_service.backend.name
  }
}

resource "google_compute_region_network_endpoint_group" "frontend_neg" {
  name                  = "frontend-neg"
  region                = var.region
  network_endpoint_type = "SERVERLESS"
  cloud_run {
    service = google_cloud_run_v2_service.frontend.name
  }
}

resource "google_compute_url_map" "lb" {
  name            = "spartan-lb"
  default_service = google_compute_backend_service.backend.id

  host_rule {
    hosts        = ["*"]
    path_matcher = "allpaths"
  }

  path_matcher {
    name            = "allpaths"
    default_service = google_compute_backend_service.backend.id

    path_rule {
      paths   = ["/api/*", "/health"]
      service = google_compute_backend_service.backend.id
    }

    path_rule {
      paths   = ["/*"]
      service = google_compute_backend_service.frontend.id
    }
  }
}

resource "google_compute_global_address" "lb_ip" {
  name = "spartan-lb-ip"
}

resource "google_compute_global_forwarding_rule" "https" {
  name       = "spartan-https"
  target     = google_compute_target_https_proxy.https.id
  port_range = "443"
  ip_address = google_compute_global_address.lb_ip.address
}

resource "google_compute_target_https_proxy" "https" {
  name             = "spartan-https-proxy"
  url_map          = google_compute_url_map.lb.id
  ssl_certificates = [google_compute_managed_ssl_certificate.default.id]
}

resource "google_compute_managed_ssl_certificate" "default" {
  name = "spartan-cert"
  managed {
    domains = [var.domain]
  }
}