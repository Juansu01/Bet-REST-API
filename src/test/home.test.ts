import Lab from "@hapi/lab";
import { expect } from "@hapi/code";

import testServer from "../servers/testServer";
import { TestServer } from "../types/server";

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());

describe("GET /", () => {
  let server: TestServer;

  beforeEach(async () => {
    server = await testServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  it("responds with 200", async () => {
    const res = await server.inject({
      method: "get",
      url: "/",
    });
    expect(res.statusCode).to.equal(200);
  });
});
