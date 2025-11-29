import express from 'express';
import { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword,
  updateProfile, 
  deleteAccount,  
  getUserProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected Routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateProfile)  
  .delete(protect, deleteAccount); 

export default router;