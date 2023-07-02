import Lab from "@hapi/lab";
import { expect, fail } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import myDataSource from "../src/services/dbConnection";
import { TestCredentials } from "../src/types/test";
import logUserIn from "./utils/logUserIn";
import { Match } from "../src/entities/Match";
import redisClient from "../src/cache/redisClient";

const lab = Lab.script();
const { describe, it, before, after } = lab;
export { lab };

describe("Testing match route.", () => {
  const userCredentials: TestCredentials = {
    username: "johndoe4@example.com",
    password: "password123",
    role: "user",
  };
  const adminCredentials: TestCredentials = {
    username: "johndoe@example.com",
    password: "password123",
    role: "admin",
  };
  let adminAccessToken: string | null;
  let userAccessToken: string | null;
  let server: TestServer;
  let willSkip = false;

  before(async () => {
    server = await testServer();
    await myDataSource.initialize();
    await redisClient.connect();
    userAccessToken = await logUserIn(userCredentials, server);
    adminAccessToken = await logUserIn(adminCredentials, server);
    if (!userAccessToken || !adminAccessToken) willSkip = true;
  });

  after(async () => {
    await server.stop();
    await redisClient.quit();
    await myDataSource.destroy();
  });

  it("User can get all matches.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const res = await server.inject({
      method: "get",
      url: "/api/matches",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json: Match[] = JSON.parse(res.payload);
    expect(Array.isArray(json)).to.equal(true);
    expect(json[0]).to.contain([
      "id",
      "date",
      "winner",
      "event_id",
      "event",
      "bets",
    ]);
  });
  it("User can get a match by id.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const matchId = 2;
    const res = await server.inject({
      method: "get",
      url: `/api/matches/${matchId}`,
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json: Match = JSON.parse(res.payload);
    expect(json).to.contain([
      "id",
      "date",
      "winner",
      "event_id",
      "event",
      "bets",
    ]);
  });
  it("User cannot get a match that doesnt exist.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const nonexistentMatchId = 500;
    const res = await server.inject({
      method: "get",
      url: `/api/matches/${nonexistentMatchId}`,
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(404);
    expect(json).to.contain({ message: "Match was not found." });
  });
  it("Admin can get all deleted matches.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const res = await server.inject({
      method: "get",
      url: "/api/deleted-matches",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json: Match[] = JSON.parse(res.payload);
    expect(Array.isArray(json)).to.equal(true);
    if (json.length > 0) expect(json[0]).to.contain(["id", "deleted_at"]);
  });
  it("User cannot get all deleted matches.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const res = await server.inject({
      method: "get",
      url: "/api/deleted-matches",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(401);
    expect(json).to.contain(["message", "statusCode", "error"]);
    expect(json).to.contain({ message: "You are not an admin." });
  });
});
