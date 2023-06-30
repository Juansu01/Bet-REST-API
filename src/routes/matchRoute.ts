import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Joi from "joi";

import {
  createNewMatch,
  getAllMatches,
  getMatchById,
} from "../handlers/matchHandler";

export const matchRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/match",
    handler: createNewMatch,
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          date: Joi.date().required(),
          event_id: Joi.number().integer().required().messages({
            "any.required": "Must include event id.",
            "number.base": "Event id must be an integer.",
          }),
          winner: Joi.string().optional(),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/api/matches",
    handler: getAllMatches,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/api/matches/{id}",
    handler: getMatchById,
    options: {
      auth: "jwt",
    },
  },
];
