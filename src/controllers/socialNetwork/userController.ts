import UserServiceSN from '../../services/SocialNetwork/UserServiceSN';
class userController {
    getById = async (req: any, res: any) => {
        try {
            const id: string = req.body.id;
            const data: any = await UserServiceSN.getById(id, req.body.params);

            if (data.status === 1) return res.status(200).json(data.data);
            return res.status(500).json({ mess: 'Faild!' });
        } catch (error) {
            console.log(error);
        }
    };
    getByName = async (req: any, res: any) => {
        try {
            const name: string = req.body.name;
            const data: any = await UserServiceSN.getByName(name, req.body.params);
            if (data.status === 1) return res.status(200).json(data.data);
            return res.status(500).json({ mess: 'Faild!' });
        } catch (error) {
            console.log(error);
        }
    };
    update = async (req: any, res: any) => {
        try {
            const id: string = req.body.id;
            const lg: string = req.body.lg;
            const data: any = await UserServiceSN.update(id, lg);
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
}
export default new userController();
