# E-Commerce Application – DevOps Automation

A student-friendly Node.js + Express.js microservices e-commerce application demonstrating a complete DevOps workflow.

## Architecture

- **Frontend:** multi-page HTML/CSS/JavaScript served by Nginx (Shop, Orders, Admin, Service Status)
- **Product Service:** products CRUD/read APIs, Express.js
- **Customer Service:** customer APIs, Express.js
- **Order Service:** creates/reads orders and communicates with Product + Customer services over HTTP
- **Persistence:** in-memory seed data for easy local/demo setup (see `docs/DATABASE-NOTE.md`)
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Registry:** GitHub Container Registry (GHCR) workflow
- **Orchestration:** Kubernetes
- **Blue-Green:** separate blue/green Order Service deployments with a Service selector switch
- **Monitoring:** Prometheus metrics endpoints + Prometheus configuration
- **Security:** npm audit + Trivy filesystem/container scanning
- **Testing:** Jest + Supertest

## Quick start

### Docker Compose
```bash
docker compose up --build
```
Open http://localhost:8080

Services:
- Frontend: http://localhost:8080
- Product API: http://localhost:3001
- Customer API: http://localhost:3002
- Order API: http://localhost:3003

### Local development
Use Node.js 20+.

```bash
cd services/product-service && npm install && npm test && npm start
cd services/customer-service && npm install && npm test && npm start
cd services/order-service && npm install && npm test && npm start
```

Set Order Service URLs if needed:
```text
PRODUCT_SERVICE_URL=http://localhost:3001
CUSTOMER_SERVICE_URL=http://localhost:3002
PORT=3003
```

## Frontend pages

| Page | URL | What it does |
|------|-----|--------------|
| Shop | `/` | Browse products, place an order |
| Orders | `/orders.html` | Full order history with search and totals |
| Admin | `/admin.html` | Add products and customers |
| Status | `/status.html` | Live health check of each microservice |

## Monitoring (Prometheus)

Start the app first, then monitoring (it joins the app's Docker network):
```bash
docker compose up --build -d
cd monitoring && docker compose -f docker-compose.monitoring.yml up -d
```
Open http://localhost:9090 and check **Status → Targets**.

## Demo flow

1. Open the frontend.
2. Products are loaded from Product Service.
3. Customers are loaded from Customer Service.
4. Submit an order.
5. Order Service calls Product Service to validate product and price.
6. Order Service calls Customer Service to validate customer.
7. The order is stored by Order Service and displayed in the UI.
8. Visit `/metrics` on each service to show Prometheus metrics.

## Kubernetes

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/product-service.yaml
kubectl apply -f k8s/customer-service.yaml
kubectl apply -f k8s/order-service-blue.yaml
kubectl apply -f k8s/order-service-green.yaml
kubectl apply -f k8s/order-service.yaml
kubectl apply -f k8s/frontend.yaml
kubectl get pods,svc -n ecommerce
```

The normal Order Service points to **blue**. To simulate blue-green switching:
```bash
kubectl patch service order-service -n ecommerce -p '{"spec":{"selector":{"app":"order-service","version":"green"}}}'
```
Switch back:
```bash
kubectl patch service order-service -n ecommerce -p '{"spec":{"selector":{"app":"order-service","version":"blue"}}}'
```

## CI/CD

The GitHub Actions workflow runs:
1. Install dependencies
2. Unit/API tests
3. npm audit
4. Build Docker images
5. Trivy security scan
6. Push images to GHCR on `main`

Set GitHub repository package permissions so `GITHUB_TOKEN` can publish to GHCR.

## Git workflow

Recommended branches:
- `main` – production-ready
- `develop` – integration
- `feature/*` – new work
- `release/*` – release preparation
- `hotfix/*` – urgent production fixes

Typical flow:
```text
feature/* -> develop -> release/* -> main
                         \-> tag/version
hotfix/* -> main + develop
```

See `docs/DEVOPS-GUIDE.md` for the viva/demo checklist.

Feature branch workflow demonstrated with a pull request.
