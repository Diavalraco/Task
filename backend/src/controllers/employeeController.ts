import { Request, Response } from 'express';
import { User } from '../models';
import { Role } from '../types';
import { CreateEmployeeInput, UpdateEmployeeInput } from '../validators/schemas';

export const createEmployee = async (
  req: Request<{}, {}, CreateEmployeeInput>,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name, department, position } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const employee = await User.create({
      email,
      password,
      name,
      role: Role.EMPLOYEE,
      department,
      position
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllEmployees = async (_req: Request, res: Response): Promise<void> => {
  try {
    const employees = await User.find({ role: Role.EMPLOYEE }).sort({ createdAt: -1 });
    res.json({ employees });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEmployeeById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    res.json({ employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEmployee = async (
  req: Request<{ id: string }, {}, UpdateEmployeeInput>,
  res: Response
): Promise<void> => {
  try {
    const { email, name, department, position, role } = req.body;

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }
    }

    const employee = await User.findByIdAndUpdate(
      req.params.id,
      { email, name, department, position, role },
      { new: true, runValidators: true }
    );

    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    res.json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEmployee = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
