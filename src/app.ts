import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import basic from "@hapi/basic";
import Jwt from "@hapi/jwt";
import Joi from "joi";
import Boom from "@hapi/boom"

import routes from "./routes";
import myDataSource from "./services/dbConnection";
import { basicAuthentication } from "./auth/basicAuth";
import { validateToken } from "./auth/validateToken";
import { DefaultError } from "./types/error";

dotenv.config();
const init = async () => {
  const server = new Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      validate: {
        failAction(request, h, err) {
          if (process.env.ENVIRONMENT === "develop") {
            // Only send back the full error details when in the
            // development environment, this prevents echo attacks.
            throw err
          }
          // If the environment is any different than the development
          // environment, the client will get a generic error.
          const defaultError = err as DefaultError
          throw Boom.badRequest(defaultError.data.defaultError)
        }
      }
    }
  });

  myDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err);
    });

  server.validator(Joi);
  await server.register(basic);
  server.auth.strategy("simple", "basic", { validate: basicAuthentication });
  await server.register(Jwt);
  server.auth.strategy("jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_SECRET as string,
    verify: {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      sub: "user-session",
    },
    validate: validateToken,
  });
  server.route(routes);
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
