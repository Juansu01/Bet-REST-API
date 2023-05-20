import { Request, ResponseToolkit } from "hapi";

export const homeHandler = async (request: Request, h: ResponseToolkit) => {
  return h.response("Welcome to the GreenRun Backend Developer Test API!");
};
