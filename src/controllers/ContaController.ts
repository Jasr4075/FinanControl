import { Request, Response } from 'express'
import { ContaService } from '../services/ContaService'

export const createConta = async (req: Request, res: Response) => {
  try {
    const conta = await ContaService.create(req.body)
    res.status(201).json({ success: true, data: conta })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getContas = async (_req: Request, res: Response) => {
  try {
    const contas = await ContaService.findAll()
    res.status(200).json({ success: true, data: contas })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getContaById = async (req: Request, res: Response) => {
  try {
    const conta = await ContaService.findById(req.params.id)
    if (!conta) return res.status(404).json({ success: false, message: 'Conta não encontrada.' })
    res.status(200).json({ success: true, data: conta })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateConta = async (req: Request, res: Response) => {
  try {
    const conta = await ContaService.update(req.params.id, req.body)
    res.status(200).json({ success: true, data: conta })
  } catch (error: any) {
    if (error.message === 'Conta não encontrada.') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteConta = async (req: Request, res: Response) => {
  try {
    await ContaService.delete(req.params.id)
    res.status(200).json({ success: true, message: 'Conta excluída com sucesso.' })
  } catch (error: any) {
    if (error.message === 'Conta não encontrada.') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}
