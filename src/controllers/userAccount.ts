class userAccount {
    getFriend(req: any, res: any) {
        console.log('vo');
        return res.status(200).json('hello');
    }
}
export default new userAccount();
