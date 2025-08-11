import { Sequelize } from 'sequelize'

const requiredEnv = ['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'DB_PORT'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) throw new Error(`Variavel de ambiente ${key} esta faltando.`);
});

const isProd = process.env.NODE_ENV === 'production';

export const sequelize = new Sequelize({
  database: process.env.DB_NAME!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  dialect: 'postgres',
  dialectOptions: isProd
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  logging: false,
});

