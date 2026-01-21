import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models';
import { Role } from './types';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    const users = [
      {
        email: 'admin@hrms.com',
        password: 'admin123',
        name: 'Admin User',
        role: Role.ADMIN,
        department: 'Management',
        position: 'System Administrator'
      },
      {
        email: 'john@hrms.com',
        password: 'john123',
        name: 'John Doe',
        role: Role.EMPLOYEE,
        department: 'Engineering',
        position: 'Software Developer'
      },
      {
        email: 'jane@hrms.com',
        password: 'jane123',
        name: 'Jane Smith',
        role: Role.EMPLOYEE,
        department: 'Marketing',
        position: 'Marketing Manager'
      }
    ];

    for (const userData of users) {
      await User.create(userData);
      console.log(`Created user: ${userData.email}`);
    }

    console.log('\nSeed completed successfully!');
    console.log('\n--- Login Credentials ---');
    console.log('Admin:');
    console.log('  Email: admin@hrms.com');
    console.log('  Password: admin123');
    console.log('\nEmployee 1:');
    console.log('  Email: john@hrms.com');
    console.log('  Password: john123');
    console.log('\nEmployee 2:');
    console.log('  Email: jane@hrms.com');
    console.log('  Password: jane123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedUsers();
