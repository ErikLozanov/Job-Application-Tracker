import express from 'express';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getAllJobs).post(createJob);

// This route is for the dashboard stats
router.route('/stats').get(getJobStats);

router
  .route('/:id')
  .get(getJobById)
  .put(updateJob)
  .delete(deleteJob);

export default router;