import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { homeRoutes } from "./homeRoute";
import { authenticationRoutes } from "./authenticationRoute";
import { eventRoutes } from "./eventRoute";
import { betRoutes } from "./betRoute";
import { matchRoutes } from "./matchRoute";
import { optionRoutes } from "./optionRoute";

const routes: ServerRoute<ReqRefDefaults>[] = [
  ...homeRoutes,
  ...authenticationRoutes,
  ...eventRoutes,
  ...betRoutes,
  ...matchRoutes,
  ...optionRoutes,
];

export default routes;
