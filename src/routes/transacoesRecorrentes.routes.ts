import { Router } from 'express'
import {
  createTransacaoRecorrente,
  getTransacoesRecorrentes,
  getTransacaoRecorrenteById,
  updateTransacaoRecorrente,
  deleteTransacaoRecorrente,
} from '../controllers/TransacoesRecorrentesController'

const router = Router()

router.post('/', createTransacaoRecorrente)
router.get('/', getTransacoesRecorrentes)
router.get('/:id', getTransacaoRecorrenteById)
router.put('/:id', updateTransacaoRecorrente)
router.delete('/:id', deleteTransacaoRecorrente)

export default router
