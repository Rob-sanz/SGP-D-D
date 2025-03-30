import * as authController from '../controllers/authController.js';
import express from 'express';

const router = express.Router();

router.post('/sign-in',authController.inicioSesion)
router.post('/register',authController.incribirse)

export default router