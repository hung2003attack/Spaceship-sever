import authenticationRoute from './auth/login';
import registerRoute from './auth/register';
import deleteRouter from './user/delete';
import refreshRouter from './auth/refresh';
import logOutRouter from './auth/logOut';
import jwtAuth from '../middleware/jwtAuth';
import userAccount from './userAccounts';
function route(app: any) {
    app.use('/login', authenticationRoute);
    app.use('/register', registerRoute);
    app.use('/refresh', refreshRouter);
    app.use('/logout', jwtAuth.verifyToken, logOutRouter);
    app.use('/delete', deleteRouter);
    app.use('/', jwtAuth.verifyToken, userAccount);
}
export default route;
