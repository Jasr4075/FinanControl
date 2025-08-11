import { Router } from 'express'
import {
    createUsuario,
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
} from '../controllers/UsuarioController'

const router = Router()

router.post('/', createUsuario)
router.get('/', getUsuarios)
router.get('/:id', getUsuarioById)
router.put('/:id', updateUsuario)
router.delete('/:id', deleteUsuario)

export default router
