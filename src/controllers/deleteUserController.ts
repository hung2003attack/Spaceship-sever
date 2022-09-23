import Service from '../services/userServices/deleletUser';
class DeleteUserController {
    deleteUser = async (req: any, res: any) => {
        const message = await Service.delete(req.body.id);
        console.log(message, 'sss');
        if (message) return res.status(200).json({ result: 'Delete Successful!' });
    };
}
export default new DeleteUserController();
