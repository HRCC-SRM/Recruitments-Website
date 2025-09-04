# HRCC Recruitment System - API Routes Documentation

## Overview
This document provides comprehensive documentation for all API endpoints in the HRCC Recruitment System backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication Routes

### Admin Login
**POST** `/admin/login`

Login for admin users (super admin and domain leads).

**Request Body:**
```json
{
  "username": "superadmin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "username": "superadmin",
    "email": "superadmin@hrcc.com",
    "role": "super_admin",
    "domain": null,
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

### Admin Logout
**POST** `/admin/logout`

Logout admin user (requires authentication).

**Response:**
```json
{
  "message": "Logout successful",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Get Admin Profile
**GET** `/admin/profile`

Get current admin profile (requires authentication).

**Response:**
```json
{
  "message": "Admin profile retrieved successfully",
  "admin": {
    "id": "admin_id",
    "username": "superadmin",
    "email": "superadmin@hrcc.com",
    "role": "super_admin",
    "domain": null,
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 👥 User Registration Routes

### Register User
**POST** `/auth/register`

Register a new user for recruitment.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9999999999",
  "srmEmail": "xyz@srmist.edu.in",
  "regNo": "RA123456789",
  "branch": "CSE",
  "yearOfStudy": 1,
  "domain": "Technical",
  "linkedinLink": "https://www.linkedin.com/in/johndoe"
}
```

**Response:**
```json
{
  "message": "Registration successful.",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9999999999",
    "srmEmail": "xyz@srmist.edu.in",
    "regNo": "RA123456789",
    "branch": "CSE",
    "yearOfStudy": 1,
    "domain": "Technical",
    "linkedinLink": "https://www.linkedin.com/in/johndoe"
  }
}
```

---

## 🔧 Technical Dashboard Routes

**Access:** Super Admin, Technical Lead

### Get Technical Users
**GET** `/technical-dashboard/users`

Get all technical domain users with pagination and filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (active, shortlisted, rejected, omitted)
- `search` (optional): Search by name, email, regNo, branch

**Example:**
```
GET /technical-dashboard/users?page=1&limit=10&status=active&search=john
```

**Response:**
```json
{
  "message": "Technical users retrieved successfully",
  "users": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Technical Statistics
**GET** `/technical-dashboard/stats`

Get technical domain statistics.

**Response:**
```json
{
  "message": "Technical domain statistics retrieved successfully",
  "stats": {
    "totalUsers": 100,
    "statusBreakdown": {
      "active": 60,
      "shortlisted": 25,
      "rejected": 10,
      "omitted": 5
    },
    "yearBreakdown": {
      "year1": 70,
      "year2": 30
    },
    "branchBreakdown": [
      {"_id": "CSE", "count": 40},
      {"_id": "IT", "count": 35},
      {"_id": "ECE", "count": 25}
    ]
  }
}
```

### Get Single Technical User
**GET** `/technical-dashboard/users/:userId`

Get details of a specific technical user.

**Response:**
```json
{
  "message": "Technical user retrieved successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "regNo": "RA123456789",
    "status": "active",
    "tasks": [...]
  }
}
```

### Update User Status
**PATCH** `/technical-dashboard/users/:userId/status`

Update status of a technical user.

**Request Body:**
```json
{
  "status": "shortlisted",
  "notes": "Strong technical skills"
}
```

**Response:**
```json
{
  "message": "User status updated to shortlisted successfully",
  "user": {...}
}
```

### Bulk Update User Status
**PATCH** `/technical-dashboard/users/bulk-status`

Update status of multiple technical users.

**Request Body:**
```json
{
  "userIds": ["user1", "user2", "user3"],
  "status": "shortlisted",
  "notes": "Selected for next round"
}
```

**Response:**
```json
{
  "message": "Status updated to shortlisted for 3 users successfully",
  "updatedCount": 3,
  "matchedCount": 3
}
```

### Send Task to Users
**POST** `/technical-dashboard/tasks/send`

Send task to specific technical users.

**Request Body:**
```json
{
  "userIds": ["user1", "user2"],
  "taskTitle": "Complete coding challenge",
  "taskDescription": "Build a REST API with Node.js",
  "deadline": "2024-01-15T23:59:59.000Z",
  "priority": "high"
}
```

**Response:**
```json
{
  "message": "Task sent to 2 technical users successfully",
  "task": {...},
  "assignedUsers": [...]
}
```

### Get Shortlisted Users
**GET** `/technical-dashboard/shortlisted`

Get all shortlisted technical users.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search term

**Response:**
```json
{
  "message": "Shortlisted technical users retrieved successfully",
  "users": [...],
  "pagination": {...}
}
```

### Send Task Email to Shortlisted
**POST** `/technical-dashboard/tasks/send-to-shortlisted`

Send task and email to all shortlisted technical users.

**Request Body:**
```json
{
  "taskTitle": "Technical Challenge",
  "taskDescription": "Complete the coding challenge within 48 hours",
  "deadline": "2024-01-20T23:59:59.000Z",
  "priority": "high",
  "emailSubject": "HRCC Technical Challenge - Action Required",
  "emailBody": "Dear candidate, you have been shortlisted for the technical round..."
}
```

**Response:**
```json
{
  "message": "Task assigned and email prepared for 25 shortlisted technical users",
  "task": {...},
  "emailDetails": {
    "subject": "HRCC Technical Challenge - Action Required",
    "body": "Dear candidate...",
    "recipients": 25
  },
  "assignedUsers": [...]
}
```

---

## 🎨 Creative Dashboard Routes

**Access:** Super Admin, Creative Lead

### Get Creative Users
**GET** `/creative-dashboard/users`

Get all creative domain users with pagination and filters.

**Query Parameters:** Same as technical dashboard

### Get Creative Statistics
**GET** `/creative-dashboard/stats`

Get creative domain statistics.

### Get Single Creative User
**GET** `/creative-dashboard/users/:userId`

Get details of a specific creative user.

### Update User Status
**PATCH** `/creative-dashboard/users/:userId/status`

Update status of a creative user.

### Bulk Update User Status
**PATCH** `/creative-dashboard/users/bulk-status`

Update status of multiple creative users.

### Send Task to Users
**POST** `/creative-dashboard/tasks/send`

Send task to specific creative users.

**Request Body:**
```json
{
  "userIds": ["user1", "user2"],
  "taskTitle": "Design a logo for HRCC",
  "taskDescription": "Create a modern, professional logo design",
  "deadline": "2024-01-15T23:59:59.000Z",
  "priority": "high"
}
```

### Get Shortlisted Users
**GET** `/creative-dashboard/shortlisted`

Get all shortlisted creative users.

### Send Task Email to Shortlisted
**POST** `/creative-dashboard/tasks/send-to-shortlisted`

Send task and email to all shortlisted creative users.

**Request Body:**
```json
{
  "taskTitle": "Creative Portfolio Review",
  "taskDescription": "Submit your creative portfolio for review",
  "deadline": "2024-01-20T23:59:59.000Z",
  "priority": "medium",
  "emailSubject": "HRCC Creative Portfolio Submission",
  "emailBody": "Dear creative candidate, please submit your portfolio..."
}
```

---

## 🏢 Corporate Dashboard Routes

**Access:** Super Admin, Corporate Lead

### Get Corporate Users
**GET** `/corporate-dashboard/users`

Get all corporate domain users with pagination and filters.

**Query Parameters:** Same as technical dashboard

### Get Corporate Statistics
**GET** `/corporate-dashboard/stats`

Get corporate domain statistics.

### Get Single Corporate User
**GET** `/corporate-dashboard/users/:userId`

Get details of a specific corporate user.

### Update User Status
**PATCH** `/corporate-dashboard/users/:userId/status`

Update status of a corporate user.

### Bulk Update User Status
**PATCH** `/corporate-dashboard/users/bulk-status`

Update status of multiple corporate users.

### Send Task to Users
**POST** `/corporate-dashboard/tasks/send`

Send task to specific corporate users.

**Request Body:**
```json
{
  "userIds": ["user1", "user2"],
  "taskTitle": "Prepare business presentation",
  "taskDescription": "Create a 10-minute presentation on market analysis",
  "deadline": "2024-01-15T23:59:59.000Z",
  "priority": "high"
}
```

### Get Shortlisted Users
**GET** `/corporate-dashboard/shortlisted`

Get all shortlisted corporate users.

### Send Task Email to Shortlisted
**POST** `/corporate-dashboard/tasks/send-to-shortlisted`

Send task and email to all shortlisted corporate users.

**Request Body:**
```json
{
  "taskTitle": "Business Case Study",
  "taskDescription": "Analyze the provided business case and present solutions",
  "deadline": "2024-01-20T23:59:59.000Z",
  "priority": "high",
  "emailSubject": "HRCC Business Case Study Assignment",
  "emailBody": "Dear corporate candidate, please complete the business case study..."
}
```

---

## 🔑 Admin Credentials

### Super Admin
- **Username:** `superadmin`
- **Password:** `admin123`
- **Access:** All dashboards and features

### Technical Lead
- **Username:** `technical_lead`
- **Password:** `technical123`
- **Access:** Technical dashboard only

### Creative Lead
- **Username:** `creative_lead`
- **Password:** `creative123`
- **Access:** Creative dashboard only

### Corporate Lead
- **Username:** `corporate_lead`
- **Password:** `corporate123`
- **Access:** Corporate dashboard only

---

## 📊 User Status Options

- **`active`** - Default status for new registrations
- **`shortlisted`** - Selected for further rounds
- **`rejected`** - Not selected
- **`omitted`** - Excluded from further recruitments

---

## 🎯 Task Priority Levels

- **`low`** - Low priority tasks
- **`medium`** - Medium priority tasks (default)
- **`high`** - High priority tasks

---

## 📧 Email Integration

The system is ready for email integration. Email details are logged and can be integrated with services like:
- Mailtrap (for testing)
- Brevo (Sendinblue)
- SendGrid
- Gmail SMTP

---

## 🚀 Getting Started

1. **Start the server:**
   ```bash
   cd backend
   npm start
   ```

2. **Login as admin:**
   ```bash
   POST /api/admin/login
   {
     "username": "superadmin",
     "password": "admin123"
   }
   ```

3. **Use the token in subsequent requests:**
   ```
   Authorization: Bearer <jwt_token>
   ```

4. **Access dashboards based on your role:**
   - Super Admin: All dashboards
   - Domain Leads: Their specific domain dashboard

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- JWT tokens expire after 24 hours
- Pagination is available for all list endpoints
- Search functionality supports partial matches
- All endpoints return consistent error formats
- Email sending is currently logged (ready for integration)

---

## 🔧 Environment Variables

Required environment variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Optional email configuration:
```
USE_MAILTRAP=true
MAILTRAP_USER=smtp@mailtrap.io
MAILTRAP_PASS=your_mailtrap_password
```
