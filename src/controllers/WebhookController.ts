import { Request, Response, NextFunction } from 'express';
import { WebhookService } from '../services/WebhookService';
import { EventoWebhook } from '../models/EventoWebHook';

export class WebhookController {

  // Recebe eventos do Mercado Pago
  static async registrar(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, id, data, action } = req.body;

      // Validação básica do payload
      if (!type || !data?.id) {
        console.warn('Webhook inválido recebido:', req.body);
        return res.status(400).json({ erro: 'Dados do webhook inválidos.' });
      }

      const mercadoPagoEventId = id?.toString?.() || '';
      const resourceId = data.id?.toString?.();
      const tipoEvento = action || type;

      console.info(`[Webhook] Evento recebido: ${tipoEvento} - ID: ${mercadoPagoEventId}`);

      // Registra evento no banco
      await WebhookService.registrarEvento(req.body, tipoEvento, mercadoPagoEventId);

      // Processa apenas eventos de pagamento
      if (tipoEvento?.startsWith('payment') && resourceId) {
        const status = await WebhookService.processarStatus(resourceId);
        console.info(`[Webhook] Pagamento ${resourceId} processado com status: ${status}`);
      }

      return res.status(201).json({ mensagem: 'Evento registrado com sucesso.' });

    } catch (error) {
      console.error(`[Webhook] Erro ao registrar evento:`, error);
      return next(error);
    }
  }

  // Lista todos os eventos registrados
  static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const eventos = await EventoWebhook.findAll({ order: [['recebido_em', 'DESC']] });
      res.json(eventos);
    } catch (error) {
      console.error('[Webhook] Erro ao listar eventos:', error);
      next(error);
    }
  }

  // Busca um evento específico pelo ID
  static async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const evento = await EventoWebhook.findByPk(req.params.id);
      if (!evento) {
        console.warn(`[Webhook] Evento não encontrado: ${req.params.id}`);
        return res.status(404).json({ erro: 'Evento não encontrado.' });
      }
      res.json(evento);
    } catch (error) {
      console.error(`[Webhook] Erro ao buscar evento ${req.params.id}:`, error);
      next(error);
    }
  }

}
