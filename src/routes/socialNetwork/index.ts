import jwtAuth from '../../middleware/jwtAuth';
import express from 'express';
import homeRoute from './home';
function routeSN(app: any) {
    app.use('/SN', homeRoute);
}
export default routeSN;
