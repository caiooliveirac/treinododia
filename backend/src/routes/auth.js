const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const { env } = require("../config/env");
const { createSessionToken } = require("../lib/auth-session");
const { prisma } = require("../lib/prisma");
const { sessionAuthMiddleware } = require("../middlewares/session-auth");

const authRouter = Router();

authRouter.post("/auth/session", (req, res) => {
  const bodySchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  });

  const payload = bodySchema.parse(req.body);

  const isValidAdmin =
    payload.email.toLowerCase() === env.adminEmail.toLowerCase() &&
    payload.password === env.adminPassword;

  if (!isValidAdmin) {
    return res.status(401).json({
      message: "Credenciais inválidas.",
    });
  }

  const token = createSessionToken(
    {
      role: "admin",
      email: payload.email.toLowerCase(),
    },
    {
      subject: "admin-session",
    }
  );

  return res.status(201).json({
    token,
    admin: {
      email: payload.email.toLowerCase(),
      role: "admin",
    },
  });
});

authRouter.post("/auth/user-session", async (req, res) => {
  const bodySchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  });

  const payload = bodySchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email.toLowerCase(),
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "Credenciais inválidas.",
    });
  }

  const validPassword = await bcrypt.compare(payload.password, user.passwordHash);

  if (!validPassword) {
    return res.status(401).json({
      message: "Credenciais inválidas.",
    });
  }

  const token = createSessionToken(
    {
      role: user.role,
      userId: user.id,
      email: user.email,
    },
    {
      subject: "user-session",
    }
  );

  return res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

authRouter.get("/auth/me", sessionAuthMiddleware, (req, res) => {
  return res.json({
    session: req.session,
  });
});

module.exports = { authRouter };
