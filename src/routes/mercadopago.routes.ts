import { Router } from 'express';
import { loginMercadoPago, callbackMercadoPago } from '../controllers/AuthController';

const router = Router();

router.get('/login', loginMercadoPago);
router.get('/callback', callbackMercadoPago);

export default router;
