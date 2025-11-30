import express from 'express';
import { generateCoverLetter, generateInterviewQuestions } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/cover-letter', generateCoverLetter);
router.post('/interview-questions', generateInterviewQuestions);

export default router;