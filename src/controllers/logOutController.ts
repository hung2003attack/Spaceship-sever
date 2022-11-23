import LogOut from '../services/authServices/logOut';
class logOutController {
    logOut = async (req: any, res: any) => {
        console.log('allright');

        const data: any = await LogOut.logOut(req, res);
        if (data?.status === 1) {
            return res.status(200).json({ status: 1, message: data.message });
        }
        return res.status(401).json({ status: 0, message: data.message });
    };
}
export default new logOutController();
