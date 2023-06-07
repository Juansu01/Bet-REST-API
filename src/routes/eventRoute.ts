import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { checkAccessToken } from "../middlewares/checkAccessToken";
import { checkAdminPermissions } from "../middlewares/checkAdminPermission";
import { createNewEvent, getAllEvents } from "../handlers/eventHandlers";

export const eventRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/event",
    handler: createNewEvent,
    options: {
      auth: "jwt",
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
];
