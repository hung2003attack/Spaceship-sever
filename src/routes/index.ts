import authenticationRoute from './login';
import registerRoute from './register';
import deleteRouter from './delete';
import refreshRouter from './refresh';
import logOutRouter from './logOut';
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
