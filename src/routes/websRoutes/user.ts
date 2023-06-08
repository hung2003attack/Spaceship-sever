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
router.patch('/changesOne', checkRequest.changeName, userController.changesOne);
export default router;
