import { ResponseToolkit } from "hapi";

import { AuthenticationRequest } from "../types/authentication";
import { User } from "../entities/User";

export const basicAuthentication = async (
  request: AuthenticationRequest,
  username: string,
  password: string,
  h: ResponseToolkit
) => {
  const user = await User.findOne({
    where: {
      email: username,
    },
    select: {
      password: true,
    },
  });
  if (user && user.password === password) {
    return {
      isValid: true,
      credentials: { userEmail: user.email, userRole: user.role },
    };
  }

  return { isValid: false };
};
