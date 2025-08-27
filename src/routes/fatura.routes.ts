import { Router } from 'express'
import {
  createFatura,
  getFaturas,
  getFaturaById,
  updateFatura,
  deleteFatura,
  getFaturaDetalhe,
  getFaturaAtualPorCartao,
  getFaturaPorMes,
  listFaturasPorCartao,
} from '../controllers/FaturaController'

const router = Router()

router.post('/', createFatura)
router.get('/', getFaturas)
router.get('/:id', getFaturaById)
router.get('/:id/detalhe', getFaturaDetalhe)
router.get('/cartao/:cartaoId/atual', getFaturaAtualPorCartao)
router.get('/cartao/:cartaoId/mes', getFaturaPorMes)
router.get('/cartao/:cartaoId/list', listFaturasPorCartao)
router.put('/:id', updateFatura)
router.delete('/:id', deleteFatura)

export default router
