import express from 'express';
import { getInterviews, createInterview, updateInterview, deleteInterview } from '../controllers/interviewController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getInterviews);
router.post('/', createInterview);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

export default router;
