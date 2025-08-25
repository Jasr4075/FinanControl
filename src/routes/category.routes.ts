import { Router } from 'express'
import {
    createCategoriesBulk,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../controllers/CategoryController'

const router = Router()

router.post('/', createCategoriesBulk)
router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router
