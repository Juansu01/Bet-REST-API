import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { checkAccessToken } from "../middlewares/checkAccessToken";
import { createNewOption, getAllOptions } from "../handlers/optionHandlers";

export const optionRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/option",
    handler: createNewOption,
    options: {
      auth: "jwt",
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
