import searchServiceSN from '../../services/socialNetwork/searchServiceSN';
import SearchService from '../../services/socialNetwork/searchServiceSN';

class SearchController {
    getUser = async (req: any, res: any) => {
        try {
            const id = req.body.params.id;
            if (id) {
                const data = await searchServiceSN.get(id);
                return res.status(200).json(data);
            }
        } catch (error) {
            console.log(error);
        }
    };
}
export default new SearchController();
