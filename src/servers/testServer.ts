import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import basic from "@hapi/basic";
import Jwt from "@hapi/jwt";
import Joi from "joi";
import HapiRateLimitor from "hapi-rate-limitor";

import routes from "../routes";
import { basicAuthentication } from "../auth/basicAuth";
import { validateToken } from "../auth/validateToken";
import { options } from "../hapi-rate-limitor/options";

dotenv.config();
const testServer = async () => {
  const server = new Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  await server.register({
    plugin: HapiRateLimitor,
    options: options,
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
  console.log("You are running the testing server");
  console.log("Server running on %s", server.info.uri);
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

export default testServer;
