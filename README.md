# 🚀 End-to-End DevSecOps CI/CD Pipeline & Multi-Server Deployment

A complete, production-grade **DevSecOps implementation** built from scratch across a **Two-Server AWS Architecture**. Demonstrating automated SAST security scanning, container image vulnerability gates, rolling deployments, blue-green environment switching, post-deployment automated health check rollbacks, database schema migrations, and monitoring.

---

## 📸 Pipeline Execution Result
All 6 DevSecOps practical tasks executed and verified successfully in Jenkins:

![Jenkins Pipeline Success](./docs/jenkins_pipeline_success.png)

---

## 🏗️ Architecture & Server Setup

| Server Role | AWS EC2 IP | Specs / OS | Core Components Installed |
| :--- | :--- | :--- | :--- |
| **Server 1 (Jenkins Server)** | `13.234.26.172` | Ubuntu 24.04 LTS (`t2.medium`) | Jenkins 2.580, OpenJDK 21, Docker, Trivy Security Scanner, Git |
| **Server 2 (Web/App Server)** | `65.1.47.84` | Ubuntu 24.04 LTS (`t2.small`) | Docker Engine, Nginx Reverse Proxy, Node.js API, MongoDB |

---

## 🛡️ DevSecOps Tasks Summary & Implementation Details

### Task 1 — DevSecOps Pipeline
* **Source Code Integration**: Integrated GitHub repository with Jenkins using declarative SCM pipelines.
* **Build Automation**: Dockerized the Express Node.js backend using a lightweight, multi-layer `node:20-alpine` base image.
* **Security Integration**: Integrated Trivy static file scanner and dependency audit checks in pre-build stages.

### Task 2 — Security Gate Enforcement
* **Vulnerability Thresholds**: Configured **Trivy Container Scanner** to detect `CRITICAL` and `HIGH` security vulnerabilities.
* **Strict Policy Enforcement**: Built logic (`FAIL_SECURITY_GATE`) to automatically **abort deployment** before image pushing whenever unmitigated critical vulnerabilities exist.

### Task 3 — Rolling Deployment & Rollback
* **Zero-Downtime Deployment**: Sequentially replaced target instances (`backend-instance-1` on port 5001 and `backend-instance-2` on port 5002).
* **Verification & Rollback**: Evaluated instance responsiveness post-container spinup before proceeding to update the next node.

### Task 4 — Blue-Green Deployment
* **Isolated Environments**: Deployed Blue environment (`app-blue` on port 8001) and Green environment (`app-green` on port 8002).
* **Nginx Reverse Proxy Switch**: Automated dynamic proxy swapping inside `/etc/nginx/sites-available/default` to redirect live web traffic seamlessly between environments.

### Task 5 — Automatic Health Check & Auto-Rollback
* **Automated Post-Deployment Gate**: Polled application `/health` REST endpoint automatically post-deployment.
* **Fail-Safe Mechanism**: Configured `SIMULATE_FAILURE` logic to verify that non-200 HTTP responses immediately trigger an automated Nginx traffic rollback to the previous healthy deployment.

### Task 6 — Database Migration & Schema Validation
* **Schema Evolution**: Designed and executed an automated database migration script (`migrations/001_add_user_status.js`).
* **Connection & Schema Verification**: Validated MongoDB connection string resolution and verified document updates across user collections.

---

## 📁 Repository Structure

```
├── backend/
│   ├── controllers/         # API Controllers
│   ├── migrations/          # Database Migration Scripts (Task 6)
│   │   └── 001_add_user_status.js
│   ├── models/              # Mongoose Database Models
│   ├── routes/              # Express API Routes
│   ├── Dockerfile           # Optimized Production Containerfile
│   ├── package.json         # Node.js Dependencies
│   └── server.js            # Express Entrypoint & /health Endpoint
├── docs/                    # Workflow Documentation & Screenshots
│   └── jenkins_pipeline_success.png
├── Jenkinsfile              # Master DevSecOps Declarative Pipeline
└── README.md                # Project Documentation
```

---

## 🚀 How to Run Locally

### 1. Build and Run Container
```bash
cd backend
docker build -t interior-design-backend:latest .
docker run -d -p 5000:5000 --name app interior-design-backend:latest
```

### 2. Verify Health Endpoint
```bash
curl http://localhost:5000/health
```
**Response**:
```json
{
  "status": "UP",
  "version": "1.0.0",
  "timestamp": "2026-10-07T16:25:00.000Z"
}
```

---

## 👨‍💻 Tech Stack
* **CI/CD Orchestration**: Jenkins
* **Security & Vulnerability Scanning**: Trivy, npm audit
* **Containerization**: Docker, Docker Compose
* **Reverse Proxy / Load Balancing**: Nginx
* **Backend Runtime**: Node.js, Express.js
* **Database**: MongoDB (Mongoose ORM)
* **Cloud Infrastructure**: AWS EC2 (Ubuntu 24.04 LTS)

---
*Developed as part of a hands-on DevSecOps Practical Implementation.*
