import { sequelize } from '../config/config'
import '../models'

export const initDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log('Postgres ✅')

    await sequelize.sync({ alter: true })
    console.log('Tabelas  ✅')

  } catch (error) {
    console.error('Tabelas ❌', error)
  }
}

export { sequelize }
