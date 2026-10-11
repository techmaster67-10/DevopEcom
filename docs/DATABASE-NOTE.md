# Data Layer Note

This demo intentionally uses in-memory seed data so the complete microservices/DevOps stack can run with minimal setup and no database server. In a production version, replace the arrays in each service with PostgreSQL/MongoDB repositories and add database containers or managed DB services.


Because data is held in each service's memory, the Kubernetes manifests run **1 replica** per backend service. With multiple replicas every pod would hold its own separate copy of the data. Moving to a real database is what would allow scaling these services out.
