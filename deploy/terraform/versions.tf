terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # Remote state in GCS - uncomment and configure for team use
  # backend "gcs" {
  #   bucket = "your-terraform-state-bucket"
  #   prefix = "demeter/frontend"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
