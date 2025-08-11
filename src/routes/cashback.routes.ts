import { Router } from 'express'
import {
    createCashback,
    getCashbacks,
    getCashbackById,
    updateCashback,
    deleteCashback
} from '../controllers/CashbackController'

const router = Router()

router.post('/', createCashback)
router.get('/', getCashbacks)
router.get('/:id', getCashbackById)
router.put('/:id', updateCashback)
router.delete('/:id', deleteCashback)

export default router
