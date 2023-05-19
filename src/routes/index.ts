import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { homeRoutes } from "./homeRoute";
import { authenticationRoutes } from "./authenticationRoute";
import { eventRoutes } from "./eventRoute";
import { betRoutes } from "./betRoute";

const routes: ServerRoute<ReqRefDefaults>[] = [
  ...homeRoutes,
  ...authenticationRoutes,
  ...eventRoutes,
  ...betRoutes,
];

export default routes;
