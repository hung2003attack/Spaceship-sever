import jwtAuth from '../middleware/jwtAuth';

import otpRouter from './account/otpRouter';
import accountRouter from './account/account';
import routeSN from './websRoutes';
function route(app: any) {
    console.log('123');

    app.use('/api/otp', otpRouter);
    app.use('/api/account', accountRouter);
}
export default route;
