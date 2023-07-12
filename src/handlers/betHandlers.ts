import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { BetRequest } from "../types/bet";
import { Bet } from "../entities/Bet";
import { PlacedBet } from "../entities/PlacedBet";
import { User } from "../entities/User";
import { makeTransaction } from "../services/transactionService";
import { TransactionCategory } from "../entities/Transaction";
import { Match } from "../entities/Match";

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
  const { winning_option } = request.payload;
  const betToSettle = await Bet.findOne({
    where: { id: parseInt(id) },
    relations: { options: true },
  });
  let canBeSettled = false;
  let odd: number | null = null;

  if (!betToSettle) throw Boom.notFound("Bet was not found.");

  if (betToSettle.status === "settled")
    throw Boom.badRequest("Bet is already settled.");

  betToSettle.options.forEach(async (option) => {
    if (option.name === winning_option) {
      canBeSettled = true;
      option.did_win = true;
      odd = option.odd;
      await option.save();
    }
  });

  if (!canBeSettled) throw Boom.notFound("Winning option is not inside Bet.");

  const winningPlacedBets = await PlacedBet.find({
    where: { bet_option: winning_option, bet_id: betToSettle.id },
  });

  if (!winningPlacedBets) {
    return h.response("There weren't any winning placed bets.");
  }

  const winnersList: Object[] = [];
  winningPlacedBets.forEach(async (placedBet) => {
    const userToReward = await User.findOne({
      where: { id: placedBet.user_id },
    });
    if (!userToReward) return;
    const amountToAdd = +placedBet.amount * +odd!;
    console.log(`${userToReward.email} will be rewarded for ${amountToAdd}!`);
    await makeTransaction(
      "winning" as TransactionCategory,
      userToReward!,
      amountToAdd
    );
    winnersList.push({
      user_email: userToReward.email,
      received_amount: amountToAdd,
    });
  });
  const matchFromBet = await Match.findOneBy({ id: betToSettle.match_id });
  if (matchFromBet) matchFromBet.winner = winning_option;
  betToSettle.result = winning_option;
  betToSettle.status = "settled";
  await betToSettle.save();
  return h.response({
    message: "Successfully settled.",
    winners: winnersList,
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
