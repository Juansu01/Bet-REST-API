import { Request, ResponseToolkit } from "hapi";

export const homeHandler = async (request: Request, h: ResponseToolkit) => {
  return h.response("Hello from hapi!");
};

export const apiInitialHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  return h.response("Hello from api!");
};
