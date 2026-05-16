import express from 'express';
import { getJobs, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getJobs);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
