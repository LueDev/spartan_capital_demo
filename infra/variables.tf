variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  default     = "us-east1"
  type        = string
}


variable "domain" {
  description = "Domain name for the application"
  default     = "spartan.luisjorge.dev"
  type        = string
}