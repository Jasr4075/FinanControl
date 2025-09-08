import { Router } from 'express'
import {
  createReceita,
  getReceitas,
  getReceitaById,
  updateReceita,
  deleteReceita,
  getTotalReceitasMes,
  getUltimasReceitas,
  getReceitasMesAtual
} from '../controllers/ReceitaController'

const router = Router()

router.post('/', createReceita)
router.get('/', getReceitas)
router.get('/:id', getReceitaById)
router.put('/:id', updateReceita)
router.delete('/:id', deleteReceita)
router.get('/total-mes/:userId', getTotalReceitasMes)
router.get('/ultimas/:userId', getUltimasReceitas)
router.get('/mes-atual/:userId', getReceitasMesAtual);


export default router
