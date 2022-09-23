import UserManipulation from '../services/userServices/addUser';

class registerControlle {
    register = async (req: any, res: any, next: any) => {
        try {
            const message: any = await UserManipulation.addUser(req.body.params);
            if (message.check) {
                return res.status(200).json(message);
            } else {
                return res.status(200).json(message);
            }
        } catch (err) {
            console.log('addUser', err);
        }
    };
}
export default new registerControlle();
