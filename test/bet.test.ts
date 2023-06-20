import Lab from "@hapi/lab";
import { expect, fail } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import myDataSource from "../src/services/dbConnection";
import { TestCredentials } from "../src/types/test";
import logUserIn from "./utils/logUserIn";
import { Bet } from "../src/entities/Bet";

const lab = Lab.script();
const { describe, it, before, after } = lab;
export { lab };

describe("Testing bet route.", () => {
  const userCredentials: TestCredentials = {
    username: "johndoe4@example.com",
    password: "password123",
    role: "user",
  };
  let userAccessToken: string | null;
  let server: TestServer;
  let willSkip = false;

  before(async () => {
    server = await testServer();
    await myDataSource.initialize();
    userAccessToken = await logUserIn(userCredentials, server);
    if (userAccessToken === null) willSkip = true;
  });

  after(async () => {
    await server.stop();
    await myDataSource.destroy();
  });

  it("User can get all bets.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const res = await server.inject({
      method: "get",
      url: "/api/bets",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json: Bet[] = JSON.parse(res.payload);
    expect(Array.isArray(json)).to.equal(true);
    expect(json[0]).to.contain(["id", "options", "status", "result"]);
  });
  it("User can get bet by id.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const betId = 1;
    const res = await server.inject({
      method: "get",
      url: `/api/bets/${betId}`,
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json: Bet = JSON.parse(res.payload);
    expect(json).to.contain(["id", "options", "status", "result"]);
  });
  it("User cannot change bet status.", async () => {
    const betId = 1;
    const statusRes = await server.inject({
      method: "patch",
      url: `/api/bets/${betId}`,
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
      payload: {
        status: "cancelled",
      },
    });
    const json = JSON.parse(statusRes.payload);
    expect(statusRes.statusCode).to.equal(401);
    expect(json).to.contain({
      message: "You are not an admin.",
    });
  });
});