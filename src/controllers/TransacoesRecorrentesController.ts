import { Request, Response } from 'express'
import { TransacoesRecorrentesService } from '../services/TransacoesRecorrentesService'

export const createTransacaoRecorrente = async (req: Request, res: Response) => {
  try {
    const transacao = await TransacoesRecorrentesService.create(req.body)
    res.status(201).json({ success: true, data: transacao })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getTransacoesRecorrentes = async (_req: Request, res: Response) => {
  try {
    const transacoes = await TransacoesRecorrentesService.getAll()
    res.status(200).json({ success: true, data: transacoes })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getTransacaoRecorrenteById = async (req: Request, res: Response) => {
  try {
    const transacao = await TransacoesRecorrentesService.getById(req.params.id)
    res.status(200).json({ success: true, data: transacao })
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message })
  }
}

export const updateTransacaoRecorrente = async (req: Request, res: Response) => {
  try {
    const transacao = await TransacoesRecorrentesService.update(req.params.id, req.body)
    res.status(200).json({ success: true, data: transacao })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteTransacaoRecorrente = async (req: Request, res: Response) => {
  try {
    const result = await TransacoesRecorrentesService.delete(req.params.id)
    res.status(200).json({ success: true, ...result })
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message })
  }
}
