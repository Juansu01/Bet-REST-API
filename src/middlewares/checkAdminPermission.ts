import { ResponseToolkit, ServerMethod, Request } from "hapi";
import { decode, JwtPayload } from "jsonwebtoken";
import Boom from "@hapi/boom";

import { User } from "../entities/User";

interface MyPayload extends JwtPayload {
  userEmail: string;
}

export const checkAdminPermissions: ServerMethod = async (
  request: Request,
  h: ResponseToolkit
) => {
  const accessToken = request.query.access_token as string;

  if (!accessToken) throw Boom.notFound("Please provide an access token.");

  const payload = decode(accessToken) as MyPayload;
  const userToCheck = await User.findOne({
    where: { email: payload.userEmail },
  });

  if (userToCheck?.role === "admin") return h.continue;

  return Boom.forbidden("You are not an admin.");
};
