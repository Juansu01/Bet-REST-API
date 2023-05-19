import { ResponseToolkit } from "hapi";

import { BetRequest } from "../types/bet";
import { Bet } from "../entities/Bet";
import myDataSource from "../services/dbConnection";

export const createNewBet = async (request: BetRequest, h: ResponseToolkit) => {
  const { match_id, status } = request.payload;
  const newBet = Bet.create({ status, match_id });

  await newBet.save();
  return h.response(newBet).header("Content-Type", "application/json");
};

export const getAllBets = async (request: BetRequest, h: ResponseToolkit) => {
  const bets = await myDataSource.getRepository(Bet).find();

  return h.response(bets).header("Content-Type", "application/json");
};
