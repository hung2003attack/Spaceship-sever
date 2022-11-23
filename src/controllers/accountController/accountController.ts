import Account from '../../services/accountService/accountService';

class AccountController {
    get = async (req: any, res: any) => {
        console.log(req.body);

        try {
            const data: any = await Account.get(req.body.params.phoneMail);
            if (data?.user && data?.status === 1) return res.status(200).json(data);
            return res.status(401).json('Failed');
        } catch (error) {
            console.log(error);
        }
    };
    delete = async (req: any, res: any) => {
        const message = await Account.delete(req.body.id);
        console.log(message, 'sss');
        if (message) return res.status(200).json({ result: 'Delete Successful!' });
    };
}
export default new AccountController();
