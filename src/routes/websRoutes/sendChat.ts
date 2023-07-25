import express from 'express';
import JWTVERIFY from '../../middleware/jwtAuth';
import sendChatController from '../../controllers/websController/sendChatController';
import { upload } from '../../middleware/uploadGridFS';

const router = express.Router();

router.post('/send', upload.array('files'), sendChatController.send);

router.get('/getRoom', sendChatController.getRoom);
router.get('/getChat', sendChatController.getChat);

export default router;
