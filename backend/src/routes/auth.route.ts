import express from 'express';
import { login, logout, signup, getMe } from '../controllers/auth.controller';
import protect from '../middleware/protectMiddleware';

const router = express.Router();

router.get('/me', protect , getMe)
router.post('/register', signup)
router.post('/login', login)
router.post('/logout', logout)

export default router;