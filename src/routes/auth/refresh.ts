import express from 'express';
import RefreshTokenCookie from '../../services/tokensService/refreshTokenCookie';
const router = express.Router();
router.post('/', RefreshTokenCookie.refreshToken);
export default router;
