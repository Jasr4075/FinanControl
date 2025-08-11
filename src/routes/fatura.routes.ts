import { Router } from 'express'
import {
  createFatura,
  getFaturas,
  getFaturaById,
  updateFatura,
  deleteFatura,
} from '../controllers/FaturaController'

const router = Router()

router.post('/', createFatura)
router.get('/', getFaturas)
router.get('/:id', getFaturaById)
router.put('/:id', updateFatura)
router.delete('/:id', deleteFatura)

export default router
