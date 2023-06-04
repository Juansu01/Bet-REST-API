import { ResponseToolkit } from "hapi";
import { AuthArtifacts } from "@hapi/hapi";
import { verify } from "jsonwebtoken";

import { AuthenticationRequest } from "src/types/authentication";

export const validateToken = async (
  artifacts: AuthArtifacts,
  request: AuthenticationRequest,
  h: ResponseToolkit
) => {
  console.log(artifacts.token);
  try {
    verify(artifacts.token as string, "my_secret");
    return { isValid: true };
  } catch (err) {
    console.error(err);
    return { isValid: false };
  }
};
