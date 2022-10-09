import express from 'express';
import JWTVERIFY from '../../middleware/jwtAuth';
import DeleteUserControllner from '../../controllers/deleteUserController';

const router = express.Router();
router.delete('/:id', JWTVERIFY.verifyTokenDelete, DeleteUserControllner.deleteUser);

export default router;
