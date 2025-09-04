import { Request, Response, NextFunction } from 'express';
import { WebhookService } from '../services/WebhookService';
import { EventoWebhook } from '../models/EventoWebhook';

export class WebhookController {
  static async registrar(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, id, data } = req.body;

      if (!type || !data?.id) {
        res.status(400).json({ erro: 'Dados do webhook inválidos.' });
        return;
      }

      const mercadoPagoEventId = id?.toString?.() || '';
      const resourceId = data.id?.toString?.();
      const tipoEvento = req.body.action || type;

      await WebhookService.registrarEvento(req.body, tipoEvento, mercadoPagoEventId);

      if (tipoEvento?.startsWith('payment') && resourceId) {
        await WebhookService.processarStatus(resourceId);
      }

      res.status(201).json({ mensagem: 'Evento registrado com sucesso.' });
    } catch (error) {
      next(error);
    }
  }

  static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const eventos = await EventoWebhook.findAll({ order: [['recebido_em', 'DESC']] });
      res.json(eventos);
    } catch (error) {
      next(error);
    }
  }

  static async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const evento = await EventoWebhook.findByPk(req.params.id);
      if (!evento) return res.status(404).json({ erro: 'Evento não encontrado.' });
      res.json(evento);
    } catch (error) {
      next(error);
    }
  }
}
