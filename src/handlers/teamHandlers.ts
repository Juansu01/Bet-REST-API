import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";
import { IsNull, Not } from "typeorm";

import { TeamRequest } from "../types/team";
import { Team } from "../entities/Team";
import { Match } from "../entities/Match";

export const createNewTeam = async (
  request: TeamRequest,
  h: ResponseToolkit
) => {
  const { match_id, name } = request.payload;
  const match = await Match.findOneBy({ id: match_id });

  if (!match) throw Boom.notFound("Couldn't find match, won't create team.");
  const newTeam = Team.create({ match_id, name });

  await newTeam.save();
  return h.response(newTeam);
};

export const getAllTeams = async (request: TeamRequest, h: ResponseToolkit) => {
  const allTeams = await Team.find({
    relations: {
      match: true,
    },
  });

  return h.response(allTeams);
};

export const getTeamById = async (request: TeamRequest, h: ResponseToolkit) => {
  const teamId = request.params.id;
  const team = await Team.findOne({
    where: {
      id: parseInt(teamId),
    },
    relations: {
      match: true,
    },
  });

  if (team) return h.response(team);

  throw Boom.notFound("Team was not found.");
};

export const deleteTeamById = async (
  request: TeamRequest,
  h: ResponseToolkit
) => {
  const teamId = request.params.id;
  const team = await Team.findOne({
    where: {
      id: parseInt(teamId),
    },
  });

  if (team) {
    await Team.softRemove(team);
    return h.response({ message: "Team successfully deleted." });
  }

  throw Boom.notFound("Team was not found, cannot delete.");
};

export const getAllDeletedTeams = async (
  request: TeamRequest,
  h: ResponseToolkit
) => {
  const allDeletedTeams = await Team.find({
    where: {
      deleted_at: Not(IsNull()),
    },
    relations: {
      match: true,
    },
    withDeleted: true,
    select: {
      id: true,
      name: true,
      deleted_at: true,
    },
  });

  return h.response(allDeletedTeams);
};
