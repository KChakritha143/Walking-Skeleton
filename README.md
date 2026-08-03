# TaskMatrix

## AI-Powered Agile Project Management Platform

TaskMatrix is a modern full-stack Agile project management platform designed for software teams to efficiently plan, organize, track, and manage projects.

The platform provides a centralized workspace where teams can collaborate, assign tasks, monitor project progress, manage deadlines, track activities, and improve productivity.

The project combines secure REST API architecture, JWT authentication, protected CRUD operations, ownership validation, payment gateway integration, and a server-side AI microservice to create a scalable and secure project management system.

This project was developed as part of the Prodesk Residency Program under the Full Stack Development Track.

---

# Project Overview

Managing software projects across multiple team members can become challenging without a centralized platform. Teams often face difficulties with:

* Task tracking
* Project visibility
* Team collaboration
* Deadline management
* Resource ownership
* Productivity monitoring

TaskMatrix provides an Agile project management environment where users can:

* Create and manage projects
* Assign tasks to team members
* Track progress using Kanban boards
* Manage priorities and deadlines
* Collaborate through comments and activity feeds
* Receive notifications
* Generate AI-based task suggestions
* Access premium features through payment integration

---

# Problem Statement

Software teams require efficient project management tools to organize their workflow. Without a proper system, teams experience:

* Poor task organization
* Lack of ownership tracking
* Difficulty monitoring progress
* Communication gaps
* Missed deadlines

The goal of TaskMatrix is to provide a Jira/Asana-inspired platform that simplifies project execution and improves collaboration.

---

# Solution

TaskMatrix solves these challenges by providing:

* Secure authentication system
* Project and task management
* Kanban workflow management
* Team collaboration features
* Role-based access control
* AI-powered assistance
* Secure backend architecture
* Payment-based premium access

---

# Technology Stack

## Frontend

* Next.js
* React.js
* Vite
* Tailwind CSS
* Shadcn UI
* Zustand
* Axios
* React Router DOM

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv
* CORS

## Validation and Security

* Zod / Joi Schema Validation
* express-rate-limit
* Error Handling Middleware
* Request Sanitization

## AI Integration

* Google Generative AI SDK / OpenAI SDK
* Server-side AI Microservice Architecture

## Payment Integration

* Stripe Checkout API
* Stripe Test Mode

## Deployment

Frontend:

* Vercel

Backend:

* Render

Database:

* MongoDB Atlas

---

# System Architecture

```
                    Frontend Application
                  (React / Next.js)

                          |
                          |
                       Axios API

                          |
                          |

                 Node.js Express Server

                          |
        ------------------------------------
        |              |                  |
 Authentication    CRUD Services      AI Service
        |              |                  |
        |              |                  |
       JWT        MongoDB Atlas      LLM Provider
        |
        |
 Password Hashing
    bcrypt


                          |
                          |

                  Stripe Payment Gateway
```

---

# Project Structure

```
TaskMatrix

│
├── backend
│
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── validations
│   ├── tests
│   │
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── frontend
│
│   ├── public
│   ├── src
│   │
│   ├── assets
│   ├── components
│   ├── context
│   ├── pages
│   ├── services
│   ├── App.jsx
│   └── main.jsx
│
├── docs
│   └── ERD.png
│
├── Prompts.md
│
└── README.md
```

---

# UI/UX Design

The application UI was designed using Figma.

Designed Screens:

## Authentication Screen

Includes:

* Login page
* Registration page
* User authentication flow

## Dashboard Screen

Includes:

* Project overview
* Task statistics
* Kanban board
* Recent activities

## Task Details Screen

Includes:

* Task information
* Assigned members
* Priority
* Deadline
* Comments
* Activity history

Figma Design Link:

https://www.figma.com/design/aEGzAIjEwnSxMyi5A2zuX3/task-matrix-UI-design?node-id=3-2&p=f&t=s0Ssf3qaJ6Twatsz-0

---

# Authentication and Authorization

## Features

* User Registration
* User Login
* JWT Token Generation
* Protected Routes
* Password Hashing using bcryptjs
* Role-Based Access Control

## Authentication Flow

```
User Login

      |

Validate Credentials

      |

Compare Password using bcrypt

      |

Generate JWT Token

      |

Access Protected APIs
```

---

# JWT Middleware

Protected routes use authentication middleware.

Middleware process:

1. Read token from Authorization header
2. Verify token using JWT secret
3. Decode user information
4. Attach user information to request
5. Allow access to protected routes

Example:

```javascript
router.get(
"/api/tasks",
protect,
getTasks
);
```

---

# Secure CRUD Operations

Authenticated users can:

* Create Resources
* Read Resources
* Update Resources
* Delete Resources

Each resource contains:

```
authorId
```

Before accessing resources:

```javascript
if(resource.authorId.toString() !== req.user.id){

return res.status(403).json({
message:"Access Denied"
});

}
```

This ensures users can only access their own data.

---

# REST API Endpoints

## Authentication

### Register User

```
POST /api/auth/register
```

Request:

```json
{
"name":"John",
"email":"john@example.com",
"password":"123456"
}
```

### Login User

```
POST /api/auth/login
```

Response:

```json
{
"token":"JWT_TOKEN"
}
```

---

# Project APIs

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | /api/projects     | Get projects   |
| GET    | /api/projects/:id | Get project    |
| POST   | /api/projects     | Create project |
| PUT    | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |

---

# Task APIs

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | /api/tasks     | Get tasks       |
| GET    | /api/tasks/:id | Get single task |
| POST   | /api/tasks     | Create task     |
| PUT    | /api/tasks/:id | Update task     |
| DELETE | /api/tasks/:id | Delete task     |

---

# Comments APIs

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | /api/comments     | Get comments   |
| POST   | /api/comments     | Add comment    |
| DELETE | /api/comments/:id | Delete comment |

---

# Notification APIs

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | /api/notifications     | Get notifications   |
| PUT    | /api/notifications/:id | Update notification |

---

# Frontend Backend Integration

The React/Next.js frontend communicates with backend APIs using Axios.

Example:

```javascript
axios.get("/api/tasks",{

headers:{
Authorization:`Bearer ${token}`
}

});
```

---

# Optimistic UI Implementation

When deleting a task:

1. Remove task immediately from UI state
2. Send API request in background
3. Update server data
4. Avoid unnecessary page reloads

Example:

```javascript
setTasks(
tasks.filter(task=>task._id!==id)
);

await axios.delete(`/api/tasks/${id}`);
```

---

# Error Handling and Payload Validation

All backend controllers are protected using try/catch blocks.

The API uses standardized JSON responses.

Example:

```json
{
"success":false,
"message":"Invalid request data"
}
```

HTTP Status Codes:

| Code | Purpose               |
| ---- | --------------------- |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

---

# Schema Validation

All incoming request bodies are validated before reaching MongoDB.

Example using Zod:

```javascript
const taskSchema=z.object({

title:z.string().min(3),

priority:z.enum([
"Low",
"Medium",
"High"
])

});
```

Validation Flow:

```
Request Body

      |

Schema Validation

      |

Controller

      |

Database
```

---

# Server-Side AI Microservice

The AI integration is implemented only on the backend.

The frontend never directly communicates with the AI provider.

Architecture:

```
Frontend

   |

POST /api/ai/suggest

   |

Express Backend

   |

AI SDK

   |

LLM Model

   |

Sanitized Response
```

---

# AI Suggestion Endpoint

Endpoint:

```
POST /api/ai/suggest
```

Request:

```json
{
"project":"E-commerce Application",
"goal":"Improve customer experience"
}
```

Response:

```json
{
"suggestions":[
"Improve checkout process",
"Add recommendation system",
"Optimize performance"
]
}
```

---

# AI Security

AI API keys are stored securely inside environment variables.

Example:

```
GOOGLE_AI_KEY=
OPENAI_API_KEY=
```

The keys are never exposed to the frontend.

---

# Security Hardening

## Rate Limiting

Implemented using:

```
express-rate-limit
```

Protected endpoints:

```
POST /api/auth/login

POST /api/ai/suggest
```

Benefits:

* Prevent brute force attacks
* Prevent API abuse
* Prevent AI token spam
* Protect server resources

---

# Production Sanitization

Before deployment:

* Removed unnecessary console.log statements
* Secured environment variables
* Added centralized error handling
* Improved API response consistency

---

# Stripe Payment Integration

TaskMatrix supports premium features using Stripe Checkout.

Payment Flow:

```
User clicks Upgrade

        |

Frontend Request

        |

Backend Creates Stripe Session

        |

Stripe Checkout

        |

Payment Success

        |

Premium Access
```

Endpoint:

```
POST /api/payment/create-checkout-session
```

---

# Database Architecture

MongoDB Collections:

```
Users

Projects

Project Members

Tasks

Comments

Notifications

Activity Logs

Attachments

Labels

Task Labels
```

---

# Environment Variables

Backend `.env`

```
PORT=5000

MONGO_URI=

JWT_SECRET=

STRIPE_SECRET_KEY=

GOOGLE_AI_KEY=

CLIENT_URL=
```

---

# Installation

## Clone Repository

```
git clone <repository-url>

cd TaskMatrix
```

---

# Backend Setup

```
cd backend

npm install

npm start
```

Backend runs:

```
http://localhost:5000
```

---

# Frontend Setup

```
cd frontend

npm install

npm run dev
```

Frontend runs:

```
http://localhost:5173
```

---

# Testing

Testing Tools:

* Postman
* MongoDB Atlas
* Browser Testing

Testing includes:

* User registration
* User login
* JWT validation
* CRUD operations
* Ownership validation
* AI endpoint testing
* Stripe checkout testing

---

# Deployment

Frontend:

https://walking-skeleton-s4bd.vercel.app/

Backend:

https://walking-skeleton-1.onrender.com

Database:

MongoDB Atlas

---


# Future Enhancements

* AI Sprint Planning Assistant
* AI Project Summary Generator
* Smart Task Prioritization
* Email Notifications
* Team Performance Analytics
* Calendar Integration
* Mobile Application
* Advanced Reporting Dashboard

---

# Learning Outcomes

Through this project:

* Built scalable REST APIs using Express.js
* Implemented JWT authentication
* Applied secure CRUD operations
* Implemented ownership validation
* Connected frontend and backend applications
* Worked with MongoDB Atlas
* Integrated Stripe payment gateway
* Designed AI backend architecture
* Implemented payload validation
* Added rate limiting security
* Deployed full-stack applications
