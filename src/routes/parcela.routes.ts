import { Router } from 'express'
import {
  createParcela,
  getParcelas,
  getParcelaById,
  updateParcela,
  deleteParcela,
} from '../controllers/ParcelaController'

const router = Router()

router.post('/', createParcela)
router.get('/', getParcelas)
router.get('/:id', getParcelaById)
router.put('/:id', updateParcela)
router.delete('/:id', deleteParcela)

export default router
