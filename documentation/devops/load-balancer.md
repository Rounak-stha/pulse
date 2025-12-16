# Comprehensive Documentation: Global HTTPS Load Balancer for pulse-backend

**Purpose:** To document the full process, configurations, challenges, and resolutions for setting up a Google Cloud **Global HTTPS Load Balancer** in front of the `pulse-backend` Cloud Run service, including custom domains, certificates, DNS, IAM, and HTTP → HTTPS redirection. This serves as a historical guide for future reference.

---

## Motivation / Why We Needed the Load Balancer

- Goal: Serve the `pulse-backend` Cloud Run service securely over **HTTPS** via **custom domains** (Currently using this domain `tdata.app` and `www.tdata.app`).
- Cloud Run alone provides HTTPS endpoints, but **custom domains require a load balancer**.
- Additional benefits of a Global HTTPS Load Balancer (GCLB):
    - TLS termination with Google-managed certificates
    - Host-based routing for multiple domains in the future
    - A **single global static IP** that can be referenced in DNS
    - Optional **Cloud CDN** integration to reduce latency for users globally
    - Ability to automatically redirect HTTP → HTTPS for better UX and security

**Extra context:** Initially, we had the Cloud Run service deployed in `asia-south1` (Mumbai) to reduce latency for our primary users. The global load balancer ensures requests are securely terminated and routed, even though the LB itself is “global” and cannot be region-selected.

---

## Why We Did Not Use Domain Mapping

Initially, we had the Cloud Run service `pulse-backend` fully set up in **asia-south1** (Mumbai), which included the database, CI/CD, and secrets. Using **Cloud Run’s built-in domain mapping** would have been the straightforward way to assign custom domains to the service.

However, **asia-south1 does not support domain mapping**, so we attempted to move the service to other supported Asian regions, like **asia-east1** (Taiwan) and **asia-northeast1** (Tokyo), to use domain mapping.

---

### Process Attempted in `asia-east1` and Tokyo

1. Deleted the Cloud Run service, database, and other resources in `asia-south1` to prepare for redeployment.
2. Recreated the service and associated infrastructure in the new region.
3. Faced **quota exceeded errors** despite deleting previous resources.
    - Quotas for CPU, memory, and Cloud SQL instances were not immediately released.
    - The errors prevented full deployment of the Cloud Run service and database.

---

### Reverting Back to `asia-south1`

1. Due to the persistent quota issues in other regions, we **recreated everything back in asia-south1**:
    - Cloud Run service `pulse-server`
    - Cloud SQL database
    - Artifact Registry images
2. Since domain mapping was not an option in asia-south1, we decided to set up a **Global HTTPS Load Balancer with a serverless NEG** to achieve the custom domain routing and HTTPS termination.

Domain mapping was initially preferred, but **region support limitations and quota issues** forced us to revert to asia-south1 and implement the Global HTTPS Load Balancer solution.

---

## Services and Resources Created / Used

| Resource                    | Purpose                                                    | Notes                               |
| --------------------------- | ---------------------------------------------------------- | ----------------------------------- |
| `pulse-server` (Cloud Run)  | Backend service hosting the container                      | Region: `asia-south1`               |
| `pulse-load-balancer`       | Global external HTTPS load balancer                        | Required for custom domain          |
| `pulse-cert`                | Google-managed certificate for tihe domains we want to use | Must become ACTIVE for HTTPS        |
| `pulse-cloud-run-global-ip` | Reserved global static IP                                  | Used in DNS A records               |
| Serverless NEG              | Connect LB to Cloud Run                                    | Health shows N/A, expected behavior |
| DNS A records               | Point domain/subdomain to global static IP                 | Verified via `dnschecker.org`       |

**IAM / Roles**

- Cloud Build Service Account (deployer) required:
    - `Artifact Registry Writer`
    - `Cloud Deploy Releaser` & `Cloud Deploy Runner`
    - `Cloud Run Developer`
    - `Cloud SQL Client`
    - `Secret Manager Secret Accessor`
    - `Service Account User`
- **Important:**  
  **Note:** `roles/run.admin` or `roles/run.securityAdmin` is required for `--allow-unauthenticated` to actually set the policy.

---

## Load Balancer Setup

### Reserve Global Static IP

- Navigation: `VPC network → IP addresses → Reserve static IP → Type: Global`
- Name used: `pulse-cloud-run-global-ip`
- This IP is referenced in the A records in the DNS provider.
- **Note:** There is a small cost while reserved but not used.

### Frontend Configuration

- Protocol: **HTTPS**
- Port: **443**
- IP: **pulse-cloud-run-global-ip** (reserved global static IP)
- Certificate: Google-managed (`pulse-cert`)
- Option selected: **Automatically redirect HTTP → HTTPS**
    - GCP auto-created a new HTTP frontend to perform redirect → simplified enforcement of HTTPS
- Certificate provisioning: 15–30 minutes

### Create Serverless NEG

- Backend type: **Serverless Network Endpoint Group**
- Connects LB → Cloud Run service `pulse-backend` in `asia-south1`
- Health: N/A → normal for serverless backends

### Routing / URL Map

- Host rules / URL map:
    - Default (All unmatched) → `pulse-backend`

### DNS Setup

- `tdata.app` → A record → `pulse-cloud-run-global-ip`
- `www.tdata.app` → A record → `pulse-cloud-run-global-ip`
- Verified globally with `dnschecker.org` → propagation confirmed

---

## 4. Challenges & Resolutions

| Issue                           | Cause                                     | Resolution                                                                                    |
| ------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| `www.tdata.app` not loading     | Not included in certificate / host rule   | Created new cert with both domains, updated URL map host rule                                 |
| 403 Forbidden on Cloud Run URL  | `--allow-unauthenticated` silently failed | Added Cloud Build SA roles: `roles/run.admin` (**Note:** required for unauthenticated policy) |
| Serverless NEG health shows N/A | Serverless backends don’t report health   | Normal, does not block routing                                                                |
| Certificate provisioning delay  | Google-managed cert needs DNS validation  | Waited 15–30 min, confirmed DNS propagation                                                   |

---

## 5. Testing & Verification

1. **Cloud Run direct URL** → `https://pulse-backend-xxxx.a.run.app` → works
2. **Reserved global IP** → `https://<pulse-cloud-run-global-ip>` → loads (cert warning if domain mismatch)
3. **Custom domain** → `https://tdata.app` → works (after cert ACTIVE)
4. **Custom subdomain** → `https://www.tdata.app` → works after new cert + URL map update
5. **HTTP → HTTPS redirection** → automatically enforced by GCP

**Observation:** Serverless NEGs do not show health, but routing and SSL termination work as expected.

---

## 6. Notes / Lessons Learned

- Google-managed certificates cannot be edited; must create a new cert for additional domains
- DNS must propagate **before** certificate provisioning, otherwise cert issuance fails
- Explicit IAM roles are required for public Cloud Run access:
    - **roles/run.admin** or **roles/run.securityAdmin** for `--allow-unauthenticated`
- Global LB is always global; cannot choose region. The backend region can differ.
- HTTP → HTTPS redirection option simplifies user access.
- Verifying LB by opening the **global static IP** helps isolate DNS vs. LB issues
- All configuration must ensure frontend IP + certificate + host rule + backend are correctly wired

---

## 7. Final Result

- Cloud Run service `pulse-backend` running in `asia-south1`
- Global HTTPS Load Balancer `pulse-load-balancer` serving:
    - `tdata.app` → ✅ works
    - `www.tdata.app` → ✅ works
    - Automatic HTTP → HTTPS redirection → ✅ enforced
- Reserved global static IP `pulse-cloud-run-global-ip`
- Public, unauthenticated access working correctly
- Fully documented for future reference and replication

---
