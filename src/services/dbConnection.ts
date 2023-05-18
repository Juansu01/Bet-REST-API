import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { Event } from "../entities/Event";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";
import { Bet } from "../entities/Bet";
import { Option } from "../entities/Option";
import { Match } from "../entities/Match";
import { Team } from "../entities/Team";
import { PlacedBet } from "../entities/PlacedBet";

dotenv.config();
const myDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: [User, Event, Transaction, Bet, Option, Match, Team, PlacedBet],
  logging: false,
  synchronize: true,
});

export default myDataSource;
