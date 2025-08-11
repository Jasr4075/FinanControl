import { Router } from 'express'
import {
  createReceita,
  getReceitas,
  getReceitaById,
  updateReceita,
  deleteReceita,
} from '../controllers/ReceitaController'

const router = Router()

router.post('/', createReceita)
router.get('/', getReceitas)
router.get('/:id', getReceitaById)
router.put('/:id', updateReceita)
router.delete('/:id', deleteReceita)

export default router
