import Lab from "@hapi/lab";
import { expect } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import { UserTestCredentials, LogInResponsePayload } from "../src/types/test";
import myDataSource from "../src/services/dbConnection";
import generateBasicAuthHeader from "./utils/generateAuthHeader";
import logUserIn from "./utils/logUserIn";
import redisClient from "../src/cache/redisClient";

const { after, before, describe, it } = (exports.lab = Lab.script());

describe("Test for log in route.", () => {
  let server: TestServer;
  const validUser: UserTestCredentials = {
    username: "johndoe4@example.com",
    password: "password123",
  };
  const invalidUser: UserTestCredentials = {
    username: "johndoeexample(/com",
    password: "notagoodpassword",
  };
  const blockedUser: UserTestCredentials = {
    username: "blockeduser1@example.com",
    password: "imblocked123",
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

  it("Valid user gets accessToken after logging in", async () => {
    const authHeader = generateBasicAuthHeader(
      validUser.username,
      validUser.password
    );
    const res = await server.inject({
      method: "post",
      url: "/api/login",
      headers: {
        authorization: authHeader,
      },
    });
    expect(res.statusCode).to.equal(200);
    const payloadToJSON: LogInResponsePayload = JSON.parse(res.payload);
    expect(payloadToJSON).to.contain({
      message: "Logged in successfully!",
    });
  });
  it("Invalid credentials don't provide access", async () => {
    const authHeader = generateBasicAuthHeader(
      invalidUser.username,
      invalidUser.password
    );
    const res = await server.inject({
      method: "post",
      url: "/api/login",
      headers: {
        authorization: authHeader,
      },
    });
    expect(res.statusCode).to.equal(404);
  });
  it("Blocked user doesn't get access", async () => {
    const authHeader = generateBasicAuthHeader(
      blockedUser.username,
      blockedUser.password
    );
    const res = await server.inject({
      method: "post",
      url: "/api/login",
      headers: {
        authorization: authHeader,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(401);
    expect(json).to.contain({
      statusCode: 401,
      error: "Unauthorized",
      message: "User is blocked.",
    });
    expect(json).to.not.contain({ message: "Logged in successfully!" });
    expect(json).to.not.contain("access_token");
  });
  it("User cannot block other users", async () => {
    const userId = 21;
    const userAccessToken = await logUserIn(validUser, server);
    const res = await server.inject({
      method: "patch",
      url: `/api/users/block-user/${userId}`,
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(401);
    expect(json).to.contain({ message: "You are not an admin." });
  });
});
