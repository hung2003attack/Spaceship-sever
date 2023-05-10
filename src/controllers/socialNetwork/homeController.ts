import HomeSN from '../../services/SocialNetwork/Home';
class homeController {
    setPost = async (req: any, res: any) => {
        console.log(req.body, 'setPost');
        const data = await HomeSN.setPost;
    };
    search = () => {};
    getPost = async (req: any, res: any, next: any) => {
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
