# HRMS - Human Resource Management System

A lightweight HRMS application for managing employees and tracking attendance.

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

## API Documentation

Once the backend is running, visit:
```
http://localhost:5000/api-docs
```

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

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Secret key for JWT
   - `JWT_EXPIRES_IN` - Token expiration (e.g., 7d)
   - `NODE_ENV` - production

### Frontend (Vercel)

1. Import project to Vercel
2. Set root directory to `frontend`
3. Update `vercel.json` with your backend URL
4. Deploy

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
// Compound index on (userId, date) for uniqueness
```

## License

MIT
