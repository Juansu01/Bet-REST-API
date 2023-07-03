import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Joi from "joi";

import {
  createNewTeam,
  getAllTeams,
  getTeamById,
} from "../handlers/teamHandlers";

export const teamRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/team",
    handler: createNewTeam,
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          match_id: Joi.number().min(1).required(),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/api/teams",
    handler: getAllTeams,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/api/teams/{id}",
    handler: getTeamById,
    options: {
      auth: "jwt",
      validate: {
        params: Joi.object({
          id: Joi.number().integer().positive().required(),
        }),
      },
    },
  },
];
