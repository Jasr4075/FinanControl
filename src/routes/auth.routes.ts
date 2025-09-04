import { Router } from 'express';
import { loginUsuario, registerUsuario, loginMercadoPago, callbackMercadoPago } from '../controllers/AuthController';

const router = Router();

router.post('/login', loginUsuario);
router.post('/register', registerUsuario);
router.get('/mp/login', loginMercadoPago);
router.get('/mp/callback', callbackMercadoPago);

export default router;
