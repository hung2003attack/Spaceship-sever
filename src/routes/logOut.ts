import express from 'express';
import logOutController from '../controllers/logOutController';
const router = express.Router();
router.post('/', logOutController.logOut);
export default router;
