# ModelVault — RBAC Model Access Management System

ModelVault is a full-stack web application built using the MERN stack to manage AI models and control user access through **Role-Based Access Control (RBAC)**.

It provides a centralized dashboard where administrators can manage users, register AI models, and grant or revoke model-level permissions. Managers can monitor models and permissions, while regular users can access only the models they are authorized to use.

## Features

### Authentication & Authorization
- User registration and login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Protected API routes.
- Role-based authorization.

### Role-Based Access Control

ModelVault supports three roles:

| Role | Permissions |
|---|---|
| **Admin** | Manage users, models, and permissions. |
| **Manager** | View models and all access permissions. |
| **User** | View only authorized models. |

### Model Management
- Register new AI models.
- Update model details.
- Delete models.
- Activate or deactivate models.
- View available models based on user permissions.

### Permission Management
- Grant model access to users.
- Revoke existing access.
- View all permissions (Admin and Manager).
- View personal permissions (User).
- Prevent unauthorized model access through backend validation.

### Dashboard
- Role-based dashboard navigation.
- Model statistics and overview.
- User management.
- Permission management.
- Recent activity overview.
- Search and filtering.

## Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt / bcryptjs

## Project Structure

```text
ModelVault/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB or a MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ModelVault.git

cd ModelVault
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=7777
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Use the actual environment variable names configured in your backend.

Start the backend using the script defined in your `package.json`, for example:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Configure your frontend API base URL to point to your running backend.

Start the frontend using the script defined in your `package.json`, for example:

```bash
npm run dev
```

## Security

ModelVault enforces authorization at the backend level.

- JWT tokens are verified before protected operations.
- User roles are checked through authorization middleware.
- Model-level permissions are validated before users access restricted models.
- Unauthorized users cannot bypass frontend restrictions by directly calling protected APIs.
- Revoked tokens are rejected through token blacklisting.

**Important:** Never commit `.env` files, database credentials, JWT secrets, or other sensitive information to GitHub.

## Future Improvements

- Password reset functionality.
- Refresh token implementation.
- More detailed audit logs.
- Automated testing.
- Deployment with CI/CD.
- Improved model usage analytics.

## Learning Outcomes

Building ModelVault provided practical experience with:

- Full-stack MERN application development.
- REST API development.
- JWT authentication.
- Role-based access control.
- Express middleware.
- MongoDB relationships and data modeling.
- Protected routes and API security.
- React hooks and reusable components.

## Author

**Nitin Purohit**

Full-Stack Developer | MERN Stack

---

If you find this project useful, consider giving the repository a ⭐.