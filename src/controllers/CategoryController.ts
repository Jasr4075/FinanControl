import { Request, Response } from 'express'
import { CategoryService } from '../services/CategoryService'

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body
  
    try {
      if (!name) {
      return res.status(400).json({ success: false, message: 'Nome da categoria é obrigatório.' })
    }

    const category = await CategoryService.create(req.body.name)
    res.status(201).json({ success: true, data: category })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryService.findAll()
    res.status(200).json({ success: true, data: categories })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.findById(req.params.id)
    if (!category) return res.status(404).json({ success: false, message: 'Categoria não encontrada.' })

    res.status(200).json({ success: true, data: category })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.update(req.params.id, req.body.name)
    res.status(200).json({ success: true, data: category })
  } catch (error: any) {
    if (error.message === 'Categoria não encontrada.') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await CategoryService.delete(req.params.id)
    res.status(200).json({ success: true, message: 'Categoria excluída com sucesso.' })
  } catch (error: any) {
    if (error.message === 'Categoria não encontrada.') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}
