import { Router } from 'express'
import {
    createDespesa,
    getDespesas,
    getDespesaById,
    updateDespesa,
    deleteDespesa,
    getTotalDespesasMes,
    getUltimasDespesas,
    getDespesasMesAtual
} from '../controllers/DespesaController'

const router = Router()

router.post('/', createDespesa)
router.get('/', getDespesas)
router.get('/:id', getDespesaById)
router.put('/:id', updateDespesa)
router.delete('/:id', deleteDespesa)
router.get('/total-mes/:userId', getTotalDespesasMes)
router.get('/ultimas/:userId', getUltimasDespesas)
router.get('/mes-atual/:userId', getDespesasMesAtual);



export default router
