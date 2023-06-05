import { Request, ResponseToolkit } from "hapi";

import { UserCredentials } from "../types/authentication";

export const homeHandler = async (request: Request, h: ResponseToolkit) => {
  const credentials = request.auth.credentials as UserCredentials;
  console.log(credentials.role, credentials.email);
  return h.response("Welcome to the GreenRun Backend Developer Test API!");
};
