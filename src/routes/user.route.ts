import { Router } from 'express';
import { getCurrentUser, updateUserProfile } from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get("/profile", authenticateToken, getCurrentUser);
router.put("/profile", authenticateToken, updateUserProfile);

export default router;
