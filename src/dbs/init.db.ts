import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } = process.env
const sequelize = new Sequelize(DB_NAME as string, DB_USER as string, DB_PASSWORD as string, {
  host: DB_HOST,
  port: DB_PORT ? parseInt(DB_PORT) : undefined,
  dialect: 'mysql',
  timezone: '+07:00',
  logging: false
})

const connectDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export { connectDatabase }
