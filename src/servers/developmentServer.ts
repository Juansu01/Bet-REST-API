import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import basic from "@hapi/basic";
import Jwt from "@hapi/jwt";
import Joi from "joi";
import HapiRateLimitor from "hapi-rate-limitor";

import routes from "../routes";
import myDataSource from "../services/dbConnection";
import { basicAuthentication } from "../auth/basicAuth";
import { validateToken } from "../auth/validateToken";
import redisClient from "../cache/redisClient";

dotenv.config();
const developmentServer = async () => {
  const server = new Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      validate: {
        failAction(request, h, err) {
          throw err;
        },
      },
    },
  });

  myDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err);
    });

  await redisClient.connect();

  await server.register({
    plugin: HapiRateLimitor,
    options: {
      enabled: true,
      namespace: "hapi-rate-limitor",
      max: 60, // a maximum of 60 requests
      duration: 60 * 1000, // per minute (the value is in milliseconds)
    },
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
  console.log("You are running the development server");
  console.log("Server running on %s", server.info.uri);
};

export default developmentServer;
