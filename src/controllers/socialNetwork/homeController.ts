import userService from '../../services/userServices/socialNetwork/home';
class homeController {
    search = () => {};
    getHome = async (req: any, res: any, next: any) => {
        try {
            const data: any = await userService.getUserShareNews();
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
        }
    };
}
export default new homeController();
