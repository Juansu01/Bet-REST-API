import Lab from "@hapi/lab";
import { expect } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import { LogInResponsePayload } from "../src/types/test";
import myDataSource from "../src/services/dbConnection";
import { TestCredentials } from "../src/types/test";
import generateBasicAuthHeader from "./utils/generateAuthHeader";

const { describe, it, before, after } = (exports.lab = Lab.script());

describe("Testing admin access to protected routes.", () => {
  const adminCredentials: TestCredentials = {
    username: "johndoe@example.com",
    password: "password123",
    role: "admin",
  };
  const userCredentials: TestCredentials = {
    username: "johndoe4@example.com",
    password: "password123",
    role: "admin",
  };
  let adminAccessToken: string;
  let userAccessToken: string;
  let server: TestServer;

  before(async () => {
    server = await testServer();
    await myDataSource.initialize();

    const adminAuthToken = generateBasicAuthHeader(
      adminCredentials.username,
      adminCredentials.password
    );
    const userAuthToken = generateBasicAuthHeader(
      userCredentials.username,
      userCredentials.password
    );

    const adminRes = await server.inject({
      method: "post",
      url: "/api/login",
      headers: {
        authorization: adminAuthToken,
      },
    });
    const userRes = await server.inject({
      method: "post",
      url: "/api/login",
      headers: {
        authorization: userAuthToken,
      },
    });

    const adminLogInPayload: LogInResponsePayload = JSON.parse(
      adminRes.payload
    );
    adminAccessToken = adminLogInPayload.access_token;
    const userLogInPayload: LogInResponsePayload = JSON.parse(userRes.payload);
    userAccessToken = userLogInPayload.access_token;
  });

  after(async () => {
    await server.stop();
    await myDataSource.destroy();
  });

  it("Admin can get all transactions", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/transactions",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(Array.isArray(json)).to.equal(true);
    expect(res.statusCode).to.equal(200);
  });
  it("User cannot get all transactions", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/transactions",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(401);
    expect(json).to.contain({ message: "You are not an admin." });
  });
});
