import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { PlacedBetRequest } from "../types/placedBet";
import { PlacedBet } from "../entities/PlacedBet";
import myDataSource from "../services/dbConnection";
import { User } from "../entities/User";

export const createNewPlacedBet = async (
  request: PlacedBetRequest,
  h: ResponseToolkit
) => {
  const { user_id, bet_id, bet_option, amount } = request.payload;
  const results = await User.find({
    where: { id: user_id },
    relations: { placed_bets: true },
  });
  const user = results[0];

  if (user) {
    const newPlacedBet = PlacedBet.create({
      user_id,
      bet_id,
      bet_option,
      amount,
    });
    user.placed_bets.push(newPlacedBet);
    await user.save();
    await newPlacedBet.save();
    return h.response(newPlacedBet).header("Content-Type", "application/json");
  }
  throw Boom.notFound("User was not found, cannot add Placed Bet.");
};

export const getAllPlacedBets = async (
  request: PlacedBetRequest,
  h: ResponseToolkit
) => {
  try {
    const placedBets = await myDataSource.getRepository(PlacedBet).find({
      relations: { user: true },
    });

    return h.response(placedBets).header("Content-Type", "application/json");
  } catch (err) {
    throw Boom.badImplementation(err.message);
  }
};
