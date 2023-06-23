import { ResponseToolkit } from "hapi";
import Jwt, { HapiJwt } from "@hapi/jwt";
import dotenv from "dotenv";

import { AuthenticationRequest } from "src/types/authentication";
import { DecodedToken } from "../types/authentication";
import isTokenRevoked from "../cache/checkTokenStatus";

dotenv.config();
export const validateToken = async (
  artifacts: HapiJwt.Artifacts<HapiJwt.JwtRefs>,
  request: AuthenticationRequest,
  h: ResponseToolkit
) => {
  const secret = process.env.ACCESS_TOKEN_SECRET as string;
  const isAccessTokenRevoked = await isTokenRevoked(artifacts.token);

  if (isAccessTokenRevoked) return { isValid: false };

  try {
    Jwt.token.verify(artifacts, secret);
    const decoded = artifacts.decoded as DecodedToken;
    return {
      isValid: true,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    console.error(err);
    return { isValid: false };
  }
};
