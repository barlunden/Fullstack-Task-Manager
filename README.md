# Fullstack Task Manager 🚀

A modern, secure, and responsive Task Management application. This project demonstrates a full-stack flow using a Node.js/Express backend with JWT authentication and a React/Tailwind frontend.

## ✨ Features

**Secure Authentication:** Custom-built registration and login system using JWT and Bcrypt hashing.

**Full CRUD Functionality:** Create, read, update, and delete tasks with real-time UI updates.

**Data Integrity:** Server-side validation with express-validator and client-side protection.

**User Ownership:** Database logic ensures users only see and manage their own private tasks.

**Modern UI/UX:** Built with Tailwind CSS 4 and featuring elegant React Hot Toast notifications.

## 🛠️ Tech Stack

**Frontend:**
React 19 & Vite
Tailwind CSS 4
Axios for API communication
React Router (Protected Routing)
React Hot Toast

**Backend:**
Node.js & Express
SQLite (Better-SQLite3)
JSON Web Tokens (JWT) for session management
Bcrypt for password security

## 🚀 Installation & Setup

1. Clone the repository
```
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

2. Backend Setup
```
cd backend
npm install
```

### Create a .env file in the backend folder:

```
JWT_SECRET=your_secret_key_here
PORT=5555
```

### Start the server:

```
npm start
```

3. Frontend Setup
Open a new terminal:
```
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
├── backend/
│   ├── middleware/    # JWT Auth middleware
│   ├── routes/        # Auth & Task API endpoints
│   ├── db.js          # SQLite configuration
│   └── server.js      # Main entry point
└── frontend/
    ├── src/
    │   ├── components/ # Login, Register, Dashboard
    │   └── App.jsx     # Routing logic
    └── tailwind.config.js
```


## 🔒 Security Measures

**Password Hashing:** Passwords are never stored in plain text.

**Access Control:** Protected routes in both frontend and backend ensure unauthorized users are redirected to login.

**Database Isolation:** Every query is scoped via the userId decoded from the secure JWT token.