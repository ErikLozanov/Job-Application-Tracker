import express from 'express';
import authRoutes from './authRoutes.js';
import jobRoutes from './jobRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/ai', aiRoutes);

export default router;