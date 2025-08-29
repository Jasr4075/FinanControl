import { Router } from 'express'
import {
  createConta,
  getContas,
  getContaById,
  updateConta,
  deleteConta,
  getContasByUserId,
} from '../controllers/ContaController'

const router = Router()

router.post('/', createConta)
router.get('/', getContas)
// rota específica de usuário deve vir antes da rota genérica :id
router.get('/user/:userId', getContasByUserId)
router.get('/:id', getContaById)
router.put('/:id', updateConta)
router.delete('/:id', deleteConta)

export default router
