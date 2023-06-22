import jwtAuth from '../../middleware/jwtAuth';
import express from 'express';
import homeRoute from './socialNetwork/home';
import searchRoute from './socialNetwork/searchRouterSN';
import userRoute from './user';
import peopleRoute from './socialNetwork/people';
import sendChat from './sendChat';
function routeSN(app: any) {
    console.log('erararea');
    app.use('/api/SN/user', userRoute);
    app.use('/api/SN/home', homeRoute);
    app.use('/api/SN/profile', searchRoute);
    app.use('/api/SN/people', peopleRoute);
    app.use('/api/SN/sendChat', sendChat);
}
export default routeSN;
