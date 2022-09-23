import express from 'express';
import registerControlle from '../controllers/registerController';
const router = express.Router();

router.post('/', registerControlle.register);
export default router;
