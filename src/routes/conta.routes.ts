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
router.get('/:id', getContaById)
router.put('/:id', updateConta)
router.delete('/:id', deleteConta)
router.get('/user/:userId', getContasByUserId)

export default router
