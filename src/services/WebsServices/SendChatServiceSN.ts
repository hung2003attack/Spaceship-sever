import { RoomChats } from '../../models/mongodb/chats';

class SendChatService {
    send(value: string, files: any) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(files);
                const ids_file = files.map((f: any) => f.id.toString());
                console.log(ids_file, 'id');

                // const res = await new RoomChats
            } catch (error) {
                reject(error);
            }
        });
    }
}
export default new SendChatService();
