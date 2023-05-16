import express from 'express';
import searchControllerSN from '../../../controllers/websController/socialNetwork/searchControllerSN';

const router = express.Router();
console.log('here');

router.post('/', searchControllerSN.getUser);

export default router;
