import { sequelize } from '../config/config'
import '../models'
export const initDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log('🔌 Conexão com o banco estabelecida com sucesso.')

    // Agora sim: modelos já estão registrados, pode sincronizar
    await sequelize.sync({ alter: true })
    console.log('📦 Sincronização com o banco finalizada.')

  } catch (error) {
    console.error('❌ Erro ao conectar ou acessar tabela:', error)
  }
}

export { sequelize }
