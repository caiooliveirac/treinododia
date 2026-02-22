const { Router } = require("express");

const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  return res.json({
    status: "ok",
    service: "treinododia-backend",
    timestamp: new Date().toISOString(),
  });
});

module.exports = { healthRouter };
