import { Router } from 'express';
import { gerarToken } from '../controllers/AuthController';

const router = Router();

router.post('/token', gerarToken);
export default router;