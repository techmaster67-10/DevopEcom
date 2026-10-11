# DevOps Demo / Viva Guide

## 1. Git workflow
```bash
git init
git checkout -b develop
git checkout -b feature/product-api
# edit files
git add .
git commit -m "feat: add product service"
git push -u origin feature/product-api
```
Create a pull request into `develop`. After testing, merge through a release branch into `main`.

## 2. Automated testing
Each service has Jest + Supertest tests. Run:
```bash
cd services/product-service && npm install && npm test
cd ../customer-service && npm install && npm test
cd ../order-service && npm install && npm test
```

## 3. Build and run containers
```bash
docker compose up --build
```
Show the frontend at `http://localhost:8080` and API endpoints at ports 3001–3003.

## 4. Service-to-service communication
The Order Service uses HTTP `fetch()` to call:
- Product Service: `GET /products/:id`
- Customer Service: `GET /customers/:id`

During order creation, both dependencies are queried before the order is confirmed.

## 5. Registry
The GitHub Actions pipeline tags and publishes images to GHCR as:
`ghcr.io/<github-user>/ecommerce-product-service:latest`, etc.

## 6. Kubernetes
Apply the YAML files in `k8s/`. Replace `your-github-user` with the GitHub owner before deployment.

## 7. Blue-green simulation
The Order Service has two identical deployments:
- `order-service-blue`
- `order-service-green`

The Service selector controls which version receives traffic. Patch `version: green` to switch, test, then patch back to `version: blue`.

## 8. Monitoring
Every backend exposes `/metrics` using `prom-client`. Prometheus can scrape these endpoints. For a simple Docker demo, run:
```bash
docker compose up --build -d   # app first, so the network exists
cd monitoring
docker compose -f docker-compose.monitoring.yml up -d
```
Open `http://localhost:9090`.

## 9. Security scanning
Local:
```bash
cd services/product-service && npm audit --audit-level=high
trivy fs .
```
CI performs npm audit and Trivy image scans and fails on HIGH/CRITICAL findings (excluding unfixed findings).

## 10. Suggested presentation order
1. Explain microservices architecture.
2. Open frontend and show products.
3. Create an order.
4. Explain that Order Service calls Product + Customer services.
5. Show Docker containers.
6. Show GitHub Actions pipeline.
7. Show GHCR images.
8. Show Kubernetes pods/services.
9. Switch blue → green.
10. Show Prometheus metrics and security scan.
