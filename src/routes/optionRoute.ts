import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Joi from "joi";

import {
  createNewOption,
  getAllOptions,
  getOptionsFromBet,
} from "../handlers/optionHandlers";
import { checkAdminPermissions } from "../middlewares/checkAdminPermission";

export const optionRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/option",
    handler: createNewOption,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "AdminPermissions" }],
      validate: {
        payload: Joi.object({
          number: Joi.number().min(1).required(),
          name: Joi.string().required(),
          odd: Joi.number().required(),
          did_win: Joi.boolean().optional().allow(null),
          bet_id: Joi.number().min(1).required(),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/api/options",
    handler: getAllOptions,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "AdminPermissions" }],
    },
  },
  {
    method: "GET",
    path: "/api/bet/{id}/options",
    handler: getOptionsFromBet,
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
