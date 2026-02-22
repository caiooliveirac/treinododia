require("dotenv/config");

const { app } = require("./app");
const { env } = require("./config/env");
const { prisma } = require("./lib/prisma");

const server = app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
