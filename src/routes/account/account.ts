import express from 'express';
import JWTVERIFY from '../../middleware/jwtAuth';

import accountController from '../../controllers/accountController/accountController';
const router = express.Router();
router.post('/get', accountController.get);
router.get('/delete', JWTVERIFY.verifyTokenDelete, accountController.delete);
export default router;
