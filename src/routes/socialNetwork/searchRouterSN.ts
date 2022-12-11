import express from 'express';
import searchControllerSN from '../../controllers/socialNetwork/searchControllerSN';

const router = express.Router();
console.log('here');

router.post('/', searchControllerSN.getUser);

export default router;
