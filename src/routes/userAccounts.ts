import express from 'express';
import userAccount from '../controllers/userAccount';
const router = express.Router();
console.log('ok', 'hll');

router.get('/SN/', userAccount.getFriend);
export default router;
