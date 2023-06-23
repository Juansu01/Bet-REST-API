import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Joi from "joi";

import {
  registerHandler,
  loginHandler,
  blockUser,
  logoutHandler,
} from "../handlers/authenticationHandlers";
import { checkAdminPermissions } from "../middlewares/checkAdminPermission";

export const authenticationRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/register",
    handler: registerHandler,
    options: {
      validate: {
        payload: Joi.object({
          first_name: Joi.string().required(),
          last_name: Joi.string().required(),
          phone: Joi.string().required(),
          email: Joi.string()
            .required()
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            .messages({
              "string.pattern.base": "Email must have a correct format.",
            }),
          password: Joi.string().min(8).required(),
          username: Joi.string().alphanum().required(),
          address: Joi.string().required(),
          gender: Joi.string().valid("male", "female", "other").required(),
          birth_date: Joi.date().iso().required(),
          country_id: Joi.number().integer().required(),
          city: Joi.string().required(),
          category: Joi.string().valid("general", "special").required(),
          document_id: Joi.string().required(),
          balance: Joi.number().required(),
        }),
      },
    },
  },
  {
    method: "POST",
    path: "/api/login",
    handler: loginHandler,
    options: {
      auth: "simple",
    },
  },
  {
    method: "DELETE",
    path: "/api/logout",
    handler: logoutHandler,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "PATCH",
    path: "/api/users/block-user/{id}",
    handler: blockUser,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "AdminPermissions" }],
    },
  },
];
