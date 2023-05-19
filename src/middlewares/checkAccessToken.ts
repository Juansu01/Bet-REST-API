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

  verify(accessToken, secret, { complete: true }, (err, decoded) => {
    if (err) throw Boom.unauthorized(err.message);
  });

  return h.continue;
};
