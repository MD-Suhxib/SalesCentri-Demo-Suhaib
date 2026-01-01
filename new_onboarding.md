# Onboarding API Examples & User Journey

This document provides human-readable examples of the Onboarding API based on real user journeys. For complete technical documentation, refer to the YAML files in this directory.

## Table of Contents

1. [Anonymous User Journey](#anonymous-user-journey)
2. [Signed User Journey](#signed-user-journey)
3. [User Migration Journey](#user-migration-journey)
4. [Error Scenarios](#error-scenarios)
5. [Complete API Reference](#complete-api-reference)

---

## Anonymous User Journey

### Step 1: Create Anonymous User

**Endpoint**: `POST /api/auth/anon.php`

**Request**:

```json
{}
```

**Response**:

```json
{
  "anon_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Anonymous user created successfully"
}
```

### Step 2: Create Onboarding (Anonymous)

**Endpoint**: `POST /onboarding.php`

**Request**:

```json
{
  "anon_id": "550e8400-e29b-41d4-a716-446655440000",
  "sales_objective": "Generate qualified leads",
  "company_role": "Sales Director or Manager",
  "website_url": "https://example.com",
  "target_industry": "Technology/IT",
  "target_revenue_size": "1M-5M",
  "target_employee_size": "51-200"
}
```

**Response**:

```json
{
  "success": true,
  "onboarding": {
    "id": 1,
    "anon_id": "550e8400-e29b-41d4-a716-446655440000",
    "organization_id": null,
    "sales_objective": "Generate qualified leads",
    "company_role": "Sales Director or Manager",
    "website_url": "https://example.com",
    "target_industry": "Technology/IT",
    "target_revenue_size": "1M-5M",
    "target_employee_size": "51-200",
    "status": "draft",
    "data_processed": false,
    "created_at": "2025-01-27T10:00:00Z"
  },
  "message": "Onboarding created successfully"
}
```

### Step 3: Complete Onboarding (Anonymous)

**Endpoint**: `PATCH /onboarding.php/1`

**Request**:

```json
{
  "anon_id": "550e8400-e29b-41d4-a716-446655440000",
  "sales_objective": "Generate qualified leads",
  "company_role": "Sales Director or Manager",
  "short_term_goal": "Schedule a demo",
  "website_url": "https://example.com",
  "gtm": "B2B",
  "target_industry": "Technology/IT",
  "target_revenue_size": "1M-5M",
  "target_employee_size": "51-200",
  "target_departments": ["Engineering", "Product"],
  "target_region": "North America",
  "target_location": "United States"
}
```

**Response**:

```json
{
  "success": true,
  "onboarding": {
    "id": 1,
    "anon_id": "550e8400-e29b-41d4-a716-446655440000",
    "organization_id": null,
    "sales_objective": "Generate qualified leads",
    "company_role": "Sales Director or Manager",
    "short_term_goal": "Schedule a demo",
    "website_url": "https://example.com",
    "gtm": "B2B",
    "target_industry": "Technology/IT",
    "target_revenue_size": "1M-5M",
    "target_employee_size": "51-200",
    "target_departments": ["Engineering", "Product"],
    "target_region": "North America",
    "target_location": "United States",
    "status": "auth_needed",
    "onboarding_completed": true,
    "data_processed": false,
    "created_at": "2025-01-27T10:00:00Z",
    "updated_at": "2025-01-27T10:15:00Z"
  },
  "message": "Onboarding updated successfully"
}
```

**Note**: Status is `auth_needed` because user is anonymous - no contact list created yet.

---

## Signed User Journey

### Step 1: Create Onboarding (Signed User)

**Endpoint**: `POST /onboarding.php`

**Headers**:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

**Request**:

```json
{
  "sales_objective": "Generate qualified leads",
  "company_role": "Sales Director or Manager",
  "website_url": "https://example.com",
  "target_industry": "Technology/IT",
  "target_revenue_size": "1M-5M",
  "target_employee_size": "50-200"
}
```

**Response**:

```json
{
  "success": true,
  "onboarding": {
    "id": 2,
    "organization_id": 123,
    "anon_id": null,
    "sales_objective": "Generate qualified leads",
    "company_role": "Sales Director or Manager",
    "website_url": "https://example.com",
    "target_industry": "Technology/IT",
    "target_revenue_size": "1M-5M",
    "target_employee_size": "51-200",
    "status": "draft",
    "data_processed": false,
    "created_at": "2025-01-27T11:00:00Z"
  },
  "message": "Onboarding created successfully"
}
```

### Step 2: Complete Onboarding (Signed User)

**Endpoint**: `PATCH /onboarding.php/2`

**Headers**:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

**Request**:

```json
{
  "sales_objective": "Generate qualified leads",
  "company_role": "Sales Director or Manager",
  "short_term_goal": "Schedule a demo",
  "website_url": "https://example.com",
  "gtm": "B2B",
  "target_industry": "Technology/IT",
  "target_revenue_size": "1M-5M",
  "target_employee_size": "50-200",
  "target_departments": ["Engineering", "Product"],
  "target_region": "North America",
  "target_location": "United States"
}
```

**Response**:

```json
{
  "success": true,
  "onboarding": {
    "id": 2,
    "organization_id": 123,
    "anon_id": null,
    "sales_objective": "Generate qualified leads",
    "company_role": "Sales Director or Manager",
    "short_term_goal": "Schedule a demo",
    "website_url": "https://example.com",
    "gtm": "B2B",
    "target_industry": "Technology/IT",
    "target_revenue_size": "1M-5M",
    "target_employee_size": "51-200",
    "target_departments": ["Engineering", "Product"],
    "target_region": "North America",
    "target_location": "United States",
    "status": "completed",
    "onboarding_completed": true,
    "data_processed": false,
    "created_at": "2025-01-27T11:00:00Z",
    "updated_at": "2025-01-27T11:15:00Z"
  },
  "message": "Onboarding updated successfully"
}
```

**Note**: Status is `completed` and contact list was automatically created because user is signed up.

### Step 3: View Contact Lists

**Endpoint**: `GET /lists.php`

**Headers**:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 456,
      "name": "Technology - Generate qualified leads (Jan 27, 2025)",
      "organization_id": 123,
      "onboarding_id": 2,
      "onboarding_status": "completed",
      "members_count": 0,
      "emails_revealed_count": 0,
      "all_emails_revealed": false,
      "created_at": "2025-01-27T11:15:00Z",
      "created_by_email": "user@example.com"
    }
  ],
  "pending_onboarding": []
}
```

### Step 4: Trigger Data Processing

**Endpoint**: `POST /onboarding.php/2/fetch`

**Headers**:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

**Response**:

```json
{
  "success": true,
  "message": "Data processing completed successfully",
  "data_processed": true,
  "lists_populated": 1,
  "populated_lists": [
    {
      "list_id": 456,
      "list_name": "Technology - Generate qualified leads (Jan 27, 2025)",
      "members_added": 150
    }
  ],
  "total_organizations": 25,
  "total_people": 150,
  "onboarding": {
    "id": 2,
    "organization_id": 123,
    "status": "data_processed",
    "data_processed": true,
    "data_processed_at": "2025-01-27T11:30:00Z",
    "organizations_count": 25,
    "people_count": 150,
    "created_at": "2025-01-27T11:00:00Z",
    "updated_at": "2025-01-27T11:30:00Z"
  }
}
```

---

## User Migration Journey

### Step 1: Anonymous User Completes Onboarding

_(Same as Anonymous User Journey Steps 1-3)_

### Step 2: User Signs Up

**Endpoint**: `POST /api/auth/signup.php`

**Request**:

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "company_name": "Example Corp",
  "anon_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response**:

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 789,
    "email": "user@example.com",
    "organization_id": 123
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Step 3: Map Anonymous Onboarding to Organization

**Endpoint**: `PATCH /onboarding.php/1`

**Headers**:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

**Request** (Minimal migration request - only `anon_id` needed):

```json
{
  "anon_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response**:

```json
{
  "success": true,
  "onboarding": {
    "id": 1,
    "organization_id": 123,
    "anon_id": "550e8400-e29b-41d4-a716-446655440000",
    "sales_objective": "Generate qualified leads",
    "company_role": "Sales Director or Manager",
    "short_term_goal": "Schedule a demo",
    "website_url": "https://example.com",
    "gtm": "B2B",
    "target_industry": "Technology/IT",
    "target_revenue_size": "1M-5M",
    "target_employee_size": "51-200",
    "target_departments": ["Engineering", "Product"],
    "target_region": "North America",
    "target_location": "United States",
    "status": "completed",
    "onboarding_completed": true,
    "data_processed": false,
    "created_at": "2025-01-27T10:00:00Z",
    "updated_at": "2025-01-27T12:30:00Z"
  },
  "message": "Onboarding updated successfully"
}
```

**What happens during migration**:

- When both `anon_id` and Bearer token are present, the system automatically migrates the anonymous onboarding to the organization
- The same record (ID 1) gets `organization_id` added while preserving the `anon_id`
- **No record deletion or merging** - the original record is simply linked to both anonymous user and organization
- Multiple onboarding records per organization are supported
- Status becomes `completed` (since user is now authenticated)
- Contact list is automatically created because user is signed up

**Note**: You only need to send `anon_id` in the request body for migration. All other fields are preserved from the existing record. This is a PATCH operation, so partial updates are supported.

### Step 4: View Lists (After Migration)

**Endpoint**: `GET /lists.php`

**Headers**:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 456,
      "name": "Technology - Generate qualified leads (Jan 27, 2025)",
      "organization_id": 123,
      "onboarding_id": 1,
      "onboarding_status": "completed",
      "members_count": 0,
      "emails_revealed_count": 0,
      "all_emails_revealed": false,
      "created_at": "2025-01-27T12:30:00Z",
      "created_by_email": "user@example.com"
    }
  ],
  "pending_onboarding": []
}
```

**Note**: After migration, the onboarding is automatically completed and a contact list is created. The list appears in the main `data` section, not in `pending_onboarding`.

### Step 5: Trigger Data Processing

**Endpoint**: `POST /onboarding.php/1/fetch`

**Headers**:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 457,
      "name": "Technology - Generate qualified leads (Jan 27, 2025)",
      "organization_id": 123,
      "onboarding_id": 1,
      "onboarding_status": "completed",
      "members_count": 0,
      "emails_revealed_count": 0,
      "all_emails_revealed": false,
      "created_at": "2025-01-27T12:00:00Z",
      "created_by_email": "user@example.com"
    }
  ],
  "pending_onboarding": []
}
```

---

## Error Scenarios

### Error 1: Anonymous User Tries to Create List

**Endpoint**: `POST /onboarding.php/1/create-list`

**Request**:

```json
{
  "anon_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response**:

```json
{
  "success": false,
  "message": "User must be signed up to create contact lists"
}
```

### Error 2: Data Processing Already Triggered

**Endpoint**: `POST /onboarding.php/2/fetch`

**Headers**:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

**Response**:

```json
{
  "success": false,
  "message": "Data processing has already been triggered for this onboarding",
  "data_processed": true,
  "onboarding": {
    "id": 2,
    "status": "data_processed",
    "data_processed": true,
    "data_processed_at": "2025-01-27T11:30:00Z"
  }
}
```

### Error 3: Onboarding Not Complete

**Endpoint**: `POST /onboarding.php/3/fetch`

**Headers**:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

**Response**:

```json
{
  "success": false,
  "message": "Onboarding must be completed before triggering data processing",
  "onboarding": {
    "id": 3,
    "status": "draft"
  }
}
```

### Error 4: List Already Exists

**Endpoint**: `POST /onboarding.php/1/create-list`

**Headers**:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

**Response**:

```json
{
  "success": false,
  "message": "Contact list already exists for this onboarding",
  "existing_list": {
    "id": 457,
    "name": "Technology - Generate qualified leads (Jan 27, 2025)",
    "onboarding_id": 1
  }
}
```

---

## Troubleshooting

### "User does not have permission" Error

If you're getting a permission error when trying to access onboarding data after signing up, make sure you've completed the **migration step**:

1. **Check if you've done the migration**: Call `PATCH /onboarding.php/{id}` with both:
   - `anon_id` in the request body (can be the only field sent)
   - `Authorization: Bearer <token>` header

2. **Verify the onboarding is linked**: After migration, the response should show:
   - `organization_id`: Set to your organization ID
   - `anon_id`: Preserved from the original record (not set to null)
   - `status`: Set to `completed`

3. **Common causes of permission errors**:
   - Missing Bearer token in the request
   - Not including `anon_id` in the request body during migration
   - Trying to access onboarding before completing the migration step
   - Using wrong onboarding ID

4. **Migration behavior**: The migration simply adds `organization_id` to the existing record while preserving the `anon_id`. No records are deleted or merged.

### Migration Process Explained

The migration process happens automatically when you make any API call with both authentication methods:

- **Bearer token**: Identifies you as a signed-up user with an organization
- **anon_id**: Identifies your previous anonymous session

When both are present, the system:

1. Migrates the anonymous onboarding record to your organization
2. Updates all related contact lists (if any)
3. Allows you to access the data with your organization credentials

---

## Complete API Reference

### Base URL

```
Production: https://api.salescentri.com
Staging: https://staging-api.salescentri.com
```

### Authentication

- **Anonymous Users**: Include `anon_id` in request body or as query parameter
- **Signed Users**: Include `Authorization: Bearer <token>` header

### Endpoints Summary

| Method   | Endpoint                           | Description                                     | Auth Required |
| -------- | ---------------------------------- | ----------------------------------------------- | ------------- |
| `GET`    | `/onboarding.php`                  | Get all onboarding records                      | Yes           |
| `GET`    | `/onboarding.php/{id}`             | Get specific onboarding                         | Yes           |
| `POST`   | `/onboarding.php`                  | Create new onboarding                           | Yes           |
| `PUT`    | `/onboarding.php/{id}`             | Update onboarding                               | Yes           |
| `POST`   | `/onboarding.php/{id}/create-list` | Create contact list from auth_needed onboarding | Yes (Signed)  |
| `POST`   | `/onboarding.php/{id}/fetch`       | Trigger data processing                         | Yes           |
| `DELETE` | `/onboarding.php/{id}`             | Delete onboarding                               | Yes           |

### Status Values

- `draft`: Onboarding is incomplete
- `auth_needed`: Anonymous user completed onboarding, needs to sign up
- `completed`: Onboarding complete, ready for data processing
- `data_processed`: Data processing completed

### Valid Enum Values

**sales_objective:**

- `Generate qualified leads`
- `Expand into a new region or sector`
- `Enrich or clean an existing list`
- `Purchase a new contact list`

**company_role:**

- `Founder / CEO`
- `Sales Director or Manager`
- `Marketing Director or Manager`
- `Sales Development Representative (SDR)`
- `Consultant / Advisor`
- `Other`

**short_term_goal:**

- `Schedule a demo`
- `Purchase or download contacts`
- `Enrich my existing list`
- `Create a new list from scratch`
- `Get advice on strategy`

**gtm:**

- `B2B`
- `B2C`
- `B2G`
- `BOTH`

**target_industry:**

- `Accounting/Finance`
- `Advertising/Public Relations`
- `Aerospace/Aviation`
- `Agriculture/Livestock`
- `Animal Care/Pet Services`
- `Arts/Entertainment/Publishing`
- `Automotive`
- `Banking/Mortgage`
- `Business Development`
- `Business Opportunity`
- `Clerical/Administrative`
- `Construction/Facilities`
- `Education/Research`
- `Energy/Utilities`
- `Food/Beverage`
- `Government/Non-Profit`
- `Healthcare/Wellness`
- `Legal/Security`
- `Manufacturing/Industrial`
- `Real Estate/Property`
- `Retail/Wholesale`
- `Technology/IT`
- `Transportation/Logistics`
- `Other`
- `NA`

**target_revenue_size:**

- `0-500K`
- `500K-1M`
- `1M-5M`
- `5M-10M`
- `10M-50M`
- `50M-100M`
- `100M-500M`
- `500M-1B`
- `1B-5B`
- `5B+`
- `NA`

**target_employee_size:**

- `0-10`
- `11-50`
- `51-200`
- `201-500`
- `501-1000`
- `1000-5000`
- `5001-10000`
- `10001-50000`
- `50001-100000`
- `100000+`
- `NA`

**target_region:**

- `India`
- `North America`
- `Europe`
- `Asia-Pacific`
- `Global / Multiple regions`

**target_departments (JSON array):**

- `Sales`
- `Marketing`
- `Engineering`
- `Product`
- `Operations`
- `Finance`
- `HR`
- `Customer Success`
- `Business Development`
- `Executive`

### Response Format

All responses use the standardized envelope format:

```json
{
  "success": true|false,
  "data": {...},
  "message": "Human readable message",
  "error": "Error message (if success: false)"
}
```

---

## Quick Start Guide

### For Anonymous Users:

1. Create anonymous user: `POST /api/auth/anon.php`
2. Create onboarding: `POST /onboarding.php` with `anon_id`
3. Complete onboarding: `PATCH /onboarding.php/{id}` with all required fields (can be sent over multiple PATCH requests)
4. Sign up: `POST /api/auth/signup.php` with `anon_id`
5. **Map onboarding to organization**: `PATCH /onboarding.php/{id}` with both `anon_id` and Bearer token
6. Create contact list: `POST /onboarding.php/{id}/create-list`
7. Process list: `POST /onboarding.php/{id}/fetch`

### For Signed Users:

1. Create onboarding: `POST /onboarding.php` with JWT token
2. Complete onboarding: `PATCH /onboarding.php/{id}` with all required fields (list created automatically when completion is detected)
3. Process list: `POST /onboarding.php/{id}/fetch`

---

_For complete technical documentation, refer to the YAML files in this directory._
