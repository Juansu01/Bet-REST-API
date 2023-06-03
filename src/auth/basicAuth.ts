import { ResponseToolkit } from "hapi";

import { AuthenticationRequest } from "../types/authentication";
import { User } from "../entities/User";

export const basicAuthentication = (
  request: AuthenticationRequest,
  username: string,
  password: string,
  h: ResponseToolkit
) => {
  return { isValid: true, credentials: { username, password } };
};
