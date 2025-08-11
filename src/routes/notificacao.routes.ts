import { Router } from 'express'
import {
  createNotificacao,
  getNotificacoes,
  getNotificacaoById,
  updateNotificacao,
  deleteNotificacao,
} from '../controllers/NotificacaoController'

const router = Router()

router.post('/', createNotificacao)
router.get('/', getNotificacoes)
router.get('/:id', getNotificacaoById)
router.put('/:id', updateNotificacao)
router.delete('/:id', deleteNotificacao)

export default router
