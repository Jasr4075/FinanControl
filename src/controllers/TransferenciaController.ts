import { Request, Response } from 'express'
import { transferenciaService } from '../services/TransferenciaService'

export const createTransferencia = async (req: Request, res: Response) => {
  try {
    const transferencia = await transferenciaService.create(req.body)
    res.status(201).json(transferencia)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getTransferencias = async (req: Request, res: Response) => {
  try {
    const transferencias = await transferenciaService.getAll()
    res.status(200).json(transferencias)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getTransferenciaById = async (req: Request, res: Response) => {
  try {
    const transferencia = await transferenciaService.getById(req.params.id)
    res.status(200).json(transferencia)
  } catch (error: any) {
    res.status(error.message.includes('não encontrada') ? 404 : 500).json({ message: error.message })
  }
}

export const updateTransferencia = async (req: Request, res: Response) => {
  try {
    const transferencia = await transferenciaService.update(req.params.id, req.body)
    res.status(200).json(transferencia)
  } catch (error: any) {
    res.status(error.message.includes('não encontrada') ? 404 : 400).json({ message: error.message })
  }
}

export const deleteTransferencia = async (req: Request, res: Response) => {
  try {
    const result = await transferenciaService.delete(req.params.id)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(error.message.includes('não encontrada') ? 404 : 500).json({ message: error.message })
  }
}
