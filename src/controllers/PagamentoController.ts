import { Request, Response } from 'express'
import mercadoPago from '../utils/mercadopago'

export class PagamentoController {
  static async listar(req: Request, res: Response) {
    try {
      const results = await mercadoPago.payment.search({ options: { limit: 20, offset: 0 } })
      res.json(results.results) // já vem direto
    } catch (error: any) {
      res.status(500).json({ erro: error.message })
    }
  }

  static async buscarPorId(req: Request, res: Response) {
    try {
      const result = await mercadoPago.payment.get({ id: req.params.id })
      res.json(result) // já é o objeto do pagamento
    } catch (error: any) {
      res.status(500).json({ erro: error.message })
    }
  }
}
