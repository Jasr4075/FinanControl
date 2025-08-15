import { Router } from 'express';
import {
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from '../controllers/UsuarioController';
import { validate } from '../middlewares/validate';
import { usuarioUpdateSchema } from '../validators/usuario.schema';

import { autenticarRequisicao } from '../middlewares/autenticacao';

const router = Router();

router.get('/',autenticarRequisicao, getUsuarios);
router.get('/:id',autenticarRequisicao, getUsuarioById);
router.put('/:id',autenticarRequisicao, validate(usuarioUpdateSchema), updateUsuario);
router.delete('/:id',autenticarRequisicao, deleteUsuario);

export default router;
