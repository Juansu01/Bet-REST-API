import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { homeRoutes } from "./homeRoute";
import { authenticationRoutes } from "./authenticationRoute";

const routes: ServerRoute<ReqRefDefaults>[] = [
  ...homeRoutes,
  ...authenticationRoutes,
];

export default routes;
