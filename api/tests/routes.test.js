"use strict";

const express = require("express");
const app = express();
const request = require("supertest");
const bodyParser = require("body-parser");

const db = {
  storedData: {
    store: jest.fn().mockResolvedValue({}),
    retrieve: jest.fn().mockResolvedValue([])
  }
};
const dto = { storedData: jest.fn() };
const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

const router = express.Router();
router.use(bodyParser.json());
app.use(router);
require("../routes/storedData")({ router, db, dto, logger });

describe("POST /api/v1/store ", () => {
  test("stores the data", async () => {
    const requestBody = { id: "id", encryption_key: "key", value: "value" };
    const expectedResult = { id: "id", value: "value" };
    dto.storedData.mockReturnValue(expectedResult);

    const response = await request(app)
      .post("/api/v1/store")
      .send(requestBody);

    expect(db.storedData.store).toHaveBeenCalledWith(requestBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResult);
  });

  test("sends an error code when invalid payload is provided", async () => {
    const requestBody = { id: "id", encryption_key: null, value: "value" };
    const err = { message: "INVALID_INPUT_ERROR" };
    db.storedData.store.mockRejectedValueOnce(err);

    const response = await request(app)
      .post("/api/v1/store")
      .send(requestBody);

    expect(response.status).toBe(400);
    expect(logger.error).toHaveBeenCalled();
  });
});

describe("POST /api/v1/retrieve", () => {
  test("retrieves data", async () => {
    const requestBody = { id: "id", decryption_key: "key" };
    const dbResults = [{ id: "id", value: "value" }];
    const expectedResponse = dbResults;
    db.storedData.retrieve.mockResolvedValue(dbResults);
    dto.storedData.mockReturnValue(dbResults[0]);

    const response = await request(app)
      .post("/api/v1/retrieve")
      .send(requestBody);

    expect(db.storedData.retrieve).toHaveBeenCalledWith(requestBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  test("sends an error code when invalid payload provided", async () => {
    const requestBody = { id: "id" };
    const err = { message: "INVALID_INPUT_ERROR" };
    db.storedData.retrieve.mockRejectedValueOnce(err);

    const response = await request(app)
      .post("/api/v1/retrieve")
      .send(requestBody);

    expect(response.status).toBe(400);
    expect(logger.error).toHaveBeenCalled();
  });
});
