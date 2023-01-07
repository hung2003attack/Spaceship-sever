import express from 'express';
import otpController from '../../controllers/auth/otpController';
const router = express.Router();

router.post('/send', otpController.sendOTP);
router.post('/verify', otpController.verifyOTP);

export default router;
