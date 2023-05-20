import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { PlacedBetRequest } from "../types/placedBet";
import { PlacedBet } from "../entities/PlacedBet";
import myDataSource from "../services/dbConnection";
import { User } from "../entities/User";
import { getEmailFromAccessToken } from "../services/getEmailFromAccessToken";
import { Bet } from "../entities/Bet";

export const createNewPlacedBet = async (
  request: PlacedBetRequest,
  h: ResponseToolkit
) => {
  const { bet_id, bet_option, amount } = request.payload;
  const accessToken = request.query.access_token as string;
  const userEmail = getEmailFromAccessToken(accessToken);
  const user = await User.findOne({
    where: { email: userEmail },
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

  if (user) {
    if (betToPickFrom) {
      betToPickFrom.options.forEach((option) => {
        if (option.name === bet_option) {
          canPlaceBet = true;
        }
      });
      if (canPlaceBet) {
        const newPlacedBet = PlacedBet.create({
          user_id: user.id,
          bet_id,
          bet_option,
          amount,
        });
        user.placed_bets.push(newPlacedBet);
        await user.save();
        await newPlacedBet.save();
        return h
          .response(newPlacedBet)
          .header("Content-Type", "application/json");
      }
      throw Boom.notFound("The option you chose is not available inside bet.");
    }
    throw Boom.notFound("The Bet you picked wasn't found.");
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
