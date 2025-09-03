import { Router } from 'express'
import { PagamentoController } from '../controllers/PagamentoController'

const router = Router()

router.get('/', PagamentoController.listar)
router.get('/:id', PagamentoController.buscarPorId)

export default router
