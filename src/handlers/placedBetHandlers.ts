import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { PlacedBetRequest } from "../types/placedBet";
import { PlacedBet } from "../entities/PlacedBet";
import { User } from "../entities/User";
import { Bet } from "../entities/Bet";
import { UserCredentials } from "../types/authentication";
import { makeTransaction } from "../services/transactionService";
import { TransactionCategory } from "../entities/Transaction";

export const createNewPlacedBet = async (
  request: PlacedBetRequest,
  h: ResponseToolkit
) => {
  const { bet_id, bet_option, amount } = request.payload;
  const userCredentials = request.auth.credentials as UserCredentials;
  const user = await User.findOne({
    where: { email: userCredentials.email },
    relations: {
      placed_bets: true,
    },
  });
  const betToPickFrom = await Bet.findOne({
    where: { id: bet_id },
    relations: {
      options: true,
    },
  });
  let canPlaceBet = false;

  if (!user) throw Boom.notFound("User was not found, cannot add Placed Bet.");

  if (!betToPickFrom) throw Boom.notFound("The Bet you picked wasn't found.");

  if (betToPickFrom.status === "settled")
    throw Boom.badRequest("Cannot place a bet on a settled bet.");

  if (user.balance < amount)
    throw Boom.badRequest("Cannot place bet, balance is not enough.");

  betToPickFrom.options.forEach((option) => {
    if (option.name === bet_option) {
      canPlaceBet = true;
    }
  });

  if (!canPlaceBet)
    throw Boom.notFound("The option you chose is not available inside bet.");

  const newPlacedBet = PlacedBet.create({
    user_id: user.id,
    bet_id,
    bet_option,
    amount,
  });
  await makeTransaction(TransactionCategory.BET, user, amount);
  user.placed_bets.push(newPlacedBet);
  await user.save();
  await newPlacedBet.save();
  return h.response(newPlacedBet).header("Content-Type", "application/json");
};

export const getAllPlacedBets = async (
  request: PlacedBetRequest,
  h: ResponseToolkit
) => {
  const placedBets = await PlacedBet.find({
    relations: {
      user: true,
    },
    select: {
      user: {
        email: true,
        username: true,
        role: true,
      },
    },
  });

  return h.response(placedBets).header("Content-Type", "application/json");
};

export const getPlacedBetsByUser = async (
  request: PlacedBetRequest,
  h: ResponseToolkit
) => {
  const userCredentials = request.auth.credentials as UserCredentials;
  const placedBetsByUser = await PlacedBet.find({
    where: { user: { email: userCredentials.email } },
    relations: { user: true },
    select: {
      user: {
        email: true,
        username: true,
        role: true,
      },
    },
  });

  return h.response(placedBetsByUser);
};
