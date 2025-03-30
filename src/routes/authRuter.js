import * as authController from '../controllers/authController.js';
import express from 'express';

const router = express.Router();

router.post('/sign-in',authController.inisioSesion)

export default router