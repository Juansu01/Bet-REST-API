import { ResponseToolkit, ServerMethod } from "hapi";
import { verify, Secret } from "jsonwebtoken";
import Boom from "@hapi/boom";

import { AuthenticationRequest } from "src/types/authentication";

export const checkAccessToken: ServerMethod = async (
  request: AuthenticationRequest,
  h: ResponseToolkit
) => {
  const secret: Secret = process.env.ACCESS_TOKEN_SECRET as Secret;
  const accessToken = request.query.access_token as string;

  if (!accessToken) throw Boom.notFound("Please provide an access token.");

  verify(accessToken, secret, { complete: true }, (err, decoded) => {
    if (err?.message === "jwt expired")
      throw Boom.unauthorized("Access token expired.");
    if (err?.message === "invalid signature")
      throw Boom.unauthorized("Invalid access token.");
  });

  return h.continue;
};
