import userService from '../../services/socialNetwork/home';
class homeController {
    search = () => {};
    getHome = async (req: any, res: any, next: any) => {
        try {
            console.log('home');

            // const data: any = await userService.getUserShareNews();
            // return res.status(200).json(data);
            return res.status(200).json('hello');
        } catch (e) {
            console.log(e);
        }
    };
}
export default new homeController();
