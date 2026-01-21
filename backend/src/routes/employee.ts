import { Router } from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} from '../controllers';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createEmployeeSchema, updateEmployeeSchema } from '../validators/schemas';
import { Role } from '../types';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.ADMIN));

router.post('/', validate(createEmployeeSchema), createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', validate(updateEmployeeSchema), updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
