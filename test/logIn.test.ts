import Lab from "@hapi/lab";
import { expect } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import { TestCredentials, LogInResponsePayload } from "../src/types/test";
import myDataSource from "../src/services/dbConnection";

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());
describe("Test for log in route.", () => {
  beforeEach(async () => {
    server = await testServer();
  });

  afterEach(async () => {
    await server.stop();
    await myDataSource.destroy();
  });
  let server: TestServer;
  const validUserCredentials: TestCredentials = {
    username: "johndoe@example.com",
    password: "password123",
  };
  const invalidUserCredentials: TestCredentials = {
    username: "johndoeexample(/com",
    password: "notagoodpassword",
  };

  it("Valid user gets accessToken after logging in", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/login",
      auth: {
        strategy: "simple",
        credentials: validUserCredentials,
      },
    });
    expect(res.statusCode).to.equal(200);
    const payloadToJSON: LogInResponsePayload = JSON.parse(res.payload);
    expect(payloadToJSON).to.contain({
      message: "Logged in successfully!",
    });
  });
  it("Invalid credentials don't provide access", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/login",
      auth: {
        strategy: "simple",
        credentials: invalidUserCredentials,
      },
    });
    expect(res.statusCode).to.equal(401);
  });
});
