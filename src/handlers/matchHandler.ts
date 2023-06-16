import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { MatchRequest } from "../types/match";
import { Match } from "../entities/Match";
import { Event } from "../entities/Event";

export const createNewMatch = async (
  request: MatchRequest,
  h: ResponseToolkit
) => {
  const { date, event_id, winner } = request.payload;
  const event = await Event.findOneBy({ id: event_id });

  if (!event)
    throw Boom.notFound("Couldn't find event, won't create new match.");
  const newMatch = Match.create({ date, event_id, winner });
  await newMatch.save();
  return h.response(newMatch).header("Content-Type", "application/json");
};

export const getAllMatches = async (
  request: MatchRequest,
  h: ResponseToolkit
) => {
  const allMatches = await Match.find({
    relations: {
      bets: true,
      teams: true,
      event: true,
    },
  });

  return h.response(allMatches);
};
