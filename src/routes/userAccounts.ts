import express from 'express';
import userAccount from '../controllers/userAccount';
const router = express.Router();
router.get('/', userAccount.getFriend);
export default router;
