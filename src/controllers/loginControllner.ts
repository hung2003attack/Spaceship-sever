import user from '../services/userServices/login';
require('dotenv').config();

class loginControllner {
    login = async (req: any, res: any) => {
        const phoneNumberEmail = req.body.phoneNumberEmail;
        const password = req.body.password;

        if (
            !phoneNumberEmail ||
            !password ||
            phoneNumberEmail.includes('<script>') ||
            phoneNumberEmail.includes('</script>') ||
            phoneNumberEmail.includes('<script></script>') ||
            password.includes('<script>') ||
            password.includes('</script>') ||
            password.includes('<script></script>')
        ) {
            return res.status(500).json({ errCode: 999, message: 'Please enter your Account!' });
        } else {
            const userData: any = await user.login(phoneNumberEmail, password, res);
            if (userData.data?.idToken) {
                delete userData.data.idToken;
            }

            if (userData) {
                return res.status(200).json({
                    errCode: userData.errCode,
                    errMessage: userData.errMessage,
                    user: userData.data ? userData.data : {},
                    accessToken: userData.accessToken,
                });
            }
        }
    };
}
export default new loginControllner();
