# Task Matrix

# REST API CRUD Finalization & Gateway Monetization

## Project Overview

This project is a full-stack application built using:

- React (Vite) Frontend
- Node.js & Express Backend
- MongoDB Atlas Database
- JWT Authentication
- Bcrypt Password Hashing
- Protected CRUD Operations
- Stripe Checkout Integration (Test Mode)

The application allows authenticated users to manage their own resources securely through JWT-protected REST APIs while demonstrating ownership validation and payment gateway integration.

---

## Tech Stack

### Frontend
- React.js
- Vite
- React Context API
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv
- 
## Project Structure

```
MISSION-15
│
├── backend
│   ├── config
│   ├── data
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── tests
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## Features

### Authentication

- User Registration
- User Login
- JWT Token Generation
- Protected Routes
- Password Hashing using bcryptjs

### Secure CRUD Operations

Authenticated users can:

- Create Resources
- Read Their Own Resources
- Update Their Own Resources
- Delete Their Own Resources

### Ownership Validation

Every resource contains:

```js
authorId
```

Before any Read, Update, or Delete operation:

```js
if (resource.authorId.toString() !== req.user.id) {
    return res.status(403).json({
        message: "Access Denied"
    });
}
```

This ensures users can only access their own data.

---

## REST API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

Request Body:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}
```

---

#### Login User

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "JWT_TOKEN"
}
```

---

### Resource CRUD

#### Create Resource

```http
POST /api/tasks
```

Headers:

```http
Authorization: Bearer TOKEN
```

---

#### Get All User Resources

```http
GET /api/tasks
```

Headers:

```http
Authorization: Bearer TOKEN
```

---

#### Get Single Resource

```http
GET /api/tasks/:id
```

Headers:

```http
Authorization: Bearer TOKEN
```

---

#### Update Resource

```http
PUT /api/tasks/:id
```

Headers:

```http
Authorization: Bearer TOKEN
```

---

#### Delete Resource

```http
DELETE /api/tasks/:id
```

Headers:

```http
Authorization: Bearer TOKEN
```

---

## JWT Middleware

Protected routes use authentication middleware.

Example:

```js
router.get("/", protect, getTasks);
```

Middleware Flow:

1. Read token from Authorization header
2. Verify token using JWT Secret
3. Decode user information
4. Attach user to request object
5. Allow access to protected route

---

## Frontend Integration

The React frontend communicates with backend APIs using Axios.

Example:

```js
axios.get("/api/tasks", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

## Optimistic UI Implementation

When a task is deleted:

1. Remove task instantly from UI state.
2. Send DELETE request in background.
3. No page reload required.
4. Improved user experience.

Example:

```js
setTasks(tasks.filter(task => task._id !== id));

await axios.delete(`/api/tasks/${id}`);
```

---

## Stripe Payment Integration

### Test Mode Checkout

Users can initiate a Stripe checkout session.

Example Use Cases:

- Upgrade to Pro
- Purchase Course
- Premium Membership

---

### Create Checkout Session

```http
POST /api/payment/create-checkout-session
```

---

### Stripe Flow

1. User clicks Upgrade Button.
2. Frontend calls Checkout API.
3. Backend creates Stripe Session.
4. User redirected to Stripe Checkout.
5. Test payment processed.
6. Redirect to Success Page.

---

## Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

CLIENT_URL=http://localhost:5173
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

---

### Backend Setup

```bash
cd backend

npm install

npm start
```

Server runs at:

```bash
http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```bash
http://localhost:5173
```

---

## Testing

### Authentication Testing

- Register User
- Login User
- Verify JWT Token

### CRUD Testing

- Create Resource
- Read Resource
- Update Resource
- Delete Resource

### Ownership Validation Testing

- Login as User A
- Attempt to access User B's resource
- Verify 403 Forbidden response

---

## Security Measures

- JWT Authentication
- Password Hashing with bcryptjs
- Protected API Routes
- Ownership Validation
- Environment Variables
- CORS Configuration
- MongoDB Atlas Secure Connection

---

## Deployment

### Frontend

Deploy using:

- Vercel
- Netlify

### Backend

Deploy using:

- Render
- Railway

### Database

- MongoDB Atlas

---

## Learning Outcomes

Through this project:

- Built secure REST APIs using Express
- Implemented JWT Authentication
- Applied Role-Based Data Ownership
- Connected React Frontend with Backend APIs
- Implemented Optimistic UI Updates
- Integrated Stripe Payment Gateway
- Worked with MongoDB Atlas
- Deployed Full-Stack Applications

---

## Deployment Links

- Frontend(Vercel) : https://walking-skeleton-s4bd.vercel.app/
- Backend(Render) :  https://walking-skeleton-1.onrender.com
