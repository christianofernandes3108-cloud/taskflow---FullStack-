# TaskFlow

TaskFlow is a full-stack task management web application built to demonstrate real-world backend and frontend engineering fundamentals.

It includes secure authentication, user-scoped task management, a PostgreSQL relational database, and a deployed production environment.

This project was designed to reflect how real-world web applications function end-to-end.

---

## Live Demo

Frontend: https://YOUR_NETLIFY_URL  
Backend API: https://YOUR_RENDER_URL  

---

## Tech Stack

### Frontend
- HTML5
- CSS3 (Flexbox, responsive layout)
- Vanilla JavaScript (ES6+)

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Authentication & Security
- bcrypt (secure password hashing)
- JSON Web Tokens (JWT)
- Protected routes with middleware
- Backend-enforced authorization

### Deployment
- Backend: Render
- Database: Render PostgreSQL
- Frontend: Netlify

---

## Features

### 1. User Authentication

- User registration
- Secure password hashing using bcrypt
- Login with JWT token issuance
- Protected routes using authentication middleware
- Logout (client-side token removal)

Passwords are never stored in plain text.

---

### 2. Task Management (CRUD)

Each authenticated user can:

- Create a task
- View their own tasks
- Update a task
- Delete a task

Task fields:
- `title`
- `description`
- `status` (todo / in progress / done)
- `created_at`

---

### 3. Authorization

- Users can only access their own tasks
- Backend enforces ownership using `user_id`
- SQL queries include user scoping
- JWT middleware validates identity before route access

Security is enforced at the backend level — not the frontend.

---

### 4. Error Handling

- Input validation
- Invalid credential handling
- Token verification errors
- Proper HTTP status codes
- User-friendly frontend feedback

---

## Architecture Overview

The project is structured using separation of concerns principles:


taskflow/
├── server/
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── app.js
│ └── package.json
│
├── client/
│ ├── index.html
│ ├── style.css
│ └── app.js
│
└── README.md


### Backend Layers

- **Routes** → Define endpoints
- **Controllers** → Business logic
- **Middleware** → Authentication & authorization
- **Models** → Database access abstraction
- **app.js** → Application entry point

This structure mirrors real-world production backend architecture.

---

## API Endpoints

### Authentication

**POST** `/api/auth/register`  
Registers a new user.

**POST** `/api/auth/login`  
Authenticates user and returns JWT token.

---

### Tasks (Protected Routes)

All task routes require:


Authorization: Bearer <token>


**GET** `/api/tasks`  
Returns all tasks for the authenticated user.

**POST** `/api/tasks`  
Creates a new task.

**PUT** `/api/tasks/:id`  
Updates a task (only if owned by the authenticated user).

**DELETE** `/api/tasks/:id`  
Deletes a task (only if owned by the authenticated user).

---

## Database Schema

### users

| Column      | Type        | Description |
|------------|------------|-------------|
| id         | SERIAL PK  | Unique user ID |
| email      | VARCHAR    | Unique login email |
| password   | VARCHAR    | Hashed password |
| created_at | TIMESTAMP  | Auto timestamp |

### tasks

| Column      | Type        | Description |
|------------|------------|-------------|
| id         | SERIAL PK  | Unique task ID |
| user_id    | INTEGER FK | Owner of task |
| title      | VARCHAR    | Task title |
| description| TEXT       | Task details |
| status     | VARCHAR    | Task status |
| created_at | TIMESTAMP  | Auto timestamp |

`tasks.user_id` references `users.id` with `ON DELETE CASCADE`.

---

## Local Development Setup

### 1. Clone Repository


git clone https://github.com/YOUR_USERNAME/taskflow.git

cd taskflow


---

### 2. Setup Backend


cd server
npm install


Create a `.env` file inside `/server`:


PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskflow
JWT_SECRET=your_secret_key


Start backend:


npm run dev


---

### 3. Setup Database

Create a PostgreSQL database named:


taskflow


Create the `users` and `tasks` tables using the SQL schema defined in the project setup.

---

### 4. Run Frontend

Open:


client/index.html


Or use a simple static server.

---

## Design Philosophy

This project intentionally avoids overengineering.

It focuses on:

- Clean architecture
- Secure authentication
- Proper authorization
- Backend-enforced data ownership
- Clear separation of concerns
- Production-style folder structure
- Deployed live environment

The goal is to demonstrate readiness for a junior full-stack developer role by implementing production-relevant fundamentals correctly.

---

## Author

Christiano [Your Surname]

---

## License

This project is for educational and portfolio demonstration purposes.