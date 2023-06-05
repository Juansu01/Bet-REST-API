import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import {
  registerHandler,
  loginHandler,
  blockUser,
} from "../handlers/authenticationHandlers";
import { checkAccessToken } from "../middlewares/checkAccessToken";
import { checkAdminPermissions } from "../middlewares/checkAdminPermission";

export const authenticationRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/register",
    handler: registerHandler,
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
    method: "PATCH",
    path: "/api/users/block-user/{id}",
    handler: blockUser,
    options: {
      pre: [
        { method: checkAccessToken, assign: "checkAccessToken" },
        { method: checkAdminPermissions, assign: "AdminPermissions" },
      ],
    },
  },
];
