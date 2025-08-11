// src/controllers/DespesaController.ts
import { Request, Response } from 'express'
import { DespesaService } from '../services/DespesaService'

export const createDespesa = async (req: Request, res: Response) => {
  try {
    const despesa = await DespesaService.create(req.body)
    res.status(201).json({ success: true, data: despesa })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getDespesas = async (_req: Request, res: Response) => {
  try {
    const despesas = await DespesaService.getAll()
    res.status(200).json({ success: true, data: despesas })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getDespesaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const despesa = await DespesaService.getById(id)
    res.status(200).json({ success: true, data: despesa })
  } catch (error: any) {
    res.status(error.message === 'Despesa não encontrada.' ? 404 : 500).json({ success: false, message: error.message })
  }
}

export const updateDespesa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const despesaAtualizada = await DespesaService.update(id, req.body)
    res.status(200).json({ success: true, data: despesaAtualizada })
  } catch (error: any) {
    res.status(error.message === 'Despesa não encontrada.' ? 404 : 400).json({ success: false, message: error.message })
  }
}

export const deleteDespesa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const resultado = await DespesaService.delete(id)
    res.status(200).json({ success: true, message: resultado.message })
  } catch (error: any) {
    res.status(error.message === 'Despesa não encontrada.' ? 404 : 500).json({ success: false, message: error.message })
  }
}
