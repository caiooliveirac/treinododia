const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const { env } = require("./config/env");
const { errorHandler } = require("./middlewares/error-handler");
const { notFoundHandler } = require("./middlewares/not-found");
const { generalRateLimiter } = require("./middlewares/rate-limit");
const { router } = require("./routes");

const app = express();

const corsOrigins = env.corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(generalRateLimiter);

app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
