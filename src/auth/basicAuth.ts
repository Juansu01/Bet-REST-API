import { ResponseToolkit } from "hapi";

import { AuthenticationRequest } from "../types/authentication";
import { User } from "../entities/User";

export const basicAuthentication = async (
  request: AuthenticationRequest,
  username: string,
  password: string,
  h: ResponseToolkit
) => {
  const user = await User.findOneBy({ email: username });

  if (user)
    return {
      isValid: true,
      credentials: { userEmail: user.email, userRole: user.role },
    };

  return { isValid: false };
};
