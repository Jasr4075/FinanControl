import { Router } from 'express'
import {
    createDespesa,
    getDespesas,
    getDespesaById,
    updateDespesa,
    deleteDespesa
} from '../controllers/DespesaController'

const router = Router()

router.post('/', createDespesa)
router.get('/', getDespesas)
router.get('/:id', getDespesaById)
router.put('/:id', updateDespesa)
router.delete('/:id', deleteDespesa)

export default router
