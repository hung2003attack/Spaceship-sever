import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { Prohibit, VerifyMail } from '../../../models/verify/sendOTPMail';
import Security from '../checkSecurity';
import bcrypt from 'bcryptjs';

class OTP {
    sendOTP = async (phoneMail: string) => {
        return new Promise(async (resolve, reject) => {
            const otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
            const CLIENT_ID = process.env.CLIENT_ID;
            const CLIENT_SECRET = process.env.CLIENT_SECRET;
            const REDIRECT_URL = process.env.REDIRECT_URL;
            const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
            const OAUTH2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

            OAUTH2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
            try {
                const otpHash = await Security.hash(String(otp));
                const data: any = await Prohibit.findOne({ email: phoneMail }).select('sended');
                if (data?.sended <= 4 || !data) {
                    const dbSend = await VerifyMail.create({
                        email: phoneMail,
                        otp: otpHash,
                    });
                    if (data?.sended > 0 === true) {
                        await Prohibit.updateOne({
                            sended: data.sended + 1,
                        });
                    } else {
                        await Prohibit.create({
                            email: dbSend.email,
                            sended: 1,
                        });
                    }
                    const accessToken = await OAUTH2Client.getAccessToken();
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            type: 'OAuth2',
                            user: 'hungsendemail@gmail.com',
                            clientId: String(CLIENT_ID),
                            clientSecret: String(CLIENT_SECRET),
                            refreshToken: String(REFRESH_TOKEN),
                            accessToken: String(accessToken),
                        },
                    });
                    const html = `<div style=" width: '100%', text-align: 'center' ">
                                                <p>Which is OTP Code to Verify Your Email. Please Enter your code to verify</p>
                                                <h3 style="padding: '50px', background-color: '#cdcbc8' ">${otp}</h3>
                                            </div>`;

                    await transporter.sendMail(
                        {
                            from: 'hungsendemail@gmail.com',
                            to: phoneMail,
                            subject: 'Verify Email',
                            html: html,
                        },
                        (err, info) => {
                            if (err) {
                                reject(err);
                            } else {
                                console.log(err, info);
                                resolve({ status: 1, message: 'Sended Successful!' });
                            }
                        },
                    );
                }
                if (data?.sended > 4) {
                    resolve({
                        status: 0,
                        message: 'You sended too 5 OTP, please wait until after the next 1 month. Thank you!',
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    };
    verifyOTP(phoneMail: string, otp: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await VerifyMail.find({ email: phoneMail }).exec();

                if (data.length > 0) {
                    const checkOTP = await bcrypt.compareSync(otp, data[data.length - 1].otp);
                    if (checkOTP) resolve({ status: 1, message: 'ok' });
                    resolve({ status: 0, message: 'Wrong OTP!' });
                } else {
                    resolve({ status: 0, message: 'Expired Code!' });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
export default new OTP();
