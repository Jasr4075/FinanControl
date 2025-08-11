import { Request, Response } from 'express'
import { ReceitaService } from '../services/ReceitaService'

export const createReceita = async (req: Request, res: Response) => {
  try {
    const { userId, accountId, categoryId, description, quantidade, data, nota } = req.body

    if (!userId || !accountId || !categoryId || !description || !quantidade || !data) {
      return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchidos.' })
    }

    const novaReceita = await ReceitaService.create({
      userId,
      accountId,
      categoryId,
      description,
      quantidade,
      data,
      nota,
    })

    res.status(201).json({ success: true, data: novaReceita })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getReceitas = async (req: Request, res: Response) => {
  try {
    const receitas = await ReceitaService.findAll()
    res.status(200).json({ success: true, data: receitas })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getReceitaById = async (req: Request, res: Response) => {
  try {
    const receita = await ReceitaService.findById(req.params.id)
    if (!receita) {
      return res.status(404).json({ success: false, message: 'Receita não encontrada.' })
    }
    res.status(200).json({ success: true, data: receita })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateReceita = async (req: Request, res: Response) => {
  try {
    const receitaAtualizada = await ReceitaService.update(req.params.id, req.body)
    if (!receitaAtualizada) {
      return res.status(404).json({ success: false, message: 'Receita não encontrada.' })
    }
    res.status(200).json({ success: true, data: receitaAtualizada })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteReceita = async (req: Request, res: Response) => {
  try {
    const deletada = await ReceitaService.delete(req.params.id)
    if (!deletada) {
      return res.status(404).json({ success: false, message: 'Receita não encontrada.' })
    }
    res.status(200).json({ success: true, message: 'Receita excluída com sucesso.' })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}
