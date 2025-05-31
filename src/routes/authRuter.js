import * as authController from '../controllers/authController.js';
import express from 'express';
import { isAdmin, authJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/sign-in',authController.inicioSesion)
router.post('/register' ,[authJWT, isAdmin],authController.incribirse)

export default router