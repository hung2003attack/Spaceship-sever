import express from 'express';
import JWTVERIFY from '../../middleware/jwtAuth';
import peopleController from '../../controllers/websController/socialNetwork/peopleController';

const router = express.Router();
router.get('/getPeopleAll', peopleController.getPeopleAll);
router.post('/setFriend', peopleController.setFriend);
router.get('/getFriendAll', peopleController.getFriendAll);
router.post('/deleteReq', peopleController.delete);
router.patch('/setConfirm', peopleController.setConfirm);
export default router;
