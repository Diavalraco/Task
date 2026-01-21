import { z } from 'zod';
import { Role } from '../types';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    role: z.nativeEnum(Role).optional(),
    department: z.string().optional(),
    position: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

export const createEmployeeSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    department: z.string().optional(),
    position: z.string().optional()
  })
});

export const updateEmployeeSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    role: z.nativeEnum(Role).optional()
  }),
  params: z.object({
    id: z.string()
  })
});

export const attendanceReportSchema = z.object({
  query: z.object({
    userId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>['body'];
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>['body'];
