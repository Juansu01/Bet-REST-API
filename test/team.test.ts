import Lab from "@hapi/lab";
import { expect, fail } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import myDataSource from "../src/services/dbConnection";
import { TestCredentials } from "../src/types/test";
import logUserIn from "./utils/logUserIn";
import { Team } from "../src/entities/Team";
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

  it("User can get all teams.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const res = await server.inject({
      method: "get",
      url: "/api/teams",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json: Team[] = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(Array.isArray(json)).to.equal(true);
    expect(json[0]).to.contain(["match", "match_id", "name"]);
  });
  it("Admin can get all teams.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const res = await server.inject({
      method: "get",
      url: "/api/teams",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json: Team[] = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(Array.isArray(json)).to.equal(true);
    expect(json[0]).to.contain(["match", "match_id", "name"]);
  });
  it("User can get a specific team by id.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const teamId = 2;
    const res = await server.inject({
      method: "get",
      url: `/api/teams/${teamId}`,
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json: Team = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json).to.contain(["match", "match_id", "name"]);
  });
  it("Admin can get a specific team by id.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const teamId = 2;
    const res = await server.inject({
      method: "get",
      url: `/api/teams/${teamId}`,
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json: Team = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json).to.contain(["match", "match_id", "name"]);
  });
  it("Trying to get a team that doesn't exist returns 404 error.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const nonexistentTeamId = 900;
    const res = await server.inject({
      method: "get",
      url: `/api/teams/${nonexistentTeamId}`,
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json: Team = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(404);
    expect(json).to.contain(["error", "message", "statusCode"]);
    expect(json).to.contain({ message: "Team was not found." });
  });
  it("User cannot delete a team.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const teamId = 1;
    const res = await server.inject({
      method: "delete",
      url: `/api/teams/${teamId}`,
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(401);
    expect(json).to.contain(["error", "message", "statusCode"]);
    expect(json).to.contain({ message: "You are not an admin." });
  });
  it("Admin cannot delete a team that doesn't exist.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const nonexistentTeamId = 900;
    const res = await server.inject({
      method: "delete",
      url: `/api/teams/${nonexistentTeamId}`,
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(404);
    expect(json).to.contain(["error", "message", "statusCode"]);
    expect(json).to.contain({ message: "Team was not found, cannot delete." });
  });
  it("Admin can get all deleted teams.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const res = await server.inject({
      method: "get",
      url: "/api/deleted-teams",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json: Team[] = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    if (json.length > 0)
      expect(json[0]).to.contain(["deleted_at", "name", "match"]);
  });
  it("User cannot get all deleted teams.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const res = await server.inject({
      method: "get",
      url: "/api/deleted-teams",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(401);
    expect(json).to.contain(["error", "message", "statusCode"]);
    expect(json).to.contain({ message: "You are not an admin." });
  });
});
