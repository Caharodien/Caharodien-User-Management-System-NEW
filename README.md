##### Developer 1/Amama == Developer 2/Mahawan  
##### Frontend Developer 1/Mahinay == Frontend Developer 2/Auman

## User Management System API SHESHABLE

# Table of Contents
- Database Setup  
- API Endpoints  
- Authentication  
- Email Configuration  
- Admin Features  
- Error Handling  
- Deployment  

# Prerequisites
- Node.js  
- MySQL 9.2 or higher  
- npm  

# Installation

```bash
npm install
Configuration (config.json)
json
Copy
Edit
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "your_db_password",
    "database": "ums_api_db"
  },
  # ETHERNAL EMAIL ACCOUNT
  "secret": "YourSecretKeyHere",
  "emailFrom": "info@yourdomain.com",
  "smtpOptions": {
    "host": "smtp.example.com",
    "port": 587,
    "auth": {
      "user": "erick.shanahan@ethereal.email",
        "pass": "EDUugw48M7FsmzfFjU",
    }
  }
}
🔒 Replace credentials before deployment!

Start Development Server
bash
Copy
Edit
npm run start:dev
MySQL Setup
sql
Copy
Edit
-- Connect to MySQL
\connect root@localhost

-- Create the database
CREATE DATABASE `ums_api_db`;

-- Use the new database
USE ums_api_db;
API Endpoints
Authentication
Register (First user becomes Admin)
POST /accounts/register

json
Copy
Edit
{
  "title": "Mr",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "acceptTerms": true
}
Verify Email
POST /accounts/verify-email

json
Copy
Edit
{
  "token": "email-verification-token"
}
Authenticate/Login
POST /accounts/authenticate

json
Copy
Edit
{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
Response Example

json
Copy
Edit
{
  "id": 5,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "User",
  "jwtToken": "...",
  "refreshToken": "..."
}
Refresh Token
POST /accounts/refresh-token
Requires: refreshToken cookie

Revoke Token
POST /accounts/revoke-token

json
Copy
Edit
{
  "token": "refresh-token"
}
Admin Endpoints
Get All Users
GET /accounts
Access: Admin Only

Get User by ID
GET /accounts/{id}
Access: Admin or Owner

Create User (Admin)
POST /accounts

json
Copy
Edit
{
  "title": "Mr",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "User"
}
Update User
PUT /accounts/{id}

json
Copy
Edit
{
  "firstName": "Updated",
  "lastName": "Name"
}
Delete User
DELETE /accounts/{id}

Password Management
Forgot Password
POST /accounts/forgot-password

json
Copy
Edit
{
  "email": "john.doe@example.com"
}
Validate Reset Token
POST /accounts/validate-reset-token

json
Copy
Edit
{
  "token": "reset-token"
}
Reset Password
POST /accounts/reset-password

json
Copy
Edit
{
  "token": "reset-token",
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
Error Handling
200 OK

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

500 Internal Server Error

Error Response Format:

json
Copy
Edit
{
  "message": "Description of the error"
}