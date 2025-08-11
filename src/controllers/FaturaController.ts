import { Request, Response } from 'express'
import { FaturaService } from '../services/FaturaService'

export const createFatura = async (req: Request, res: Response) => {
  try {
    const fatura = await FaturaService.create(req.body)
    res.status(201).json({ success: true, data: fatura })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getFaturas = async (_req: Request, res: Response) => {
  try {
    const faturas = await FaturaService.getAll()
    res.status(200).json({ success: true, data: faturas })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getFaturaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const fatura = await FaturaService.getById(id)
    res.status(200).json({ success: true, data: fatura })
  } catch (error: any) {
    res.status(error.message === 'Fatura não encontrada.' ? 404 : 500).json({ success: false, message: error.message })
  }
}

export const updateFatura = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const faturaAtualizada = await FaturaService.update(id, req.body)
    res.status(200).json({ success: true, data: faturaAtualizada })
  } catch (error: any) {
    res.status(
      error.message === 'Fatura não encontrada.' || error.message.startsWith('Mês inválido')
        ? 400
        : 400,
    ).json({ success: false, message: error.message })
  }
}

export const deleteFatura = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const resultado = await FaturaService.delete(id)
    res.status(200).json({ success: true, message: resultado.message })
  } catch (error: any) {
    res.status(error.message === 'Fatura não encontrada.' ? 404 : 500).json({ success: false, message: error.message })
  }
}
