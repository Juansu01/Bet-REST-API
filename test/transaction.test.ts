import Lab from "@hapi/lab";
import { expect } from "@hapi/code";

import testServer from "../src/servers/testServer";
import { TestServer } from "../src/types/server";
import {
  LogInResponsePayload,
  UserBalanceResponsePayload,
} from "../src/types/test";
import myDataSource from "../src/services/dbConnection";
import { UserTestCredentials } from "../src/types/test";
import generateBasicAuthHeader from "./utils/generateAuthHeader";
import { TransactionPayload } from "../src/types/transaction";
import { TransactionCategory } from "../src/entities/Transaction";
import { Transaction } from "../src/entities/Transaction";
import redisClient from "../src/cache/redisClient";

const { describe, it, before, after } = (exports.lab = Lab.script());

describe("Testing transaction route.", () => {
  const userCredentials: UserTestCredentials = {
    username: "johndoe4@example.com",
    password: "password123",
    role: "user",
  };
  let userAccessToken: string;
  let server: TestServer;

  before(async () => {
    server = await testServer();
    await redisClient.connect();
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
    await redisClient.quit();
    await myDataSource.destroy();
  });
  it("User can get their own balance", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/user/balance",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json).to.contain(["username", "balance"]);
  });
  it("User can get their own transactions", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/my-transactions",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(Array.isArray(json)).to.equal(true);
    if (Array.isArray(json)) {
      if (json.length > 1) {
        const firstTransaction = (json as Transaction[])[0];
        const secondTransaction = (json as Transaction[])[1];
        expect(firstTransaction.user_id).to.equal(secondTransaction.user_id);
      }
    }
  });
  it("User can make a deposit transaction", { skip: true }, async () => {
    const payload: TransactionPayload = {
      category: TransactionCategory.DEPOSIT,
      amount: 5,
    };
    const res = await server.inject({
      method: "post",
      url: "/api/transaction-by-user",
      headers: {
        authorization: `Bearer ${userAccessToken}`,
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
  it(
    "User cannot withdraw an amount that is " +
      "greater than their current balance",
    async () => {
      const userBalanceRes = await server.inject({
        method: "get",
        url: "/api/user/balance",
        headers: {
          authorization: `Bearer ${userAccessToken}`,
        },
      });
      const userBalancePayload: UserBalanceResponsePayload = JSON.parse(
        userBalanceRes.payload
      );
      const invalidWithdrawAmount = userBalancePayload.balance + 50;
      const payload: TransactionPayload = {
        category: TransactionCategory.WITHDRAW,
        amount: invalidWithdrawAmount,
      };
      const res = await server.inject({
        method: "post",
        url: "/api/transaction-by-user",
        headers: {
          authorization: `Bearer ${userAccessToken}`,
        },
        payload: payload,
      });
      const json = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(400);
      expect(json).to.contain(["error", "message"]);
      expect(json).to.contain({
        message: "Cannot withdraw, balance is not enough.",
      });
    }
  );
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
  it("User cannot get a specific user transactions", async () => {
    const userId = 1;
    const res = await server.inject({
      method: "get",
      url: `/api/users/${userId}/transactions`,
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(401);
    expect(json).to.contain({ message: "You are not an admin." });
  });
  it("User cannot get a specific user balance", async () => {
    const userId = 1;
    const res = await server.inject({
      method: "get",
      url: `/api/users/${userId}/balance`,
      headers: {
        authorization: `Bearer ${userAccessToken}`,
      },
    });
    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(401);
    expect(json).to.contain({ message: "You are not an admin." });
  });
});
