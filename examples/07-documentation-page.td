# API Documentation {huge-bold}

## Version 2.0 {xl muted}

Last updated: October 4, 2025 {small muted}

---

:::container
# Getting Started {huge-bold fade-in}

## Authentication {xl-bold}

All API requests require authentication using Bearer tokens. {large}

:::card {light-glass}
### :icon[key]{warning} Obtaining an API Key

1. Log in to your dashboard
2. Navigate to Settings → API Keys
3. Click "Create New Key"
4. Copy your key and store it securely

:::alert {warning}
:icon[alert-triangle]{warning} **Important:** Never share your API key or commit it to version control!
:::
:::

### :icon[lock]{primary} Making Authenticated Requests

Include your API key in the `Authorization` header:

```bash
curl https://api.example.com/v2/users \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

# Endpoints {huge-bold fade-in}

## Users {xl-bold}

### :icon[users]{info} GET /users

Retrieve a list of all users.

:::card {elevated}
**Request**

```bash
GET /v2/users?page=1&limit=10
```

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 10, max: 100) |
| `sort` | string | Sort field (default: created_at) |

**Response**

```json
{
  "data": [
    {
      "id": "usr_123",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}
```
:::

### :icon[user-plus]{success} POST /users

Create a new user.

:::card {elevated}
**Request**

```bash
POST /v2/users
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "admin"
}
```

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | User's full name |
| `email` | string | Yes | Valid email address |
| `role` | string | No | User role (default: user) |

**Response**

```json
{
  "id": "usr_124",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "admin",
  "created_at": "2025-10-04T14:22:00Z"
}
```

**Status Codes**
- :icon[check]{success xs} `201 Created` - User created successfully
- :icon[x]{error xs} `400 Bad Request` - Invalid input
- :icon[alert-circle]{warning xs} `409 Conflict` - Email already exists
:::

---

## :icon[alert-octagon]{error} Error Handling {xl-bold}

The API uses standard HTTP status codes and returns errors in a consistent format.

:::card {light-glass}
### Error Response Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request body is invalid",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_REQUEST` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
:::

---

# :icon[clock]{warning} Rate Limiting {huge-bold fade-in}

:::card {elevated}
API requests are limited by plan:

| Plan | Requests per Minute | Burst Limit |
|------|---------------------|-------------|
| Free | 60 | 100 |
| Pro | 600 | 1,000 |
| Enterprise | 6,000 | 10,000 |

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 587
X-RateLimit-Reset: 1696425600
```

:::alert {info}
:icon[info]{info} When rate limits are exceeded, the API returns a `429 Too Many Requests` status code.
:::
:::

---

# :icon[package]{primary} SDKs and Libraries {huge-bold fade-in}

:::grid
:::card {light-glass slide-up}
### :icon[code]{warning lg} JavaScript/TypeScript
```bash
npm install @example/sdk
```
[View Docs](#) :icon[external-link]{xs} | [GitHub](#) :icon[github]{xs}
:::

:::card {light-glass slide-up}
### :icon[code]{info lg} Python
```bash
pip install example-sdk
```
[View Docs](#) :icon[external-link]{xs} | [GitHub](#) :icon[github]{xs}
:::

:::card {light-glass slide-up}
### :icon[code]{primary lg} Go
```bash
go get github.com/example/sdk-go
```
[View Docs](#) :icon[external-link]{xs} | [GitHub](#) :icon[github]{xs}
:::

:::card {light-glass slide-up}
### :icon[code]{error lg} Ruby
```bash
gem install example-sdk
```
[View Docs](#) :icon[external-link]{xs} | [GitHub](#) :icon[github]{xs}
:::
:::

---

# :icon[life-buoy]{success} Support {huge-bold fade-in}

:::card {subtle-glass}
Need help? We're here for you!

- :icon[mail]{primary} Email: api@example.com
- :icon[message-circle]{secondary} Discord: [Join our community](#)
- :icon[book-open]{info} More docs: [docs.example.com](#)
- :icon[bug]{error} Report bugs: [GitHub Issues](#)
:::
:::
