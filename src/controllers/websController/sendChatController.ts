import SendChatServiceSN from '../../services/WebsServices/SendChatServiceSN';

class SendChat {
    send = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const io = res.io;
            const value = req.body.value;
            const id_others = req.body.id_others;
            const files = req.files;
            const id_room = req.body.id_room;
            files.forEach((file: { id: any; metadata: { fileId: any } }) => {
                const fileId = file.id; // Lấy _id của tệp tin
                // Gán _id vào metadata của fileInfo
                file.metadata.fileId = fileId;
            });
            console.log(id, id_others);

            if (id_others) {
                const data = await SendChatServiceSN.send(id_room, id, id_others, value, files);

                if (data) io.emit(`${id_others}roomChat`, data);
                return res.status(200).json(data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    getRoom = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const limit = req.query.limit;
            const offset = req.query.offset;
            console.log(id, limit, offset);
            const data = await SendChatServiceSN.getRoom(id, Number(limit), Number(offset));
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
    getChat = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const id_room = req.query.id_room;
            const id_other = req.query.id_other;
            const limit = req.query.limit;
            const offset = req.query.offset;
            const of = req.query.of;

            console.log(id, limit, offset, '-cc');
            const data = await SendChatServiceSN.getChat(id_room, id, id_other, Number(limit), Number(offset), of);
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
}
export default new SendChat();
