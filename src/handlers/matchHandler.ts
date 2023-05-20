import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { MatchRequest } from "../types/match";
import { Match } from "../entities/Match";
import myDataSource from "../services/dbConnection";

export const createNewMatch = async (
  request: MatchRequest,
  h: ResponseToolkit
) => {
  const { date, event_id, winner } = request.payload;
  try {
    const newMatch = Match.create({ date, event_id, winner });
    await newMatch.save();
    return h.response(newMatch).header("Content-Type", "application/json");
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation(err);
  }
};

export const getAllMatches = async (
  request: MatchRequest,
  h: ResponseToolkit
) => {
  const matches = await myDataSource.getRepository(Match).find({
    relations: {
      bets: true,
      teams: true,
    },
  });

  return h.response(matches).header("Content-Type", "application/json");
};
