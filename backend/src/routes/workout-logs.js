const { Router } = require("express");
const { z } = require("zod");

const { prisma } = require("../lib/prisma");
const { serializePrisma } = require("../lib/serialize");
const {
  resolveScopedUserId,
  requireRoles,
  sessionAuthMiddleware,
} = require("../middlewares/session-auth");

const workoutLogsRouter = Router();
workoutLogsRouter.use(sessionAuthMiddleware);
workoutLogsRouter.use(requireRoles(["admin", "user"]));

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

function toDateFromISODate(isoDate) {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

workoutLogsRouter.get("/workout-logs", async (req, res) => {
  const querySchema = z.object({
    userId: z.string().uuid().optional(),
    from: isoDateSchema.optional(),
    to: isoDateSchema.optional(),
  });

  const { userId, from, to } = querySchema.parse(req.query);
  const scopedUserId = resolveScopedUserId(req, userId);

  if (!scopedUserId) {
    return res.status(403).json({
      message: "Você não pode acessar dados de outro usuário.",
    });
  }

  const dateFilter = from || to
    ? {
        ...(from ? { gte: toDateFromISODate(from) } : {}),
        ...(to ? { lte: toDateFromISODate(to) } : {}),
      }
    : undefined;

  const workoutLogs = await prisma.workoutLog.findMany({
    where: {
      userId: scopedUserId,
      ...(dateFilter ? { workoutDate: dateFilter } : {}),
    },
    orderBy: [{ workoutDate: "desc" }, { createdAt: "desc" }],
    include: {
      user: true,
    },
  });

  return res.json(serializePrisma(workoutLogs));
});

workoutLogsRouter.post("/workout-logs", async (req, res) => {
  const bodySchema = z.object({
    userId: z.string().uuid(),
    workoutDate: isoDateSchema,
    description: z.string().trim().min(1),
  });

  const payload = bodySchema.parse(req.body);
  const scopedUserId = resolveScopedUserId(req, payload.userId);

  if (!scopedUserId) {
    return res.status(403).json({
      message: "Você não pode criar treino para outro usuário.",
    });
  }

  const workoutLog = await prisma.workoutLog.create({
    data: {
      userId: scopedUserId,
      workoutDate: toDateFromISODate(payload.workoutDate),
      description: payload.description,
    },
    include: {
      user: true,
    },
  });

  return res.status(201).json(serializePrisma(workoutLog));
});

module.exports = { workoutLogsRouter };
