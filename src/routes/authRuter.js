import * as authController from '../controllers/authController.js';
import express from 'express';
import { isAdmin, authJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/sign-in',authController.inicioSesion)
router.post('/register' ,[isAdmin, authJWT],authController.incribirse)

export default router