import Lab from "@hapi/lab";
import { expect } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import myDataSource from "../src/services/dbConnection";
import { UserTestCredentials } from "../src/types/test";
import { PlacedBetPayload } from "../src/types/placedBet";
import { PlacedBet } from "../src/entities/PlacedBet";
import redisClient from "../src/cache/redisClient";
import logUserIn from "./utils/logUserIn";

const { describe, it, before, after } = (exports.lab = Lab.script());
describe("Testing placed bet route.", () => {
  const userCredentials: UserTestCredentials = {
    username: "johndoe4@example.com",
    password: "password123",
    role: "user",
  };
  let userAccessToken: string | null;
  let server: TestServer;

  before(async () => {
    server = await testServer();
    await myDataSource.initialize();
    await redisClient.connect();
    userAccessToken = await logUserIn(userCredentials, server);
  });

  after(async () => {
    await server.stop();
    await redisClient.quit();
    await myDataSource.destroy();
  });

  it("User cannot place a bet on a settled bet", async () => {
    // The bet with id 2 is settled.
    const payload: PlacedBetPayload = {
      bet_option: "Fierce Panthers",
      amount: 49,
      bet_id: 2,
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
  it("User can get their placed bets", async () => {
    // The bet with id 1 is settled.
    const res = await server.inject({
      method: "get",
      url: "/api/user/placed-bets",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json: PlacedBet[] = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(Array.isArray(json)).to.equal(true);
  });
  it("User cannot get placed bet using id", async () => {
    const placedBetId = 1;
    const res = await server.inject({
      method: "get",
      url: `/api/placed-bet/${placedBetId}`,
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(401);
    expect(json).to.contain({
      error: "Unauthorized",
      message: "You are not an admin.",
    });
  });
  it("User cannot get all placed bets", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/placed-bets",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(401);
    expect(json).to.contain({
      error: "Unauthorized",
      message: "You are not an admin.",
    });
  });
});
