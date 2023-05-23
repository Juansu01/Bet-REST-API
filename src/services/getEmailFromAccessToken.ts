import { Secret, verify } from "jsonwebtoken";
import Boom from "@hapi/boom";

import { MyPayload } from "../types/userEmailPayload";

export const getEmailFromAccessToken = (accessToken: string): string => {
  const secret: Secret = process.env.ACCESS_TOKEN_SECRET as Secret;
  const payload = verify(accessToken, secret, undefined) as MyPayload;

  if (payload) return payload.userEmail;

  throw Boom.badImplementation(
    "Access token expired while processing request."
  );
};
