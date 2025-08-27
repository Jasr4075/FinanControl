import { Router } from 'express'
import {
  createCartao,
  getCartoes,
  getCartaoById,
  updateCartao,
  deleteCartao,
  getCartaoResumo,
} from '../controllers/CartaoController'

const router = Router()

router.post('/', createCartao)
router.get('/', getCartoes)
router.get('/:id', getCartaoById)
router.get('/:id/resumo', getCartaoResumo)
router.put('/:id', updateCartao)
router.delete('/:id', deleteCartao)

export default router
