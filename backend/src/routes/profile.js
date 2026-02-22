const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const { prisma } = require("../lib/prisma");
const { serializePrisma } = require("../lib/serialize");
const { sessionAuthMiddleware } = require("../middlewares/session-auth");

const profileRouter = Router();
profileRouter.use(sessionAuthMiddleware);

profileRouter.get("/profile", async (req, res) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Sessão de usuário obrigatória." });
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: req.session.userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          workoutLogs: true,
          workoutPlans: true,
          workoutSessions: true,
        },
      },
    },
  });

  return res.json(serializePrisma(user));
});

profileRouter.patch("/profile/password", async (req, res) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Sessão de usuário obrigatória." });
  }

  const bodySchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
  });

  const { currentPassword, newPassword } = bodySchema.parse(req.body);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: req.session.userId },
  });

  const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!validPassword) {
    return res.status(401).json({ message: "Senha atual incorreta." });
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: req.session.userId },
    data: { passwordHash: newPasswordHash },
  });

  return res.json({ message: "Senha atualizada com sucesso." });
});

module.exports = { profileRouter };
