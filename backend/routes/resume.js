import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/resumeController.js';
import authMiddleware from '../middleware/auth.js';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = express.Router();
router.use(authMiddleware);
router.post('/', upload.single('resume'), analyzeResume);

export default router;
