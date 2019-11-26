"use strict";

module.exports = ({ router, db, dto, logger }) => {
  router.post("/api/v1/store", async (req, res) => {
    try {
      const result = await db.storedData.store({
        id: req.body.id,
        encryption_key: req.body.encryption_key,
        value: req.body.value
      });

      logger.info({ message: "Stored or updated item", id: req.body.id });

      return res.json(dto.storedData(result));
    } catch (err) {
      logger.error({ name: err.name, message: err.message, stack: err.stack });

      if (
        err.name === "SequelizeValidationError" ||
        err.message === "INVALID_INPUT_ERROR"
      ) {
        return res.sendStatus(400);
      } else {
        return res.sendStatus(500);
      }
    }
  });

  router.post("/api/v1/retrieve", async (req, res) => {
    try {
      const results = await db.storedData.retrieve({
        id: req.body.id,
        decryption_key: req.body.decryption_key
      });

      if (results.length) {
        logger.info({ message: "Retrieved items", id: req.body.id });
      } else if (!results.length) {
        logger.warn({
          message:
            "Attempt to retrieve items with incorrect id or decryption_key",
          id: req.body.id
        });
      }

      return res.json(results.map(result => dto.storedData(result)));
    } catch (err) {
      logger.error({ name: err.name, message: err.message, stack: err.stack });

      if (
        err.name === "SequelizeValidationError" ||
        err.message === "INVALID_INPUT_ERROR"
      ) {
        return res.sendStatus(400);
      } else {
        return res.sendStatus(500);
      }
    }
  });
};
