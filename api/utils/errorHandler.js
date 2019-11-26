"use strict";

const logger = require("./logger");

module.exports = (err, req, res, next) => {
  logger.error({ message: err.message, name: err.name, stack: err.stack });

  if (process.env.NODE_ENV === "development") {
    return res.status(500).send(err.stack);
  } else {
    res.status(500).send("Internal Server Error");
  }
};
