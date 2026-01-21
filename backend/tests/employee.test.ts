import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models';
import { Role } from '../src/types';
import { generateToken } from '../src/middleware/auth';

describe('Employee Management', () => {
  let adminToken: string;
  let employeeToken: string;
  let adminId: string;
  let employeeId: string;

  beforeEach(async () => {
    const admin = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
      role: Role.ADMIN
    });
    adminId = admin._id.toString();
    adminToken = generateToken({
      id: adminId,
      email: admin.email,
      role: admin.role
    });

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
  });

  describe('POST /api/employees', () => {
    it('should allow admin to create employee', async () => {
      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'newemployee@example.com',
          password: 'password123',
          name: 'New Employee',
          department: 'Engineering',
          position: 'Developer'
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Employee created successfully');
      expect(res.body.employee.email).toBe('newemployee@example.com');
      expect(res.body.employee.role).toBe(Role.EMPLOYEE);
    });

    it('should not allow employee to create employee', async () => {
      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          email: 'newemployee@example.com',
          password: 'password123',
          name: 'New Employee'
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Not authorized');
    });

    it('should fail to create employee with duplicate email', async () => {
      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'employee@example.com',
          password: 'password123',
          name: 'Duplicate Employee'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email already registered');
    });
  });

  describe('GET /api/employees', () => {
    it('should allow admin to list employees', async () => {
      const res = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.employees).toBeDefined();
      expect(Array.isArray(res.body.employees)).toBe(true);
      expect(res.body.employees.length).toBe(1);
    });

    it('should not allow employee to list employees', async () => {
      const res = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Not authorized');
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should allow admin to get employee by id', async () => {
      const res = await request(app)
        .get(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.employee.email).toBe('employee@example.com');
    });

    it('should return 404 for non-existent employee', async () => {
      const res = await request(app)
        .get('/api/employees/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Employee not found');
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should allow admin to update employee', async () => {
      const res = await request(app)
        .put(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Employee',
          department: 'HR'
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Employee updated successfully');
      expect(res.body.employee.name).toBe('Updated Employee');
      expect(res.body.employee.department).toBe('HR');
    });

    it('should not allow employee to update employee', async () => {
      const res = await request(app)
        .put(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          name: 'Updated Employee'
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Not authorized');
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should allow admin to delete employee', async () => {
      const res = await request(app)
        .delete(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Employee deleted successfully');

      const deletedEmployee = await User.findById(employeeId);
      expect(deletedEmployee).toBeNull();
    });

    it('should not allow employee to delete employee', async () => {
      const res = await request(app)
        .delete(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Not authorized');
    });
  });
});
