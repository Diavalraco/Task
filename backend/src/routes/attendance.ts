import { Router } from 'express';
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAttendanceReport,
  getTodayStatus
} from '../controllers';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '../types';

const router = Router();

router.use(authenticate);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/my', getMyAttendance);
router.get('/today', getTodayStatus);
router.get('/report', authorize(Role.ADMIN), getAttendanceReport);

export default router;
