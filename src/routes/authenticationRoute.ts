import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import {
  registerHandler,
  loginHandler,
  blockUser,
} from "../handlers/authenticationHandlers";
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
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "AdminPermissions" }],
    },
  },
];
