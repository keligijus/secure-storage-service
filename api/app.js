const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const lusca = require("lusca");
const rateLimit = require("express-rate-limit");
const app = express();
const db = require("./db");
const router = require("./routes");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(helmet());
app.use(lusca());
app.use(limiter);

app.use(router);

(async () => {
  try {
    // Let's wait for all models and DB resources to load properly
    await db.sync();
  } catch (e) {
    console.error("Unable to sync the database:", e);
  }

  app.listen(process.env.PORT, () =>
    console.log(`App listening on port ${process.env.PORT}!`)
  );
})();
