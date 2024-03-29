import express from 'express';
import userController from '../../controllers/websController/userController';
import checkRequest from '../../middleware/checkRequest';
const router = express.Router();
router.post('/getById', userController.getById);
router.post('/getByName', userController.getByName);
router.post('/setLg', userController.setLg);
router.patch('/setAs', userController.setAs);
router.get('/getNewMes', userController.getNewMes);
router.get('/delMessage', userController.delMessage);
router.patch('/changesOne', checkRequest.changeText, userController.changesOne);
router.patch('/follow', userController.follow);
router.patch('/Unfollow', userController.Unfollow);
router.get('/getMore', userController.getMore);
router.post('/setHistory', userController.setHistory);
router.get('/getHistory', userController.getHistory);
export default router;
