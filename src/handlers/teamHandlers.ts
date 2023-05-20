import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { TeamRequest } from "../types/team";
import { Team } from "../entities/Team";
import myDataSource from "../services/dbConnection";

export const createNewTeam = async (
  request: TeamRequest,
  h: ResponseToolkit
) => {
  const { match_id, name } = request.payload;
  const newTeam = Team.create({ match_id, name });

  await newTeam.save();
  return h.response(newTeam).header("Content-Type", "application/json");
};

export const getAllTeams = async (request: TeamRequest, h: ResponseToolkit) => {
  try {
    const teams = await myDataSource.getRepository(Team).find({
      relations: {
        match: true,
      },
    });

    return h.response(teams).header("Content-Type", "application/json");
  } catch (err) {
    throw Boom.badImplementation(err.message);
  }
};
