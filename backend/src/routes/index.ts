import { Router } from 'express';
import authRoutes from './auth';
import employeeRoutes from './employee';
import attendanceRoutes from './attendance';

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/attendance', attendanceRoutes);

export default router;
