import { Request, ResponseToolkit, AuthCredentials } from "hapi";

interface UserCredentials extends AuthCredentials {
  username: string;
  password: string;
}

export const homeHandler = async (request: Request, h: ResponseToolkit) => {
  const credentials = request.auth.credentials as UserCredentials;
  console.log(credentials);
  return h.response("Welcome to the GreenRun Backend Developer Test API!");
};
