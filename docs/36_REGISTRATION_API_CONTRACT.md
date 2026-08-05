# Registration API Contract
**Version 1.0**

Strictly defines the Registration module's API endpoints. Controllers, Validation layers, and the Frontend MUST adhere to this contract.

---

## 1. Get Current Registration
**Method:** `GET`  
**URL:** `/api/v1/registration/me`  
**Authentication:** Required (JWT)  
**Authorization:** Leader & Member  
**Request Body:** None  
**Success Response (200):**
```json
{
  "success": true,
  "message": "Registration fetched successfully",
  "data": { "registration": { /* Draft Object */ }, "overallProgress": 45 },
  "errors": null,
  "requestId": "uuid"
}
```
**Error Responses:** `REG_001` (404 Draft Not Found)

---

## 2. Start Registration / Auto-Save Details
**Method:** `PUT`  
**URL:** `/api/v1/registration/details`  
**Authentication:** Required (JWT)  
**Authorization:** Leader Only  
**Request Body:**
```json
{
  "title": "String",
  "abstract": "String",
  "theme": "String",
  "keywords": ["Array of Strings"],
  "authors": [
    { "userId": "String", "role": "Corresponding Author", "order": 1 }
  ]
}
```
**Success Response (200):**
```json
{
  "success": true,
  "message": "Draft saved successfully",
  "data": { "version": 2, "lastSaved": "timestamp" },
  "errors": null,
  "requestId": "uuid"
}
```
**Validation Rules:** `title` (max 200 chars). Payload allows partial updates for Auto-Save functionality.  
**Error Responses:** `REG_002` (Locked), `REG_006` (Leader Only), `REG_010` (Invalid Authors)

---

## 3. Upload Research Paper
**Method:** `POST`  
**URL:** `/api/v1/registration/upload`  
**Authentication:** Required (JWT)  
**Authorization:** Leader Only  
**Request Body:** `multipart/form-data` (Field name: `paper`)  
**Success Response (201):**
```json
{
  "success": true,
  "message": "Paper uploaded successfully",
  "data": { "fileUrl": "...", "version": 2 },
  "errors": null,
  "requestId": "uuid"
}
```
**Validation Rules:** PDF only, application/pdf, max 10MB.  
**Error Responses:** `REG_002` (Locked), `REG_006` (Leader Only), `REG_007` (Invalid MIME), `REG_008` (Too Large), `REG_009` (Duplicate Hash)

---

## 4. Final Submit Registration
**Method:** `POST`  
**URL:** `/api/v1/registration/submit`  
**Authentication:** Required (JWT)  
**Authorization:** Leader Only  
**Request Body:**
```json
{
  "declarationChecked": true
}
```
**Success Response (200):**
```json
{
  "success": true,
  "message": "Registration submitted successfully. Team is now locked.",
  "data": { "status": "Submitted" },
  "errors": null,
  "requestId": "uuid"
}
```
**Validation Rules:** Requires all draft fields to be strictly populated. Requires PDF to exist. Requires `declarationChecked: true`.  
**Error Responses:** `REG_002` (Already Locked), `REG_003` (Missing Field), `REG_004` (Missing Paper), `REG_005` (Declaration Required), `REG_006` (Leader Only)

---

## 5. Get Registration Version History
**Method:** `GET`  
**URL:** `/api/v1/registration/history`  
**Authentication:** Required (JWT)  
**Authorization:** Leader Only  
**Success Response (200):** Array of historical payload snapshots and uploaded PDF references.

---

## 6. Restore Draft Version
**Method:** `POST`  
**URL:** `/api/v1/registration/restore/:versionId`  
**Authentication:** Required (JWT)  
**Authorization:** Leader Only  
**Success Response (200):** Restores active draft to the targeted version state.  
**Error Responses:** `REG_002` (Locked), `REG_011` (Invalid Version Target)
