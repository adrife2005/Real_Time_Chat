import express from 'express';
import protect from '../middleware/protectMiddleware';
import { getMessages, getUsersForConversation, sendMessage } from '../controllers/message.controller';

const router = express.Router();

router.get('/conversations', protect, getUsersForConversation)
router.get('/:id', protect, getMessages)
router.post('/send/:id', protect, sendMessage)


export default router;