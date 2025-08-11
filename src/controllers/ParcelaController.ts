import { Request, Response } from 'express'
import { ParcelaService } from '../services/ParcelaService'

export const createParcela = async (req: Request, res: Response) => {
  try {
    const parcela = await ParcelaService.create(req.body)
    res.status(201).json({ success: true, data: parcela })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getParcelas = async (_req: Request, res: Response) => {
  try {
    const parcelas = await ParcelaService.findAll()
    res.status(200).json({ success: true, data: parcelas })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getParcelaById = async (req: Request, res: Response) => {
  try {
    const parcela = await ParcelaService.findById(req.params.id)
    if (!parcela) return res.status(404).json({ success: false, message: 'Parcela não encontrada.' })
    res.status(200).json({ success: true, data: parcela })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateParcela = async (req: Request, res: Response) => {
  try {
    const parcela = await ParcelaService.update(req.params.id, req.body)
    res.status(200).json({ success: true, data: parcela })
  } catch (error: any) {
    if (error.message === 'Parcela não encontrada.') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteParcela = async (req: Request, res: Response) => {
  try {
    await ParcelaService.delete(req.params.id)
    res.status(200).json({ success: true, message: 'Parcela excluída com sucesso.' })
  } catch (error: any) {
    if (error.message === 'Parcela não encontrada.') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}
