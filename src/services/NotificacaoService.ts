import { Notificacao } from '../models/Notificacao'

export class NotificacaoService {
  static async create(data: {
    userId: string
    type: string
    message: string
    read?: boolean
  }) {
    const { userId, type, message, read = false } = data

    if (!userId || !type || !message) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    const novaNotificacao = await Notificacao.create({
      userId,
      type,
      message,
      read,
    })

    return novaNotificacao
  }

  static async getAll() {
    return await Notificacao.findAll()
  }

  static async getById(id: number) {
    const notificacao = await Notificacao.findByPk(id)
    if (!notificacao) {
      throw new Error('Notificação não encontrada.')
    }
    return notificacao
  }

  static async update(id: number, data: Partial<{ type: string; message: string; read: boolean }>) {
    const notificacao = await Notificacao.findByPk(id)
    if (!notificacao) {
      throw new Error('Notificação não encontrada.')
    }
    await notificacao.update(data)
    return notificacao
  }

  static async delete(id: number) {
    const notificacao = await Notificacao.findByPk(id)
    if (!notificacao) {
      throw new Error('Notificação não encontrada.')
    }
    await notificacao.destroy()
  }
}
