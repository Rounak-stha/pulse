# 🏛️ Bazaar Server CI/CD Pipeline: Comprehensive Technical Documentation

This document outlines the complete infrastructure, security model, and deployment process for the `bazaar-server` application on Google Cloud Platform (GCP).

---

## 1. Summary of the Solution

The `bazaar-server` CI/CD pipeline is an automated deployment system utilizing Cloud Build and Cloud Run. The primary architectural goals are security and scalability:

- **Serverless Hosting:** The application resides on **Cloud Run**, enabling automatic scaling to zero when idle and minimizing operational overhead.
- **Security Decoupling:** All sensitive configuration (database credentials, API keys) is stored in **Secret Manager** and injected securely at runtime via IAM policies, ensuring the codebase and container images are free of credentials.
- **Secure Database Access:** Connectivity to **Cloud SQL** (PostgreSQL) is achieved exclusively through the **Cloud SQL Auth Proxy** sidecar, eliminating the need to expose public IPs or manage SSL certificates.

### Detailed Cloud SQL Connection Protocol

The integration of Cloud SQL with Cloud Run is handled by the **Cloud SQL Auth Proxy**, which abstracts away all networking and security complexity.

1.  **Proxy Injection:** When the `--set-cloudsql-instances` flag is used during deployment, Cloud Run automatically injects and runs a small, secure **sidecar container** (the Proxy) alongside the application container instance.
2.  **Socket Path Creation:** The Proxy creates a **virtual Unix socket** inside the container's filesystem at a location corresponding to the instance connection name (e.g., `/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME`).
3.  **Application Configuration:** The application code is configured to set the database host environment variable (e.g., `DB_HOST`) to this specific **socket path value**.
4.  **Process:** The application's database driver attempts to open a connection at the filesystem path (`/cloudsql/...`). The Proxy intercepts this connection, securely wraps the traffic in **TLS 1.3 encryption**, and authenticates it against the Cloud SQL Admin API using the **Cloud Run Service Account's identity**. The data is then forwarded securely to the remote Cloud SQL instance.

This method guarantees that data transferred between the Cloud Run container and Cloud SQL is always encrypted, and external network configuration is unnecessary.

---

## 2. High-Level View of CI/CD Steps

Deployment is executed by Cloud Build using a two-stage process. The pipeline is initiated by a **Cloud Build Trigger** and runs under the context of the **Default Compute Service Account**.

### Cloud Build Trigger and Automation

The pipeline is automated using a **Push to Branch Trigger** on the connected Git repository.

- **Trigger Mechanism:** The trigger is configured to monitor the `main` branch and automatically start a build upon a new commit, ensuring Continuous Integration (CI).
- **Substitution Variables:** Substitution variables are passed to the build:
    - **Built-in:** `$PROJECT_ID` specifies the target project for deployment and Artifact Registry push.
    - **User-defined:** `$_TAG` (currently set to `prod-server`) tags the container image. Other variables are passed for Dockerfile reference.
- **Service Account Context:** The **Default Compute Service Account** is used for the entire build and deploy process.

| Step               | Service                         | Action                                                                                                                                                                                                           | Output                            |
| :----------------- | :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------- |
| **1. Image Build** | Cloud Build (Docker Builder)    | Pulls source code, builds the multi-stage Docker image, and tags it using the substituted `$_TAG` variable.                                                                                                      | Versioned Docker Image            |
| **2. Image Push**  | Cloud Build (Implicit)          | Pushes the tagged image (`$PROJECT_ID/...:$_TAG`) to Artifact Registry, utilizing the Default Compute SA's `Artifact Registry Writer` role.                                                                      | Image stored in Artifact Registry |
| **3. Deployment**  | Cloud Build (Cloud SDK Builder) | Executes the `gcloud run deploy` command, configuring secrets, scaling, and the Cloud SQL proxy.                                                                                                                 | New Cloud Run Service Revision    |
| **4. Startup**     | Cloud Run Runtime               | The new revision starts: IAM check for secrets and SQL access occurs (using the same Default Compute Service Account), sidecar proxy is initialized, the application starts, and the startup probe is performed. | Live, Ready Application Instance  |

---

## 3. GCP Services Used and Their Roles

| GCP Service           | Role in the Pipeline                                                                                                                       | Key Configuration                                                                                                                    |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Artifact Registry** | **Image Storage:** The secure, private repository for all final production-ready container images.                                         | Located in the `asia-south1` region (e.g., `asia-south1-docker.pkg.dev/...`).                                                        |
| **Cloud Build**       | **Orchestrator:** Manages the entire workflow and ensures dependency checks (IAM, configuration) are met before deployment.                | Uses the Cloud SDK builder and explicit `gcloud` entrypoint for reliable execution.                                                  |
| **Cloud Run**         | **Hosting Environment:** Executes the container, managing automatic scaling, request routing, and injecting runtime environment variables. | Configured for minimal resource use (`--min-instances=0`), secure secrets injection (`--update-secrets`), and database connectivity. |
| **Secret Manager**    | **Centralized Vault:** Stores sensitive data like `DB_PASSWORD` and API keys.                                                              | Secrets are referenced by name and version (`SECRET_NAME:latest`) in the deployment configuration.                                   |
| **Cloud SQL**         | **Database:** The managed PostgreSQL instance.                                                                                             | **Secure Connection:** Accessed only via the Cloud SQL Auth Proxy using the instance connection name (`--set-cloudsql-instances`).   |

---

## 4. Application Build Process: Multi-Stage Dockerfile

A **Multi-Stage Dockerfile** is used to optimize the final image size and security.

1.  **Builder Stage (e.g., `builder`):**
    - **Goal:** To compile the application (e.g., run `npm install`, `npm run build`, or similar compilation steps).
    - **Result:** All necessary binaries and build artifacts are created.
2.  **Runtime Stage (Final Image):**
    - **Goal:** To create a small, secure production image that only contains the application's runtime dependencies and compiled code.
    - **Process:** Only copies the _output_ of the builder stage and the minimum runtime environment (e.g., Node.js slim base image).
    - **Benefit:** Reduces the final image size, improving deployment speed, reducing attack surface, and lowering registry storage costs.

### Key Container Startup Requirements

The container must adhere to the following rules imposed by the Cloud Run runtime environment:

- **Port Binding:** The application must explicitly bind to **`0.0.0.0`** and the port specified by the environment variable **`$PORT`** (configured to `3000` in the deployment). Failure to bind to `0.0.0.0` is the single most common cause of container startup failure.
- **Startup Probe:** The configuration uses a long `timeoutSeconds=240` and `periodSeconds=240` to provide sufficient time for application initialization (e.g., database migrations) before failing the health check.

---

## 5. IAM Principles and Required Roles (Security)

The pipeline utilizes the **Default Compute Service Account** (e.g., `[PROJECT_NUMBER]-compute@developer.gserviceaccount.com`) for both the deployment steps and the application's runtime identity. This approach uses a single identity for dual roles.

- **Service Account Used:** Default Compute Service Account.
- **Role in the Pipeline:** Acts as both the **Deployment Identity** (executing Cloud Build/Deployment commands) and the **Runtime Identity** (running the Cloud Run container).

### Specific Permissions Assigned to the Single Service Account

| Action Performed    | Required IAM Role                | Why It's Needed                                                                              | Status (Covered by Your Roles)        |
| :------------------ | :------------------------------- | :------------------------------------------------------------------------------------------- | :------------------------------------ |
| **Image Push**      | `Artifact Registry Writer`       | To push the newly built Docker image to the repository.                                      | ✅ **Artifact Registry Writer**       |
| **Deployment**      | `Cloud Run Developer`            | To create new service revisions and set configurations.                                      | ✅ **Cloud Run Developer**            |
| **Secret Access**   | `Secret Manager Secret Accessor` | **Runtime Role:** To fetch plaintext secret values at container startup.                     | ✅ **Secret Manager Secret Accessor** |
| **SQL Connection**  | `Cloud SQL Client`               | **Runtime Role:** Allows the Cloud SQL Auth Proxy sidecar to establish the encrypted tunnel. | ✅ **Cloud SQL Client**               |
| **Service Control** | `Service Account User`           | Allows one service (Cloud Build) to use the credentials of another service account.          | ✅ **Service Account User**           |
| **Object Read**     | `Storage Object Viewer`          | Needed if the application reads static assets or configuration from GCS buckets.             | ✅ **Storage Object Viewer**          |
| **Cloud Deploy**    | `Cloud Deploy Releaser/Runner`   | Used for rolling out releases if the separate Cloud Deploy service is utilized.              | ✅ **Cloud Deploy Releaser/Runner**   |

> **⚠️ Security Note:** While this specific list of roles is more secure than the generic **Editor** role, utilizing the single **Default Compute Service Account** grants the deployment identity (Cloud Build) the exact same broad runtime access (Secrets, SQL) as the live application. The **industry best practice** is to use **two distinct, custom Service Accounts** with the minimum required roles (Principle of Least Privilege) to minimize the security blast radius.

---

## 6. Detailed Database Connection Protocol (Cloud SQL)

The application connects to Cloud SQL using the following three-part mechanism:

1.  **Deployment Instruction:** The `--set-cloudsql-instances` flag is passed to the Cloud Run API.
2.  **Sidecar Injection:** Cloud Run automatically provisions the **Cloud SQL Auth Proxy** as a sidecar container alongside the application container.
3.  **Local Connection:** The application code is configured to set the database host environment variable (e.g., `DB_HOST`) to the specific **virtual Unix socket path** (e.g., `/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME`). The Proxy intercepts this connection, securely wraps the traffic in TLS and IAM authentication, and forwards it to the remote Cloud SQL instance.
