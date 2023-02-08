import jwtAuth from '../../middleware/jwtAuth';
import express from 'express';
import homeRoute from './home';
import searchRoute from './searchRouterSN';
import userRoute from './user';
function routeSN(app: any) {
    console.log('erararea');
    app.use('/api/SN/user', jwtAuth.verifyToken, userRoute);
    app.use('/api/SN/home', jwtAuth.verifyToken, homeRoute);
    app.use('/api/SN/profile', jwtAuth.verifyToken, searchRoute);
}
export default routeSN;
