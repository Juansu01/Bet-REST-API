import dotenv from "dotenv";

import developmentServer from "./servers/developmentServer";
import defaultServer from "./servers/defaultServer";


process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

dotenv.config();
if (process.env.ENVIRONMENT === "development") {
  developmentServer();
} else {
  defaultServer();
}