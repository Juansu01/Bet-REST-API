import Lab from "@hapi/lab";
import { expect, fail } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import myDataSource from "../src/services/dbConnection";
import redisClient from "../src/cache/redisClient";
import logUserIn from "./utils/logUserIn";
import { UserTestCredentials } from "../src/types/test";

const { describe, it, before, after } = (exports.lab = Lab.script());

describe("Test for home route access.", () => {
  let server: TestServer;
  let accessToken: string | null;
  let willSkip: boolean = false;
  const userCredentials: UserTestCredentials = {
    username: "johndoe10@example.com",
    password: "password123",
  };

  before(async () => {
    await redisClient.connect();
    server = await testServer();
    await myDataSource.initialize();
    accessToken = await logUserIn(userCredentials, server);
    if (!accessToken) willSkip = true;
  });

  after(async () => {
    await server.stop();
    await redisClient.quit();
    await myDataSource.destroy();
  });

  it("User cannot acces home route more than 5 times in one minute.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    for (let i = 0; i < 5; i++) {
      const res = await server.inject({
        method: "get",
        url: "/",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
    }
    const rejectedRes = await server.inject({
      method: "get",
      url: "/",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    expect(rejectedRes.statusCode).to.equal(429);
    const json = JSON.parse(rejectedRes.payload);
    expect(json).to.contain({
      statusCode: 429,
      error: "Too Many Requests",
      message: "You have exceeded the request limit",
    });
  });
});
