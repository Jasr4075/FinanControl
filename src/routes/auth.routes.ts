import { Router } from 'express';
import { loginUsuario } from '../controllers/AuthController';
import { createUsuario } from '../controllers/UsuarioController';
import { z } from 'zod';
import { validate } from '../middlewares/validate';
import { usuarioCreateSchema } from '../validators/usuario.schema';


const router = Router();

const loginSchema = z.object({
  username: z.string().min(3),
  senha: z.string().min(6),
});

router.post('/login', validate(loginSchema), loginUsuario);
router.post('/cadastro', validate(usuarioCreateSchema), createUsuario);


export default router;
