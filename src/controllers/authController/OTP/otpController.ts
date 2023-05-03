import OTP from '../../../services/AuthServices/OTP/OTPService';
class OTPController {
    sendOTP = async (req: any, res: any) => {
        try {
            const phoneMail = req.body.params.phoneMail;
            const IP = req.socket.remoteAddress;
            if (phoneMail) {
                const data: any = await OTP.sendOTP(phoneMail);
                if (data) {
                    return res.status(200).json(data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    verifyOTP = async (req: any, res: any) => {
        try {
            const phoneMail = req.body.params.phoneMail;
            const otp = req.body.params.otp;
            const data: any = await OTP.verifyOTP(phoneMail, otp);
            if (data) {
                return res.status(200).json(data);
            }
        } catch (error) {
            console.log(error);
        }
    };
}
export default new OTPController();
