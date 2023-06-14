import Lab from "@hapi/lab";
import { expect } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import { LogInResponsePayload } from "../src/types/test";
import myDataSource from "../src/services/dbConnection";
import { TestCredentials } from "../src/types/test";
import generateBasicAuthHeader from "./utils/generateAuthHeader";
import { PlacedBetPayload } from "../src/types/placedBet";

const { describe, it, before, after } = (exports.lab = Lab.script());
describe("Testing placed bet route.", () => {
  const userCredentials: TestCredentials = {
    username: "johndoe4@example.com",
    password: "password123",
    role: "user",
  };
  let userAccessToken: string;
  let server: TestServer;

  before(async () => {
    server = await testServer();
    await myDataSource.initialize();
    const userAuthToken = generateBasicAuthHeader(
      userCredentials.username,
      userCredentials.password
    );

    const userRes = await server.inject({
      method: "post",
      url: "/api/login",
      headers: {
        authorization: userAuthToken,
      },
    });

    const userLogInPayload: LogInResponsePayload = JSON.parse(userRes.payload);
    userAccessToken = userLogInPayload.access_token;
  });

  after(async () => {
    await server.stop();
    await myDataSource.destroy();
  });

  it("User cannot place a bet on a settled bet", async () => {
    // The bet with id 1 is settled.
    const payload: PlacedBetPayload = {
      bet_option: "Thunder Cats",
      amount: 49,
      bet_id: 1,
    };
    const res = await server.inject({
      method: "post",
      url: "/api/placed-bet",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
      payload: payload,
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(400);
    expect(json).to.contain(["error", "message", "statusCode"]);
    expect(json).to.contain({
      message: "Cannot place a bet on a settled bet.",
    });
  });
});