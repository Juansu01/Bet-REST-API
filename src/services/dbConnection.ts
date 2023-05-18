import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { Event } from "../entities/Event";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";
import { Bet } from "../entities/Bet";
import { Option } from "../entities/Option";

dotenv.config();
const myDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: [User, Event, Transaction, Bet, Option],
  logging: true,
  synchronize: true,
});

export default myDataSource;
