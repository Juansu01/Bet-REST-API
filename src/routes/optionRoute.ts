import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Joi from "joi";

import { createNewOption, getAllOptions } from "../handlers/optionHandlers";

export const optionRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/option",
    handler: createNewOption,
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          number: Joi.number().min(1).required(),
          name: Joi.string().required(),
          odd: Joi.number().required(),
          did_win: Joi.boolean().optional(),
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
    },
  },
];
