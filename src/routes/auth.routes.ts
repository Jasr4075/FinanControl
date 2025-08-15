import { Router } from 'express';
import { loginUsuario } from '../controllers/AuthController';
import { z } from 'zod';
import { validate } from '../middlewares/validate';

const router = Router();

const loginSchema = z.object({
  username: z.string().min(3),
  senha: z.string().min(6),
});

router.post('/login', validate(loginSchema), loginUsuario);

export default router;
