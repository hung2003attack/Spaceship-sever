import LogOut from '../services//userServices/logOut';
class logOutController {
    logOut = async (req: any, res: any) => {
        const message = await LogOut.logOut(req, res);
        return res.status(200).json({ result: message });
    };
}
export default new logOutController();
