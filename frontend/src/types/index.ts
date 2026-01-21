export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
  department?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  _id: string;
  userId: string | User;
  date: string;
  checkIn?: string;
  checkOut?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: Role;
  department?: string;
  position?: string;
}

export interface CreateEmployeeData {
  email: string;
  password: string;
  name: string;
  department?: string;
  position?: string;
}

export interface UpdateEmployeeData {
  email?: string;
  name?: string;
  department?: string;
  position?: string;
  role?: Role;
}

export interface AttendanceStatus {
  attendance: Attendance | null;
  checkedIn: boolean;
  checkedOut: boolean;
}
