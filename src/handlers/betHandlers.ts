import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { BetRequest } from "../types/bet";
import { Bet } from "../entities/Bet";
import { PlacedBet } from "../entities/PlacedBet";
import {
  canSettleBet,
  rewardUsers,
  settleBet as setBetToSettled,
} from "../services/settleBet";

export const createNewBet = async (request: BetRequest, h: ResponseToolkit) => {
  const { match_id, result } = request.payload;
  const newBet = Bet.create({ match_id, result });

  await newBet.save();
  return h.response(newBet);
};

export const getBetById = async (request: BetRequest, h: ResponseToolkit) => {
  const { id } = request.params;
  const bet = await Bet.findOne({
    where: { id: parseInt(id) },
    relations: { options: true, match: true },
  });

  if (bet) return h.response(bet);

  throw Boom.notFound("Bet was not found.");
};

export const getAllBets = async (request: BetRequest, h: ResponseToolkit) => {
  const allBets = await Bet.find({
    relations: {
      options: true,
      match: true,
    },
  });

  return h.response(allBets);
};

export const changeBetStatus = async (
  request: BetRequest,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const { status } = request.payload;
  const bet = await Bet.findOne({ where: { id: parseInt(id) } });

  if (!bet) throw Boom.notFound("Bet wasn't found.");

  if (bet.status === status)
    throw Boom.badRequest(`Bet status is ${bet.status} already.`);

  const previousStatus = bet.status;
  bet.status = status;
  await bet.save();
  return h.response(
    `Bet status changed from ${previousStatus} to ${bet.status}`
  );
};

export const settleBet = async (request: BetRequest, h: ResponseToolkit) => {
  const { id } = request.params;
  const { winning_option: winningOption } = request.payload;
  const betToSettle = await Bet.findOne({
    where: { id: parseInt(id) },
    relations: { options: true },
  });

  if (!betToSettle) throw Boom.notFound("Bet was not found.");

  if (betToSettle.status === "cancelled" || betToSettle.status === "settled")
    throw Boom.badRequest(`Cannot settle bet, bet is ${betToSettle.status}`);

  const odd = await canSettleBet(betToSettle, winningOption);

  const winningPlacedBets = await PlacedBet.find({
    where: { bet_option: winningOption, bet_id: betToSettle.id },
  });

  if (!winningPlacedBets) {
    return h.response("There weren't any winning placed bets.");
  }

  const rewardedUsers = await rewardUsers(winningPlacedBets, odd);
  await setBetToSettled(betToSettle, winningOption);

  return h.response({
    message: "Successfully settled.",
    winners: rewardedUsers,
  });
};

export const deleteBetById = async (
  request: BetRequest,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const bet = await Bet.findOne({
    where: { id: parseInt(id) },
    relations: { options: true, match: true },
  });

  if (bet) {
    await bet.softRemove();
    return h.response("Bet successfully deleted.");
  }

  throw Boom.notFound("Bet was not found.");
};
