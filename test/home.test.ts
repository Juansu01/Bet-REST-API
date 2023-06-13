import Lab from "@hapi/lab";
import { expect } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import { LogInResponsePayload } from "../src/types/test";
import myDataSource from "../src/services/dbConnection";
import generateBasicAuthHeader from "./utils/generateAuthHeader";

const { describe, it, before, after } = (exports.lab = Lab.script());

describe("Test for home route access.", () => {
  let server: TestServer;
  let accessToken: string;
  const username = "johndoe@example.com";
  const password = "password123";
  const authHeader = generateBasicAuthHeader(username, password);

  before(async () => {
    server = await testServer();
    await myDataSource.initialize();
    const res = await server.inject({
      method: "post",
      url: "/api/login",
      headers: {
        authorization: authHeader,
      },
    });
    const payloadToJSON: LogInResponsePayload = JSON.parse(res.payload);
    accessToken = payloadToJSON.access_token;
  });

  after(async () => {
    await server.stop();
    await myDataSource.destroy();
  });

  it("User can access home when providing a valid access token.", async () => {
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
