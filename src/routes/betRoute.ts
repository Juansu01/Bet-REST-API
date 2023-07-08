import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Joi from "joi";

import {
  createNewBet,
  getAllBets,
  getBetById,
  changeBetStatus,
  settleBet,
  deleteBetById,
} from "../handlers/betHandlers";
import { checkAdminPermissions } from "../middlewares/checkAdminPermission";

export const betRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/bet",
    handler: createNewBet,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "AdminPermissions" }],
      validate: {
        payload: Joi.object({
          match_id: Joi.number().integer().required().min(1),
          result: Joi.string().allow(null).optional(),
        }),
      },
      plugins: {
        "hapi-rate-limitor": {
          enabled: false,
        },
      },
    },
  },
  {
    method: "GET",
    path: "/api/bets",
    handler: getAllBets,
    options: {
      auth: "jwt",
      plugins: {
        "hapi-rate-limitor": {
          enabled: false,
        },
      },
    },
  },
  {
    method: "GET",
    path: "/api/bets/{id}",
    handler: getBetById,
    options: {
      auth: "jwt",
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
      plugins: {
        "hapi-rate-limitor": {
          enabled: false,
        },
      },
    },
  },
  {
    method: "PATCH",
    path: "/api/bets/{id}",
    handler: changeBetStatus,
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
        payload: {
          status: Joi.string()
            .required()
            .allow("active", "cancelled")
            .invalid("settled"),
        },
      },
      plugins: {
        "hapi-rate-limitor": {
          enabled: false,
        },
      },
    },
  },
  {
    method: "PATCH",
    path: "/api/settle-bet/{id}",
    handler: settleBet,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "AdminPermissions" }],
      validate: {
        payload: Joi.object({
          winning_option: Joi.string().required(),
        }),
        params: Joi.object({
          id: Joi.number()
            .positive()
            .messages({
              "number.positive": "Id must be positive.",
            })
            .required(),
        }),
      },
      plugins: {
        "hapi-rate-limitor": {
          enabled: false,
        },
      },
    },
  },
  {
    method: "DELETE",
    path: "/api/bets/{id}",
    handler: deleteBetById,
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
      plugins: {
        "hapi-rate-limitor": {
          enabled: false,
        },
      },
    },
  },
];
