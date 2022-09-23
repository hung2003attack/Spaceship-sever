import express from 'express';
import loginControllner from '../controllers/loginControllner';
const router = express.Router();
router.post('/', loginControllner.login);
export default router;
