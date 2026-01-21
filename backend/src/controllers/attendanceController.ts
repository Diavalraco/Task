import { Response } from 'express';
import { Attendance } from '../models';
import { AuthRequest, Role } from '../types';

const getDateOnly = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const checkIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const today = getDateOnly(new Date());

    const existingAttendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (existingAttendance) {
      if (existingAttendance.checkIn) {
        res.status(400).json({ message: 'Already checked in today' });
        return;
      }
      existingAttendance.checkIn = new Date();
      await existingAttendance.save();
      res.json({
        message: 'Checked in successfully',
        attendance: existingAttendance
      });
      return;
    }

    const attendance = await Attendance.create({
      userId,
      date: today,
      checkIn: new Date()
    });

    res.status(201).json({
      message: 'Checked in successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkOut = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const today = getDateOnly(new Date());

    const attendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (!attendance || !attendance.checkIn) {
      res.status(400).json({ message: 'Must check in before checking out' });
      return;
    }

    if (attendance.checkOut) {
      res.status(400).json({ message: 'Already checked out today' });
      return;
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.json({
      message: 'Checked out successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { startDate, endDate } = req.query;

    const query: Record<string, unknown> = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        (query.date as Record<string, Date>).$gte = new Date(startDate as string);
      }
      if (endDate) {
        (query.date as Record<string, Date>).$lte = new Date(endDate as string);
      }
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });

    res.json({ attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAttendanceReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, startDate, endDate } = req.query;

    const query: Record<string, unknown> = {};

    if (userId) {
      query.userId = userId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        (query.date as Record<string, Date>).$gte = new Date(startDate as string);
      }
      if (endDate) {
        (query.date as Record<string, Date>).$lte = new Date(endDate as string);
      }
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email department position')
      .sort({ date: -1 });

    res.json({ attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTodayStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const today = getDateOnly(new Date());

    const attendance = await Attendance.findOne({
      userId,
      date: today
    });

    res.json({
      attendance,
      checkedIn: attendance?.checkIn ? true : false,
      checkedOut: attendance?.checkOut ? true : false
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
