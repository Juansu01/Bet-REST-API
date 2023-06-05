import { ResponseToolkit } from "hapi";
import Jwt, { HapiJwt } from "@hapi/jwt";
import dotenv from "dotenv";

import { AuthenticationRequest } from "src/types/authentication";

dotenv.config();
export const validateToken = async (
  artifacts: HapiJwt.Artifacts<HapiJwt.JwtRefs>,
  request: AuthenticationRequest,
  h: ResponseToolkit
) => {
  const secret = process.env.ACCESS_TOKEN_SECRET as string;
  console.log(artifacts.token);
  const options: HapiJwt.VerifyTokenOptions = {
    aud: "",
    iss: "",
    sub: "",
  };
  try {
    Jwt.token.verify(artifacts, secret);
    return { isValid: true };
  } catch (err) {
    console.error(err);
    return { isValid: false };
  }
};
