import Lab from "@hapi/lab";
import { expect } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import { UserTestCredentials } from "../src/types/test";
import myDataSource from "../src/services/dbConnection";
import logUserIn from "./utils/logUserIn";
import redisClient from "../src/cache/redisClient";

const { after, before, describe, it } = (exports.lab = Lab.script());

describe("Test for log out route.", () => {
  let server: TestServer;
  const validUser: UserTestCredentials = {
    username: "johndoe4@example.com",
    password: "password123",
  };
  before(async () => {
    server = await testServer();
    await redisClient.connect();
    await myDataSource.initialize();
  });

  after(async () => {
    await server.stop();
    await redisClient.quit();
    await myDataSource.destroy();
  });

  it("Access token gets revoked after logging out", async () => {
    const accessToken = await logUserIn(validUser, server);
    const homeRes = await server.inject({
      method: "get",
      url: "/",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    expect(homeRes.statusCode).to.equal(200);
    const logOutRes = await server.inject({
      method: "delete",
      url: "/api/logout",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    expect(logOutRes.statusCode).to.equal(200);
    const secondHomeRes = await server.inject({
      method: "get",
      url: "/",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    expect(secondHomeRes.statusCode).to.equal(401);
  });
});
