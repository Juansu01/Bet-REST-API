import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Joi from "joi";

import {
  createNewPlacedBet,
  getAllPlacedBets,
  getPlacedBetById,
  getPlacedBetsByUser,
} from "../handlers/placedBetHandlers";
import { checkAdminPermissions } from "../middlewares/checkAdminPermission";

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
          amount: Joi.number().min(1).max(50).required(),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/api/placed-bets",
    handler: getAllPlacedBets,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "AdminPermissions" }],
    },
  },
  {
    method: "GET",
    path: "/api/placed-bet/{id}",
    handler: getPlacedBetById,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "AdminPermissions" }],
      validate: {
        params: Joi.object({
          id: Joi.number()
            .positive()
            .messages({
              "number.positive": "Id must be positive.",
            })
            .required(),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/api/user/placed-bets",
    handler: getPlacedBetsByUser,
    options: {
      auth: "jwt",
    },
  },
];
