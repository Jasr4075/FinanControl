import { Router } from 'express';
import {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from '../controllers/UsuarioController';
import { validate } from '../middlewares/validate';
import { usuarioCreateSchema, usuarioUpdateSchema } from '../validators/usuario.schema';

const router = Router();

router.post('/', validate(usuarioCreateSchema), createUsuario);
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', validate(usuarioUpdateSchema), updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;
