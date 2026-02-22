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

if (env.nodeEnv === "production") {
  const insecureDefaults = [
    ["ADMIN_PASSWORD", env.adminPassword, "change-me"],
    ["AUTH_SESSION_SECRET", env.authSessionSecret, "dev-secret-change-me"],
  ];

  for (const [name, value, fallback] of insecureDefaults) {
    if (!value || value === fallback) {
      throw new Error(
        `[SEGURANÇA] Variável ${name} não definida ou usando valor padrão inseguro. ` +
        `Defina um valor forte no .env antes de iniciar em produção.`
      );
    }
  }

  if (!process.env.POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD === "troque-por-uma-senha-forte") {
    console.warn(
      "[AVISO] POSTGRES_PASSWORD não definida ou usando valor padrão do .env.example. " +
      "Troque por uma senha forte."
    );
  }
}

module.exports = { env };
