import { decode, Secret, verify } from "jsonwebtoken";

import { MyPayload } from "../types/userEmailPayload";

export const getEmailFromAccessToken = (accessToken: string): string => {
  const secret: Secret = process.env.ACCESS_TOKEN_SECRET as Secret;
  const payload = verify(accessToken, secret, undefined) as MyPayload;
  return payload.userEmail;
};
