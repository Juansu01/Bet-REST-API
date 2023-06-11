import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Joi from "joi";

import {
  createNewPlacedBet,
  getAllPlacedBets,
} from "../handlers/placedBetHandlers";

export const placedBetRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/placed-bet",
    handler: createNewPlacedBet,
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          bet_option: Joi.string().required(),
          bet_id: Joi.number().integer().min(1).required(),
          amount: Joi.number().min(1).max(50).required()
        })
      }
    },
  },
  {
    method: "GET",
    path: "/api/placed-bets",
    handler: getAllPlacedBets,
    options: {
      auth: "jwt",
    },
  },
];
