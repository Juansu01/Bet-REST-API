import Hapi from "@hapi/hapi";
import dotenv from "dotenv";

import routes from "./routes";
import myDataSource from "./services/dbConnection";

dotenv.config();
const init = async () => {
  const server = new Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  myDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err);
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
