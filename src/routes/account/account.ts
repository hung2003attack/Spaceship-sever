import express from 'express';
import JWTVERIFY from '../../middleware/jwtAuth';
import RefreshTokenCookie from '../../services/TokensService/RefreshTokenCookie';
import accountController from '../../controllers/accountController/accountController';
import authController from '../../controllers/authController/authController';
import jwtAuth from '../../middleware/jwtAuth';
const router = express.Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', jwtAuth.verifyToken, authController.logOut);
router.post('/get', accountController.get);
router.post('/refresh', RefreshTokenCookie.refreshToken);
router.post('/changePassword', accountController.changePassword);
router.get('/delete', JWTVERIFY.verifyTokenDelete, accountController.delete);
export default router;
