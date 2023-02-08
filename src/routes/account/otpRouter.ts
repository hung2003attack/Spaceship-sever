import express from 'express';
import otpController from '../../controllers/authController/OTP/otpController';
const router = express.Router();

router.post('/send', otpController.sendOTP);
router.post('/verify', otpController.verifyOTP);

export default router;
