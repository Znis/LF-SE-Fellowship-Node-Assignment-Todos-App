import config from "./config";
import { Knex } from "knex";



const { database: dbConfig } = config;

export const baseKnexConfig = {
  client: dbConfig.client || 'pg',
  connection: {
    database: dbConfig.database,
    host: dbConfig.host,
    password: dbConfig.password,
    port: dbConfig.port,
    user: dbConfig.user,
  },
};


const knexConfig: Knex.Config = {
  ...baseKnexConfig,
  migrations: {
    directory: "./database/migrations",
  },
  seeds: {
    directory: "./database/seeds",
  },
};


export default knexConfig;