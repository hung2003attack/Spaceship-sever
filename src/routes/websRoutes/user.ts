import express from 'express';
import userController from '../../controllers/websController/userController';
const router = express.Router();
router.post('/getById', userController.getById);
router.post('/getByName', userController.getByName);
router.post('/setLg', userController.setLg);
router.patch('/setAs', userController.setAs);
export default router;