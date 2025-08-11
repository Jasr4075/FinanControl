import { Request, Response } from 'express'
import { NotificacaoService } from '../services/NotificacaoService'

export const createNotificacao = async (req: Request, res: Response) => {
  try {
    const notificacao = await NotificacaoService.create(req.body)
    res.status(201).json(notificacao)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getNotificacoes = async (_req: Request, res: Response) => {
  try {
    const notificacoes = await NotificacaoService.getAll()
    res.status(200).json(notificacoes)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getNotificacaoById = async (req: Request, res: Response) => {
  try {
    const notificacao = await NotificacaoService.getById(Number(req.params.id))
    res.status(200).json(notificacao)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export const updateNotificacao = async (req: Request, res: Response) => {
  try {
    const notificacao = await NotificacaoService.update(Number(req.params.id), req.body)
    res.status(200).json(notificacao)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteNotificacao = async (req: Request, res: Response) => {
  try {
    await NotificacaoService.delete(Number(req.params.id))
    res.status(200).json({ message: 'Notificação excluída com sucesso.' })
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}
