import request from 'supertest';
import app from '../src/app';
import { User, Attendance } from '../src/models';
import { Role } from '../src/types';
import { generateToken } from '../src/middleware/auth';

describe('Attendance Management', () => {
  let employeeToken: string;
  let adminToken: string;
  let employeeId: string;

  beforeEach(async () => {
    const employee = await User.create({
      email: 'employee@example.com',
      password: 'password123',
      name: 'Employee User',
      role: Role.EMPLOYEE
    });
    employeeId = employee._id.toString();
    employeeToken = generateToken({
      id: employeeId,
      email: employee.email,
      role: employee.role
    });

    const admin = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
      role: Role.ADMIN
    });
    adminToken = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role
    });
  });

  describe('POST /api/attendance/check-in', () => {
    it('should allow employee to check in', async () => {
      const res = await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Checked in successfully');
      expect(res.body.attendance.checkIn).toBeDefined();
    });

    it('should not allow employee to check in twice on the same day', async () => {
      await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${employeeToken}`);

      const res = await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Already checked in today');
    });
  });

  describe('POST /api/attendance/check-out', () => {
    it('should allow employee to check out after check in', async () => {
      await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${employeeToken}`);

      const res = await request(app)
        .post('/api/attendance/check-out')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Checked out successfully');
      expect(res.body.attendance.checkOut).toBeDefined();
    });

    it('should not allow employee to check out before check in', async () => {
      const res = await request(app)
        .post('/api/attendance/check-out')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Must check in before checking out');
    });

    it('should not allow employee to check out twice on the same day', async () => {
      await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${employeeToken}`);

      await request(app)
        .post('/api/attendance/check-out')
        .set('Authorization', `Bearer ${employeeToken}`);

      const res = await request(app)
        .post('/api/attendance/check-out')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Already checked out today');
    });
  });

  describe('GET /api/attendance/my', () => {
    it('should return employee own attendance history', async () => {
      await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${employeeToken}`);

      const res = await request(app)
        .get('/api/attendance/my')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.attendance).toBeDefined();
      expect(Array.isArray(res.body.attendance)).toBe(true);
      expect(res.body.attendance.length).toBe(1);
    });

    it('should filter attendance by date range', async () => {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 7);

      await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${employeeToken}`);

      const res = await request(app)
        .get('/api/attendance/my')
        .query({
          startDate: startDate.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        })
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.attendance).toBeDefined();
    });
  });

  describe('GET /api/attendance/today', () => {
    it('should return today attendance status', async () => {
      const res = await request(app)
        .get('/api/attendance/today')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.checkedIn).toBe(false);
      expect(res.body.checkedOut).toBe(false);
    });

    it('should show checked in status', async () => {
      await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${employeeToken}`);

      const res = await request(app)
        .get('/api/attendance/today')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.checkedIn).toBe(true);
      expect(res.body.checkedOut).toBe(false);
    });
  });

  describe('GET /api/attendance/report', () => {
    it('should allow admin to view attendance report', async () => {
      await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${employeeToken}`);

      const res = await request(app)
        .get('/api/attendance/report')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.attendance).toBeDefined();
      expect(Array.isArray(res.body.attendance)).toBe(true);
    });

    it('should not allow employee to view attendance report', async () => {
      const res = await request(app)
        .get('/api/attendance/report')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Not authorized');
    });

    it('should filter report by userId', async () => {
      await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${employeeToken}`);

      const res = await request(app)
        .get('/api/attendance/report')
        .query({ userId: employeeId })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.attendance.length).toBe(1);
    });
  });
});

describe('Authorization', () => {
  it('should block requests without token', async () => {
    const res = await request(app).get('/api/employees');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token provided');
  });

  it('should block employee from admin-only routes', async () => {
    const employee = await User.create({
      email: 'employee@example.com',
      password: 'password123',
      name: 'Employee User',
      role: Role.EMPLOYEE
    });

    const employeeToken = generateToken({
      id: employee._id.toString(),
      email: employee.email,
      role: employee.role
    });

    const res = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${employeeToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Not authorized');
  });
});
