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
      pre: [{ method: checkAccessToken, assign: "checkAccessToken" }],
    },
  },
  {
    method: "GET",
    path: "/api/events",
    handler: getAllEvents,
    options: {
      pre: [
        { method: checkAccessToken, assign: "checkAccessToken" },
        { method: checkAdminPermissions, assign: "checkAdminPermissions" },
      ],
    },
  },
];
