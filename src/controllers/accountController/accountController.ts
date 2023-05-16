import Account from '../../services/AccountService/AccountService';

class accountController {
    get = async (req: any, res: any) => {
        try {
            const phoneMail = req.body.params.phoneMail;
            const data: any = await Account.get(phoneMail);
            if (data?.user && data?.status === 1) return res.status(200).json(data);
            return res.status(401).json('Failed');
        } catch (error) {
            console.log(error);
        }
    };
    delete = async (req: any, res: any) => {
        const message = await Account.delete(req.body.id);
        if (message) return res.status(200).json({ result: 'Delete Successful!' });
    };
    changePassword = async (req: any, res: any) => {
        try {
            const { id, password } = req.body.params;
            const data: any = await Account.changePassword(id, password);
            if (data === 1) return res.status(200).json({ status: data, message: 'Password changed successfully' });
            if (data === 3)
                return res.status(200).json({ status: data, message: 'those are the password you used before' });
            return res.status(401);
        } catch (error) {
            console.log(error);
        }
    };
}
export default new accountController();
