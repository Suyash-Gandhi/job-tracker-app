import express from 'express';
import { getPeople, createPerson, updatePerson, deletePerson } from '../controllers/personController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getPeople);
router.post('/', createPerson);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);

export default router;
