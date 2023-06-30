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

export const getMatchById = async (
  request: MatchRequest,
  h: ResponseToolkit
) => {
  const matchId = request.params.id;
  const match = await Match.findOne({
    where: {
      id: parseInt(matchId),
    },
    relations: {
      bets: true,
      teams: true,
      event: true,
    },
  });

  if (match) return h.response(match);

  throw Boom.notFound("Match was not found.");
};

export const deleteMatchById = async (
  request: MatchRequest,
  h: ResponseToolkit
) => {
  const matchId = request.params.id;
  const match = await Match.findOne({
    where: {
      id: parseInt(matchId),
    },
    relations: {},
  });

  if (match) {
    await Match.softRemove(match);
    return h.response({ message: "Match successfully deleted." });
  }

  throw Boom.notFound("Match was not found, cannot delete.");
};

export const getDeletedMatches = async (
  request: MatchRequest,
  h: ResponseToolkit
) => {
  const deletedMatches = await Match.find({
    withDeleted: true,
    relations: {
      bets: true,
      teams: true,
    },
    select: {
      id: true,
      deleted_at: true,
    },
  });

  return h.response(deletedMatches);
};
