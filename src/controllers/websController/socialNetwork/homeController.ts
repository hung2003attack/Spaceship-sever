import HomeServiceSN from '../../../services/WebsServices/SocialNetwork/HomeServiceSN';
class homeController {
    setPost = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            let more: { title?: string; bg?: string; column?: number } = {};
            const io = res.io;
            const value = req.body.text;
            const files = req.files;
            const category = req.body.category;
            const fontFamily = req.body.fontFamily;

            if (category === 0) {
                const title = req.body.title;
                more = { title };
            } else if (category === 2) {
                const column = req.body.column;
                const bg = req.body.bg;
                more = { bg, column };
            }

            console.log(value, files, req.body);

            const data = await HomeServiceSN.setPost(id, value, category, fontFamily, files, more);
        } catch (error) {
            console.log(error);
        }
    };
    search = () => {};
    getPost = async (req: any, res: any, next: any) => {
        try {
            // const data: any = await userService.getUserShareNews();
            // return res.status(200).json(data);
            // return res.status(200).json('hello');
        } catch (e) {
            console.log(e);
        }
    };
}
export default new homeController();
