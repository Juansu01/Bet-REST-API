import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

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
      email: true,
      role: true,
      password: true,
      state: true,
    },
  });

  if (!user) throw Boom.notFound("User was not found.");

  if (user.state === "blocked") throw Boom.unauthorized("User is blocked.");

  if (user.password !== password) return { isValid: false };

  return {
    isValid: true,
    credentials: { email: user.email, role: user.role },
  };
};
