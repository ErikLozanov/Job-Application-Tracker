import express from 'express';
import { generateCoverLetter } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/cover-letter', generateCoverLetter);

export default router;