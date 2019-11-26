const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const db = require("../db/access");
const dto = require("../db/dto");
const errorHandler = require("../utils/errorHandler");
const logger = require("../utils/logger");

router.use(bodyParser.json());

require("./storedData")({ router, db, dto, logger });
require("./swagger")({ router });

router.use("*", (req, res) => res.status(404).json({ message: "Not Found" }));

// This will be called when using next(error)
// Must be the last
router.use(errorHandler);

module.exports = router;
