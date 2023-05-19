import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { BetRequest } from "../types/bet";
import { Bet } from "../entities/Bet";
import myDataSource from "../services/dbConnection";

export const createNewBet = async (request: BetRequest, h: ResponseToolkit) => {
  const { match_id, status, result } = request.payload;
  const newBet = Bet.create({ status, match_id, result });

  await newBet.save();
  return h.response(newBet).header("Content-Type", "application/json");
};

export const getAllBets = async (request: BetRequest, h: ResponseToolkit) => {
  try {
    const bets = await myDataSource.getRepository(Bet).find({
      relations: {
        options: true,
      },
    });

    return h.response(bets).header("Content-Type", "application/json");
  } catch (err) {
    throw Boom.badImplementation(err.message);
  }
};
