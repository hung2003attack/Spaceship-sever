import uploadGridFS from '../../middleware/uploadGridFS';
import SendChatServiceSN from '../../services/WebsServices/SendChatServiceSN';

class SendChat {
    send = async (req: any, res: any) => {
        try {
            const value = req.body.value;
            const files = req.files;
            const data = await SendChatServiceSN.send(value, files);
        } catch (error) {
            console.log(error);
        }
    };
}
export default new SendChat();
