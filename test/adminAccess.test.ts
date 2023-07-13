import Lab from "@hapi/lab";
import { expect, fail } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import myDataSource from "../src/services/dbConnection";
import { UserTestCredentials } from "../src/types/test";
import { TransactionPayload } from "../src/types/transaction";
import { TransactionCategory } from "../src/entities/Transaction";
import { Transaction } from "../src/entities/Transaction";
import { Bet } from "../src/entities/Bet";
import { Option } from "../src/entities/Option";
import logUserIn from "./utils/logUserIn";
import redisClient from "../src/cache/redisClient";

const { describe, it, before, after } = (exports.lab = Lab.script());

describe("Testing admin access to protected routes.", () => {
  const adminCredentials: UserTestCredentials = {
    username: "johndoe@example.com",
    password: "password123",
    role: "admin",
  };
  let adminAccessToken: string | null;
  let server: TestServer;
  let willFail: boolean = false;

  before(async () => {
    server = await testServer();
    await myDataSource.initialize();
    await redisClient.connect();
    adminAccessToken = await logUserIn(adminCredentials, server);
    if (!adminAccessToken) willFail = true;
    const table = server.table();
    console.log("LIST OF ALL ROUTES");
    table.forEach((route) =>
      console.log(`${route.method.toUpperCase()} ${route.path}`)
    );
  });

  after(async () => {
    await server.stop();
    await redisClient.quit();
    await myDataSource.destroy();
  });

  it("Admin can get all transactions", async () => {
    if (willFail) fail("Wrong user credentials, test automatically failed");
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
  it("Admin can get a specific user transactions", async () => {
    if (willFail) fail("Wrong user credentials, test automatically failed");
    const userId = 1;
    const res = await server.inject({
      method: "get",
      url: `/api/users/${userId}/transactions`,
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(Array.isArray(json)).to.equal(true);
    expect(json[0]).to.contain(["user_id", "category", "id"]);
    expect(json[0]).to.contain({ user_id: userId });
  });
  it("Admin can get specific user transactions and filter by category", async () => {
    if (willFail) fail("Wrong user credentials, test automatically failed");
    const category = TransactionCategory.DEPOSIT;
    const userId = 1;
    const res = await server.inject({
      method: "get",
      url: `/api/users/${userId}/transactions?category=${category}`,
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(Array.isArray(json)).to.equal(true);
    if (Array.isArray(json)) {
      const transactions = json as Transaction[];
      if (transactions.length > 0) {
        expect(transactions[0]).to.contain([
          "id",
          "category",
          "amount",
          "status",
        ]);
        expect(transactions[0].user_id).to.equal(userId);
      }
      if (transactions.length > 1) {
        expect(transactions[0].category).to.equal(category);
        expect(transactions[0].category).to.equal(transactions[1].category);
        expect(transactions[0].user_id).to.equal(transactions[1].user_id);
      }
    }
  });
  it("Admin can get a specific user balance", async () => {
    if (willFail) fail("Wrong user credentials, test automatically failed");
    const userId = 1;
    const res = await server.inject({
      method: "get",
      url: `/api/users/${userId}/balance`,
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json).to.include(["username", "balance"]);
  });
  it("Admin can create a new deposit transaction", async () => {
    if (willFail) fail("Wrong user credentials, test automatically failed");
    const payload: TransactionPayload = {
      category: TransactionCategory.DEPOSIT,
      amount: 5,
      user_id: 1,
      status: "active",
    };
    const res = await server.inject({
      method: "post",
      url: "/api/transaction",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      payload: payload,
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json).to.include(["user", "amount"]);
    expect(json).to.include({
      amount: payload.amount,
      category: payload.category,
      status: "accepted",
    });
  });
  it("Admin cannot block a user that is already blocked", async () => {
    if (willFail) fail("Wrong user credentials, test automatically failed");
    const blockedUserId = 22;
    const res = await server.inject({
      method: "patch",
      url: `/api/users/block-user/${blockedUserId}`,
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(400);
    expect(json).to.contain(["statusCode", "error", "message"]);
    expect(json).to.contain({
      statusCode: 400,
      error: "Bad Request",
      message: "User is already blocked.",
    });
  });
  it(
    "Admin cannot set a bet status that is the same " +
      "as the current bet status.",
    async () => {
      if (willFail) fail("Wrong user credentials, test automatically failed");
      const betId = 1;
      const betRes = await server.inject({
        method: "get",
        url: `/api/bets/${betId}`,
        headers: {
          authorization: `Bearer ${adminAccessToken}`,
        },
      });
      const betJson: Bet = JSON.parse(betRes.payload);
      const betStatus = betJson.status;
      const statusRes = await server.inject({
        method: "patch",
        url: `/api/bets/${betId}`,
        headers: {
          authorization: `Bearer ${adminAccessToken}`,
        },
        payload: {
          status: betStatus,
        },
      });
      const json = JSON.parse(statusRes.payload);
      expect(statusRes.statusCode).to.equal(400);
      expect(json).to.contain({
        message: `Bet status is ${betStatus} already.`,
      });
    }
  );
  it("Admin can get all placed bets", async () => {
    if (willFail) fail("Wrong user credentials, test automatically failed");
    const res = await server.inject({
      method: "get",
      url: "/api/placed-bets",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(Array.isArray(json)).to.equal(true);
  });
  it("Admin can get placed bet using id", async () => {
    if (willFail) fail("Wrong user credentials, test automatically failed");
    const placedBetId = 1;
    const res = await server.inject({
      method: "get",
      url: `/api/placed-bet/${placedBetId}`,
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json).to.contain(["user_id", "bet_id", "bet_option", "amount"]);
  });
  it("Admin can get all options", async () => {
    if (willFail) fail("Wrong user credentials, test automatically failed");
    const res = await server.inject({
      method: "get",
      url: "/api/options",
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
    });
    const json: Option[] = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json[0]).to.contain(["number", "name", "odd", "bets"]);
  });
  it("Admin cannot settle bet through change bet status route.", async () => {
    if (willFail) fail("Wrong user credentials, test automatically failed");
    const betId = 1;
    const statusToAdd = "settled";
    const statusRes = await server.inject({
      method: "patch",
      url: `/api/bets/${betId}`,
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
      },
      payload: {
        status: statusToAdd,
      },
    });
    expect(statusRes.statusCode).to.equal(400);
  });
});
