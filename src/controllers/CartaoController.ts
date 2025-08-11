import { Request, Response } from 'express'
import { CartaoService } from '../services/CartaoService'

export const createCartao = async (req: Request, res: Response) => {
  try {
    const cartao = await CartaoService.create(req.body)
    res.status(201).json({ success: true, data: cartao })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getCartoes = async (_req: Request, res: Response) => {
  try {
    const cartoes = await CartaoService.findAll()
    res.status(200).json({ success: true, data: cartoes })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getCartaoById = async (req: Request, res: Response) => {
  try {
    const cartao = await CartaoService.findById(req.params.id)
    if (!cartao) return res.status(404).json({ success: false, message: 'Cartão não encontrado.' })
    res.status(200).json({ success: true, data: cartao })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateCartao = async (req: Request, res: Response) => {
  try {
    const cartao = await CartaoService.update(req.params.id, req.body)
    res.status(200).json({ success: true, data: cartao })
  } catch (error: any) {
    if (error.message === 'Cartão não encontrado.') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteCartao = async (req: Request, res: Response) => {
  try {
    await CartaoService.delete(req.params.id)
    res.status(200).json({ success: true, message: 'Cartão excluído com sucesso.' })
  } catch (error: any) {
    if (error.message === 'Cartão não encontrado.') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}
