import { Router } from 'express'
import {
  createMeta,
  getMetas,
  getMetaById,
  updateMeta,
  deleteMeta,
} from '../controllers/MetaController'

const router = Router()

router.post('/', createMeta)
router.get('/', getMetas)
router.get('/:id', getMetaById)
router.put('/:id', updateMeta)
router.delete('/:id', deleteMeta)

export default router
