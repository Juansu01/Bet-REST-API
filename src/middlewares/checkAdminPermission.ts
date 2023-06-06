import { ResponseToolkit, ServerMethod, Request } from "hapi";
import Boom from "@hapi/boom";

import { UserCredentials } from "../types/authentication";

export const checkAdminPermissions: ServerMethod = async (
  request: Request,
  h: ResponseToolkit
) => {
  const userCredentials = request.auth.credentials as UserCredentials;
  if (userCredentials.role === "admin") return h.continue;

  throw Boom.unauthorized("You are not an admin.");
};
