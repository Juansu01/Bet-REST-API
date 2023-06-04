import { ResponseToolkit } from "hapi";

import { AuthenticationRequest } from "../types/authentication";
import { User } from "../entities/User";

export const basicAuthentication = async (
  request: AuthenticationRequest,
  username: string,
  password: string,
  h: ResponseToolkit
) => {
  const user = await User.findOneBy({ username: username });

  if (user) return { isValid: true, credentials: { username, password } };

  return { isValid: false };
};
