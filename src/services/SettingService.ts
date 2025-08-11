import { Setting } from '../models/Setting'

export class SettingService {
  static async createSetting(userId: string, chave: string, value: string) {
    if (!userId || !chave || !value) {
      throw new Error('Campos obrigatórios não preenchidos.')
    }

    const existingSetting = await Setting.findOne({ where: { userId, chave } })
    if (existingSetting) {
      throw new Error('Setting já existe para esse usuário e chave.')
    }

    return await Setting.create({ userId, chave, value })
  }

  static async getSettings() {
    return await Setting.findAll()
  }

  static async getSettingById(id: string) {
    const setting = await Setting.findByPk(id)
    if (!setting) {
      throw new Error('Setting não encontrada.')
    }
    return setting
  }

  static async updateSetting(id: string, data: Partial<Setting>) {
    const setting = await Setting.findByPk(id)
    if (!setting) {
      throw new Error('Setting não encontrada.')
    }
    return await setting.update(data)
  }

  static async deleteSetting(id: string) {
    const setting = await Setting.findByPk(id)
    if (!setting) {
      throw new Error('Setting não encontrada.')
    }
    await setting.destroy()
    return { message: 'Setting excluída com sucesso.' }
  }
}
