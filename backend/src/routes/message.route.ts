import express from 'express';

const router = express.Router();

// @desc Get all messages
// @route GET /api/messages/conversation
// @access Public
router.get('/conversation', (_req, res) => {
  res.send('Get conversation')
})

export default router;