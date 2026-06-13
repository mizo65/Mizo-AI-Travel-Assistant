import express from 'express';
import { verifyToken } from '../middleware/index.js';
import {
  processVoiceCommand,
  processTextCommand,
  executeAdminCommand
} from '../controllers/ai.js';

const router = express.Router();

// All AI routes require authentication
router.use(verifyToken);

// AI endpoints
router.post('/command/text', processTextCommand);
router.post('/command/voice', processVoiceCommand);
router.post('/admin/command', executeAdminCommand);

export default router;
