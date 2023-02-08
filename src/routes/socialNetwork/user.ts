import express from 'express';
import userController from '../../controllers/socialNetwork/userController';
const router = express.Router();
router.post('/getById', userController.getById);
router.post('/getByName', userController.getByName);
router.post('/update', userController.update);
export default router;
