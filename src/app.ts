import Hapi from "@hapi/hapi";
import dotenv from "dotenv";

dotenv.config();
const init = async () => {
  const server = new Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
  });
  console.log(process.env.TEST);
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
