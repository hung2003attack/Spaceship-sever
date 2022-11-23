import register from '../services/authServices/registerS';

class registerControlle {
    register = async (req: any, res: any, next: any) => {
        try {
            console.log('body', req.body);

            const message: any = await register.add(req.body.params);
            console.log(message, 'dayyyyyyyyyyyyyyyyyy');

            return res.status(200).json(message);
        } catch (err) {
            console.log('addUser', err);
        }
    };
}
export default new registerControlle();
