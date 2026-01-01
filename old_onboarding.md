# Onboarding API Documentation

## Overview

The onboarding API allows users to save their preferences and target criteria. Based on these preferences, the system automatically generates targeted contact lists to help you reach your ideal prospects.

## Endpoints

### Create/Update Onboarding

```http
POST /api/onboarding.php
```

#### Authentication

- **Anonymous Users:** No authentication required
- **Logged-in Users:** Bearer token required in Authorization header

#### Request Body

```json
{
  "sales_objective": "Generate qualified leads",
  "company_role": "Founder / CEO",
  "short_term_goal": "Create a new list from scratch",
  "website_url": "https://example.com",
  "gtm": "B2B",
  "target_industry": "Technology/IT",
  "target_revenue_size": "1M-5M",
  "target_employee_size": "51-200",
  "target_departments": ["Engineering", "Sales"],
  "target_region": "North America",
  "target_location": "San Francisco"
}
```

#### Required Fields

**Sales Objective** (`sales_objective`)

- Type: string
- Description: Your primary sales goal
- Valid values:
  - "Generate qualified leads"
  - "Expand into a new region or sector"
  - "Enrich or clean an existing list"
  - "Purchase a new contact list"

**Company Role** (`company_role`)

- Type: string
- Description: Your role in the company
- Valid values:
  - "Founder / CEO"
  - "Sales Director or Manager"
  - "Marketing Director or Manager"
  - "Sales Development Representative (SDR)"
  - "Consultant / Advisor"
  - "Other"

**Short Term Goal** (`short_term_goal`)

- Type: string
- Description: Your immediate objective
- Valid values:
  - "Schedule a demo"
  - "Purchase or download contacts"
  - "Enrich my existing list"
  - "Create a new list from scratch"
  - "Get advice on strategy"

**Website URL** (`website_url`)

- Type: string
- Description: Your company website URL
- Valid values: Any valid URL format

**Go-to-Market Strategy** (`gtm`)

- Type: string
- Description: Your go-to-market approach
- Valid values:
  - "B2B"
  - "B2C"
  - "B2G"
  - "BOTH"

**Target Industry** (`target_industry`)

- Type: string
- Description: Industry sector you're targeting
- Valid values:
  - "Accounting/Finance"
  - "Advertising/Public Relations"
  - "Aerospace/Aviation"
  - "Agriculture/Livestock"
  - "Animal Care/Pet Services"
  - "Arts/Entertainment/Publishing"
  - "Automotive"
  - "Banking/Mortgage"
  - "Business Development"
  - "Business Opportunity"
  - "Clerical/Administrative"
  - "Construction/Facilities"
  - "Education/Research"
  - "Energy/Utilities"
  - "Food/Beverage"
  - "Government/Non-Profit"
  - "Healthcare/Wellness"
  - "Legal/Security"
  - "Manufacturing/Industrial"
  - "Real Estate/Property"
  - "Retail/Wholesale"
  - "Technology/IT"
  - "Transportation/Logistics"
  - "Other"
  - "NA"

**Target Revenue Size** (`target_revenue_size`)

- Type: string
- Description: Revenue range of target companies
- Valid values:
  - "0-500K"
  - "500K-1M"
  - "1M-5M"
  - "5M-10M"
  - "10M-50M"
  - "50M-100M"
  - "100M-500M"
  - "500M-1B"
  - "1B-5B"
  - "5B+"
  - "NA"

**Target Employee Size** (`target_employee_size`)

- Type: string
- Description: Employee count range of target companies
- Valid values:
  - "0-10"
  - "11-50"
  - "51-200"
  - "201-500"
  - "501-1000"
  - "1000-5000"
  - "5001-10000"
  - "10001-50000"
  - "50001-100000"
  - "100000+"
  - "NA"

**Target Departments** (`target_departments`)

- Type: array
- Description: Departments you want to target
- Valid values: Array of strings (e.g., ["Engineering", "Sales"])

**Target Region** (`target_region`)

- Type: string
- Description: Geographic region you want to target
- Valid values:
  - "India"
  - "North America"
  - "Europe"
  - "Asia-Pacific"
  - "Global / Multiple regions"

**Target Location** (`target_location`)

- Type: string
- Description: Specific location you want to target
- Valid values: Any location string (e.g., "San Francisco")

#### Optional Fields

**Target Audience List Exists** (`target_audience_list_exist`)

- Type: boolean
- Description: Whether you already have a target audience list
- Valid values:
  - `true`
  - `false`
  - `"true"`
  - `"false"`
  - `"1"`
  - `"0"`
  - `""` (converts to false)

#### Custom Values

For each enum field, you can provide a custom value using the `_raw` suffix:

```json
{
  "sales_objective": "Generate qualified leads",
  "sales_objective_raw": "Custom sales objective",
  "company_role": "Other",
  "company_role_raw": "Custom role"
}
```

#### Response

##### Success (200/201)

```json
{
  "id": 123,
  "organization_id": 456, // If authenticated
  "anon_id": 789, // If anonymous
  "sales_objective": "Generate qualified leads",
  // ... all submitted fields ...
  "created_at": "2024-08-05T17:22:24Z",
  "updated_at": "2024-08-05T17:22:24Z"
}
```

##### Validation Error (400)

```json
{
  "error": "Validation failed",
  "details": [
    "Invalid value for 'gtm': 'Invalid'. Valid values are: B2B, B2C, B2G, BOTH"
  ]
}
```

##### Authentication Error (401)

```json
{
  "error": "Authentication required"
}
```

### Get Onboarding

```http
GET /api/onboarding.php
```

Returns current onboarding data for the authenticated user or anonymous session.

### Delete Onboarding

```http
DELETE /api/onboarding.php
```

Deletes onboarding data for the authenticated user or anonymous session.

## Authentication Flow

1. **Start as Anonymous User:**

   - Begin without authentication
   - System provides an anonymous identifier
   - Store onboarding preferences

2. **After Signup:**
   - Include anonymous identifier in signup request
   - System preserves onboarding data
   - Future requests use authentication token

## Features

When all required fields are provided, the system automatically:

1. Analyzes your target criteria
2. Identifies matching organizations
3. Creates a targeted contact list
4. Populates the list with relevant contacts

This process happens automatically in the background after saving your preferences.

## Rate Limiting

The API implements standard rate limiting. Please contact support for specific limits and enterprise requirements.

## Best Practices

1. **Provide Accurate Data:**

   - Use specific values where possible
   - Avoid "NA" unless truly not applicable
   - Be precise with target locations

2. **Use Custom Values Wisely:**

   - Use `_raw` fields when standard options don't fit
   - Keep custom values clear and specific

3. **Handle Responses Properly:**
   - Store the returned ID for future reference
   - Check for validation errors before retrying
   - Implement proper error handling

## Support

For API support or questions, please contact:

- Email: api-support@example.com
- Documentation: https://docs.example.com
- Status Page: https://status.example.com