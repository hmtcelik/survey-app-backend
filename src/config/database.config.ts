import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { config } from 'dotenv';

// load env vars in .env file
config(); 

export const devConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: true,
}
