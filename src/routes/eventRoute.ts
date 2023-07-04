import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Joi from "joi";

import { checkAdminPermissions } from "../middlewares/checkAdminPermission";
import {
  createNewEvent,
  getAllEvents,
  getEventById,
  deleteEventById,
  getAllDeletedEvents,
} from "../handlers/eventHandlers";

export const eventRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/event",
    handler: createNewEvent,
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          sport: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/api/events",
    handler: getAllEvents,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "checkAdminPermissions" }],
    },
  },
  {
    method: "GET",
    path: "/api/deleted-events",
    handler: getAllDeletedEvents,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "checkAdminPermissions" }],
    },
  },
  {
    method: "GET",
    path: "/api/events/{id}",
    handler: getEventById,
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
    },
  },
  {
    method: "DELETE",
    path: "/api/events/{id}",
    handler: deleteEventById,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "checkAdminPermissions" }],
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
];
