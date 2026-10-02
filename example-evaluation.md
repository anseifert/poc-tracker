# OpenShift POC Evaluation (Example)

Use this file to try **Markdown** import: open the app → **Markdown** tab → paste this entire file → **Import markdown**.

## Virtualization

### 1. Core functional parity

| Criteria | Description | Success Criteria | Notes |
| --- | --- | --- | --- |
| VM workload import | Import VMs from VMware using MTV. | VM boots cleanly post-migration. | |
| Workload type validation | Windows, Linux, and database workloads. | Apps run without modification. | In progress |
| Storage and drives | Multi-disk and encrypted volume handling. | Disks expand and mount as expected. | |

### 2. Networking equivalency

| Criteria | Description | Success Criteria | Notes |
| --- | --- | --- | --- |
| L2 and multi-NIC | VLAN-backed networks and multiple NICs per VM. | Segmentation behaves as expected. | Completed |
| Traffic flow | North-south and east-west paths. | Apps reachable on existing IP schemes. | |

### 3. High availability

| Criteria | Description | Success Criteria | Notes |
| --- | --- | --- | --- |
| Node failure recovery | Simulate hard node failure. | VMs restart on surviving nodes within SLA. | |
| Live migration | Maintenance evacuation and live migrate. | No dropped connections during migrate. | |

## Kubernetes

| Criteria | Description | Success Criteria | Notes |
| --- | --- | --- | --- |
| Infrastructure management | Deploy OpenShift on bare metal (IPI or Assisted). | Working cluster on OCP 4.latest. | Completed |
| Self-service provisioning | Users provision VMs for control-plane nodes via console. | Namespace isolation demonstrated. | |
| Networking validation | VLANs, DNS, and load balancer integration. | Traffic in and out of cluster validated. | Needs more testing |
| Storage validation | Storage classes, PVs, snapshots. | Storage integrates with backend arrays. | |
| Day 2 operations | Monitoring, logging, RBAC, LDAP. | Policies match internal SOP. | |
