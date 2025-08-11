import { Request, Response } from 'express'
import { CashbackService } from '../services/CashbackService'

export const createCashback = async (req: Request, res: Response) => {
  try {
    const cashback = await CashbackService.create(req.body)
    res.status(201).json({ success: true, data: cashback })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getCashbacks = async (_req: Request, res: Response) => {
  try {
    const cashbacks = await CashbackService.findAll()
    res.status(200).json({ success: true, data: cashbacks })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getCashbackById = async (req: Request, res: Response) => {
  try {
    const cashback = await CashbackService.findById(req.params.id)
    if (!cashback) return res.status(404).json({ success: false, message: 'Cashback não encontrado.' })
    res.status(200).json({ success: true, data: cashback })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateCashback = async (req: Request, res: Response) => {
  try {
    const cashback = await CashbackService.update(req.params.id, req.body)
    res.status(200).json({ success: true, data: cashback })
  } catch (error: any) {
    if (error.message === 'Cashback não encontrado.') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteCashback = async (req: Request, res: Response) => {
  try {
    await CashbackService.delete(req.params.id)
    res.status(200).json({ success: true, message: 'Cashback excluído com sucesso.' })
  } catch (error: any) {
    if (error.message === 'Cashback não encontrado.') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}
