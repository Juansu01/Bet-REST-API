import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { homeRoutes } from "./homeRoute";

const routes: ServerRoute<ReqRefDefaults>[] = [...homeRoutes];

export default routes;
