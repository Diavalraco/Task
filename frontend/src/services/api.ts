import axios from 'axios';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  CreateEmployeeData,
  UpdateEmployeeData,
  Attendance,
  AttendanceStatus
} from '../types';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  }
};

export const employeeApi = {
  getAll: async (): Promise<{ employees: User[] }> => {
    const response = await api.get<{ employees: User[] }>('/employees');
    return response.data;
  },

  getById: async (id: string): Promise<{ employee: User }> => {
    const response = await api.get<{ employee: User }>(`/employees/${id}`);
    return response.data;
  },

  create: async (data: CreateEmployeeData): Promise<{ message: string; employee: User }> => {
    const response = await api.post<{ message: string; employee: User }>('/employees', data);
    return response.data;
  },

  update: async (id: string, data: UpdateEmployeeData): Promise<{ message: string; employee: User }> => {
    const response = await api.put<{ message: string; employee: User }>(`/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/employees/${id}`);
    return response.data;
  }
};

export const attendanceApi = {
  checkIn: async (): Promise<{ message: string; attendance: Attendance }> => {
    const response = await api.post<{ message: string; attendance: Attendance }>('/attendance/check-in');
    return response.data;
  },

  checkOut: async (): Promise<{ message: string; attendance: Attendance }> => {
    const response = await api.post<{ message: string; attendance: Attendance }>('/attendance/check-out');
    return response.data;
  },

  getTodayStatus: async (): Promise<AttendanceStatus> => {
    const response = await api.get<AttendanceStatus>('/attendance/today');
    return response.data;
  },

  getMyAttendance: async (startDate?: string, endDate?: string): Promise<{ attendance: Attendance[] }> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<{ attendance: Attendance[] }>(`/attendance/my?${params.toString()}`);
    return response.data;
  },

  getReport: async (userId?: string, startDate?: string, endDate?: string): Promise<{ attendance: Attendance[] }> => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<{ attendance: Attendance[] }>(`/attendance/report?${params.toString()}`);
    return response.data;
  }
};

export default api;
