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
        match: true,
      },
    });

    return h.response(bets).header("Content-Type", "application/json");
  } catch (err) {
    throw Boom.badImplementation(err.message);
  }
};

export const changeBetStatus = async (
  request: BetRequest,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const { status } = request.payload;
  const bet = await Bet.findOne({ where: { id: parseInt(id) } });

  try {
    if (bet) {
      const previousStatus = bet.status;
      bet.status = status;
      await bet.save();
      return h
        .response(`Bet status changed from ${previousStatus} to ${bet.status}`)
        .header("Content-Type", "application/json");
    }
  } catch (err) {
    throw Boom.badImplementation(err);
  }

  throw Boom.notFound("Bet wasn't found.");
};
