const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3333),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3001",
  adminEmail: process.env.ADMIN_EMAIL || "admin@treinododia.local",
  adminPassword: process.env.ADMIN_PASSWORD || "change-me",
  authSessionSecret:
    process.env.AUTH_SESSION_SECRET || "dev-secret-change-me",
  authSessionTtl: process.env.AUTH_SESSION_TTL || "8h",
};

module.exports = { env };
