import Lab from "@hapi/lab";
import { expect, fail } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import myDataSource from "../src/services/dbConnection";
import { TestCredentials } from "../src/types/test";
import logUserIn from "./utils/logUserIn";
import redisClient from "../src/cache/redisClient";
import { Option } from "../src/entities/Option";

const lab = Lab.script();
const { describe, it, before, after } = lab;
export { lab };

describe("Testing option route.", () => {
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
    if (userAccessToken === null) willSkip = true;
  });

  after(async () => {
    await server.stop();
    await redisClient.quit();
    await myDataSource.destroy();
  });

  it("User cannot get all options.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const res = await server.inject({
      method: "get",
      url: "/api/options",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(401);
    expect(json).to.contain({
      statusCode: 401,
      error: "Unauthorized",
      message: "You are not an admin.",
    });
  });
  it("User can get all options from specific bet.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const betId = 1;
    const res = await server.inject({
      method: "get",
      url: `/api/bet/${betId}/options`,
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json: Option[] = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(Array.isArray(json)).to.equal(true);
    expect(json[0]).to.contain(["id", "number", "name", "did_win"]);
    expect(Array.isArray(json[0].bets)).to.equal(true);
  });
  it("Admin can get all options from specific bet.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const betId = 1;
    const res = await server.inject({
      method: "get",
      url: `/api/bet/${betId}/options`,
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json: Option[] = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(Array.isArray(json)).to.equal(true);
    expect(json[0]).to.contain(["id", "number", "name", "did_win"]);
    expect(Array.isArray(json[0].bets)).to.equal(true);
  });
  it("Admin can get specific option by id.", async () => {
    if (willSkip) fail("Wrong user credentials, test automatically failed.");
    const optionId = 5;
    const res = await server.inject({
      method: "get",
      url: `/api/options/${optionId}`,
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json: Option = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json).to.contain(["id", "number", "name", "did_win"]);
    expect(Array.isArray(json.bets)).to.equal(true);
  });
});
