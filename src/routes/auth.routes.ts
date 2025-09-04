import { Router } from 'express';
import { loginUsuario, registerUsuario } from '../controllers/AuthController';

const router = Router();

router.post('/login', loginUsuario);
router.post('/register', registerUsuario);

export default router;
