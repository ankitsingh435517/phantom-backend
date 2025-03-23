import express from 'express';
import authRoutes from './auth.routes';


const allRoutes = express.Router();

allRoutes.use([authRoutes]);

export default allRoutes;