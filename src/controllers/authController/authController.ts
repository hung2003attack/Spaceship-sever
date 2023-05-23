import { redisClient } from '../..';
import authServices from '../../services/AuthServices/AuthServices';

class authController {
    login = async (req: any, res: any) => {
        const error = ['<script></script>', '<script>', '</script>'];
        const phoneNumberEmail = req.body.params.nameAccount;
        const password = req.body.params.password;
        if (!phoneNumberEmail || !password || phoneNumberEmail.includes(error) || password.includes(error)) {
            return res.status(500).json({ errCode: 0, message: 'Please enter your Account!' });
        } else {
            const userData: any = await authServices.login(phoneNumberEmail, password, res);
            console.log('close');
            if (userData) {
                return res.status(200).json({
                    errCode: userData.errCode,
                    errMessage: userData.errMessage,
                    user: userData.data ? userData.data : {},
                });
            }
        }
    };
    logOut = async (req: any, res: any) => {
        console.log('allright');
        const id = req.cookies.k_user;
        const key_private = id + 'private';
        const data: any = await authServices.logOut(req, res);
        if (data?.status === 1) {
            redisClient.lrange(key_private, 0, -1, (err: any, items: string[]) => {
                if (err) console.log(err);
                items.forEach((item) => {
                    redisClient.del(item, (err: any, count: any) => {
                        if (err) console.log(err);
                        console.log(`Deleted ${count} key(s)`);
                    });
                });
            });
            redisClient.del(key_private, (err: any, count: number) => {
                if (err) console.log(err);
                console.log(`Deleted ${count} key(s)`);
            });
            return res.status(200).json({ status: 1, message: data.message });
        }
        return res.status(401).json({ status: 0, message: data.message });
    };
    register = async (req: any, res: any, next: any) => {
        try {
            console.log('body', req.body);

            const message: any = await authServices.add(req.body.params);
            console.log(message, 'dayyyyyyyyyyyyyyyyyy');

            return res.status(200).json(message);
        } catch (err) {
            console.log('addUser', err);
        }
    };
}
export default new authController();
