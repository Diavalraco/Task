import { Request } from 'express';
import { Document, Types } from 'mongoose';

export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: Role;
  department?: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAttendance extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}
