import express from 'express';
import JWTVERIFY from '../../../middleware/jwtAuth';
import peopleController from '../../../controllers/websController/socialNetwork/peopleController';

const router = express.Router();
router.get('/stranger', peopleController.getStranger);
router.post('/setFriend', peopleController.setFriend);
export default router;
