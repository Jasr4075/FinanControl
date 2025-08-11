import { Router } from 'express'
import {
  createTransferencia,
  getTransferencias,
  getTransferenciaById,
  updateTransferencia,
  deleteTransferencia,
} from '../controllers/TransferenciaController'

const router = Router()

router.post('/', createTransferencia)
router.get('/', getTransferencias)
router.get('/:id', getTransferenciaById)
router.put('/:id', updateTransferencia)
router.delete('/:id', deleteTransferencia)

export default router
