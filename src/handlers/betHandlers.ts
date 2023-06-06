import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { BetRequest } from "../types/bet";
import { Bet } from "../entities/Bet";
import myDataSource from "../services/dbConnection";
import { PlacedBet } from "../entities/PlacedBet";
import { User } from "../entities/User";
import { makeTransaction } from "../services/makeDeposit";
import { TransactionCategory } from "../entities/Transaction";
import { Match } from "../entities/Match";
import { BetStatus } from "../entities/Bet";

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

  if (bet) {
    if (bet.status === status)
      throw Boom.badRequest(`Bet status is ${bet.status} already.`);

    if (!Object.values(BetStatus).includes(status as BetStatus))
      throw Boom.badRequest(
        `Bet status ${status} is not inside valid statuses ` +
          "must be: active, cancelled, or settled."
      );
    const previousStatus = bet.status;
    bet.status = status;
    await bet.save();
    return h
      .response(`Bet status changed from ${previousStatus} to ${bet.status}`)
      .header("Content-Type", "application/json");
  }

  throw Boom.notFound("Bet wasn't found.");
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
      await option.save();
      odd = option.odd;
    }
  });

  if (canBeSettled) {
    const winningPlacedBets = await PlacedBet.find({
      where: { bet_option: winning_option, bet_id: betToSettle.id },
    });
    if (!winningPlacedBets) {
      throw Boom.notFound("Couldn't find any winners.");
    }
    const winnersList: Object[] = [];
    winningPlacedBets.forEach(async (placedBet) => {
      const userToReward = await User.findOne({
        where: { id: placedBet.user_id },
      });
      const amountToAdd = +placedBet.amount * +odd!;
      console.log(
        `${userToReward?.email} will be rewarded for ${amountToAdd}!`
      );
      await makeTransaction(
        "winning" as TransactionCategory,
        userToReward!,
        amountToAdd
      );
      winnersList.push({
        user_email: userToReward?.email,
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
  }

  throw Boom.notFound("Winning option is not inside Bet.");
};
