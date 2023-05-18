import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import {
  registerHandler,
  loginHandler,
} from "../handlers/authenticationHandlers";

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
  },
];
