const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const { prisma } = require("../lib/prisma");
const { serializePrisma } = require("../lib/serialize");
const { requireRoles, sessionAuthMiddleware } = require("../middlewares/session-auth");

const usersRouter = Router();

const createUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).optional(),
});

usersRouter.get("/users", sessionAuthMiddleware, requireRoles(["admin"]), async (req, res) => {
  const querySchema = z.object({
    q: z.string().trim().optional(),
  });

  const { q } = querySchema.parse(req.query);

  const users = await prisma.user.findMany({
    where: q
      ? {
          email: {
            contains: q,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return res.json(serializePrisma(users));
});

usersRouter.post("/users", sessionAuthMiddleware, requireRoles(["admin"]), async (req, res) => {
  const payload = createUserSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      email: payload.email.toLowerCase(),
      passwordHash,
      role: payload.role || "user",
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return res.status(201).json(serializePrisma(user));
});

module.exports = { usersRouter };
