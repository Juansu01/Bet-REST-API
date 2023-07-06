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
    username: "johndoe@example.com",
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

  it("User can access home when providing a valid access token.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const res = await server.inject({
      method: "get",
      url: "/",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    expect(res.statusCode).to.equal(200);
    expect(res.payload).to.equal(
      "Welcome to the GreenRun Backend Developer Test API!"
    );
  });
  it("User with wrong token cannot access home.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const res = await server.inject({
      method: "get",
      url: "/",
      headers: {
        authorization: `Bearer wrongtoken`,
      },
    });
    expect(res.statusCode).to.equal(401);
  });
});
