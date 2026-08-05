# Admin State Machine
**Phase 11**

Defines all possible state transitions controlled by the Administrator.

## State Transitions

### 1. Submitted → Under Review
- **Trigger**: Admin clicks "Begin Review"
- **Current State**: `Submitted`
- **Next State**: `Under Review`
- **Allowed Role**: `Admin`
- **Validation**: Registration must have `registrationNumber`.

### 2. Under Review → Needs Correction
- **Trigger**: Admin clicks "Request Correction"
- **Current State**: `Under Review`
- **Next State**: `Needs Correction`
- **Allowed Role**: `Admin`
- **Validation**: Admin must provide a text `reason`. Team lock is disabled.

### 3. Needs Correction → Submitted
- **Trigger**: Team Leader clicks "Resubmit"
- **Current State**: `Needs Correction`
- **Next State**: `Submitted`
- **Allowed Role**: `Leader`
- **Validation**: Team lock is re-enabled. Checksums/metadata verified.

### 4. Under Review → Approved
- **Trigger**: Admin clicks "Approve"
- **Current State**: `Under Review`
- **Next State**: `Approved`
- **Allowed Role**: `Admin`
- **Validation**: Final permanent lock.

### 5. Under Review → Rejected
- **Trigger**: Admin clicks "Reject"
- **Current State**: `Under Review`
- **Next State**: `Rejected`
- **Allowed Role**: `Admin`
- **Validation**: Admin must provide a text `reason`. Final permanent lock.

### 6. Approved/Rejected → Needs Correction (Emergency)
- **Trigger**: Admin clicks "Emergency Unlock"
- **Current State**: `Approved` OR `Rejected`
- **Next State**: `Needs Correction`
- **Allowed Role**: `Super Admin` OR `Admin`
- **Validation**: Admin must provide a text `reason`. Team lock is disabled.
