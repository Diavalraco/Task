# HRMS - Human Resource Management System

A lightweight HRMS application for managing employees and tracking attendance.

## Live Demo

| Resource | Link |
|----------|------|
| GitHub Repository | [https://github.com/Diavalraco/Task](https://github.com/Diavalraco/Task) |
| Frontend (Live) | [https://task-orpin-eight.vercel.app](https://task-orpin-eight.vercel.app) |
| Backend API | [https://task-roy9.vercel.app](https://task-roy9.vercel.app) |
| API Documentation (Swagger) | [https://task-roy9.vercel.app/api-docs](https://task-roy9.vercel.app/api-docs) |

## Demo Credentials

### Admin Account
- **Email:** admin@hrms.com
- **Password:** admin123


## Tech Stack

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Zod Validation
- Jest + Supertest (Testing)
- Swagger (API Documentation)

### Frontend
- React + Vite + TypeScript
- Tailwind CSS
- React Router
- Axios

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (ADMIN, EMPLOYEE)
- Password hashing with bcrypt

### Employee Management (Admin Only)
- Create, read, update, and delete employees
- View employee list with details

### Attendance Management
- Daily check-in/check-out
- Prevents duplicate check-ins per day
- Prevents check-out before check-in
- View personal attendance history

### Attendance Reports (Admin Only)
- View all employee attendance
- Filter by employee and date range

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Database and Swagger config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth and validation middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   ├── validators/     # Zod schemas
│   │   └── app.ts          # Express app
│   └── tests/              # Jest test files
├── frontend/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React context
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── types/          # TypeScript types
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hrms
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

5. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy API requests to the backend.

## Seed Database (Create Admin & Users)

To create the admin and demo users, run:
```bash
cd backend
npm run seed
```

This will create:
- 1 Admin account (admin@hrms.com)
- 2 Employee accounts (john@hrms.com, jane@hrms.com)

## Running Tests

```bash
cd backend
npm test
```

All 35 test cases cover:
- Authentication (register, login, validation)
- Employee management (CRUD operations, authorization)
- Attendance (check-in, check-out, history)
- Authorization (token validation, role-based access)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Employees (Admin Only)
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance/my` - Get own attendance
- `GET /api/attendance/today` - Get today's status
- `GET /api/attendance/report` - Get report (Admin only)

## Database Schema

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: 'ADMIN' | 'EMPLOYEE',
  department: String,
  position: String,
  timestamps: true
}
```

### Attendance
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  checkIn: Date,
  checkOut: Date,
  timestamps: true
}
```

## License

MIT
