"use strict";

const express = require("express");
const request = require("supertest");
const bodyParser = require("body-parser");

const db = {
  storedData: {
    store: jest.fn().mockResolvedValue({}),
    retrieve: jest.fn().mockResolvedValue({})
  }
};
const dto = { storedData: jest.fn() };
const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

describe("POST /api/v1/store ", () => {
  const router = express.Router();
  router.use(bodyParser.json());

  test("stores the data", async () => {
    require("../routes/storedData")({ router, db, dto, logger });

    const response = await request(router)
      .post("/api/v1/store")
      .send({ id: "1", encryption_key: "key", value: "value" });

    expect(response.status).toBe(200);
  });
});
