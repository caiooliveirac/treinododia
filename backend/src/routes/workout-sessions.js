const { Router } = require("express");
const { z } = require("zod");

const { prisma } = require("../lib/prisma");
const { serializePrisma } = require("../lib/serialize");
const {
  resolveScopedUserId,
  requireRoles,
  sessionAuthMiddleware,
} = require("../middlewares/session-auth");

const workoutSessionsRouter = Router();
workoutSessionsRouter.use(sessionAuthMiddleware);
workoutSessionsRouter.use(requireRoles(["admin", "user"]));

const sessionSetSchema = z.object({
  exerciseId: z.string().uuid(),
  setNumber: z.number().int().positive(),
  reps: z.number().int().nonnegative().optional(),
  weightKg: z.number().nonnegative().optional(),
  rpe: z.number().min(0).max(10).optional(),
  completed: z.boolean().optional(),
});

workoutSessionsRouter.get("/workout-sessions", async (req, res) => {
  const querySchema = z.object({
    userId: z.string().uuid().optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  });

  const { userId, from, to } = querySchema.parse(req.query);
  const scopedUserId = resolveScopedUserId(req, userId);

  if (!scopedUserId) {
    return res.status(403).json({
      message: "Você não pode acessar dados de outro usuário.",
    });
  }

  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId: scopedUserId,
      ...((from || to)
        ? {
            startedAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    include: {
      workoutPlan: true,
      sets: {
        include: {
          exercise: true,
        },
        orderBy: [{ exerciseId: "asc" }, { setNumber: "asc" }],
      },
    },
    orderBy: [{ startedAt: "desc" }],
  });

  return res.json(serializePrisma(sessions));
});

workoutSessionsRouter.post("/workout-sessions", async (req, res) => {
  const bodySchema = z
    .object({
      userId: z.string().uuid(),
      workoutPlanId: z.string().uuid().optional(),
      startedAt: z.string().datetime().optional(),
      finishedAt: z.string().datetime().optional(),
      feelingScore: z.number().int().min(1).max(5).optional(),
      notes: z.string().trim().optional(),
      sets: z.array(sessionSetSchema).optional(),
    })
    .refine(
      (value) =>
        !value.finishedAt ||
        !value.startedAt ||
        new Date(value.finishedAt) >= new Date(value.startedAt),
      {
        message: "finishedAt não pode ser anterior a startedAt.",
        path: ["finishedAt"],
      }
    );

  const payload = bodySchema.parse(req.body);
  const scopedUserId = resolveScopedUserId(req, payload.userId);

  if (!scopedUserId) {
    return res.status(403).json({
      message: "Você não pode criar sessão para outro usuário.",
    });
  }

  if (payload.sets?.length) {
    const uniqueSetKey = new Set(
      payload.sets.map((set) => `${set.exerciseId}:${set.setNumber}`)
    );

    if (uniqueSetKey.size !== payload.sets.length) {
      return res.status(400).json({
        message: "Sets duplicados para mesmo exercício e setNumber.",
      });
    }
  }

  const session = await prisma.$transaction(async (tx) => {
    const createdSession = await tx.workoutSession.create({
      data: {
        userId: scopedUserId,
        workoutPlanId: payload.workoutPlanId,
        startedAt: payload.startedAt ? new Date(payload.startedAt) : undefined,
        finishedAt: payload.finishedAt ? new Date(payload.finishedAt) : undefined,
        feelingScore: payload.feelingScore,
        notes: payload.notes,
      },
    });

    if (payload.sets?.length) {
      await tx.workoutSessionSet.createMany({
        data: payload.sets.map((set) => ({
          workoutSessionId: createdSession.id,
          exerciseId: set.exerciseId,
          setNumber: set.setNumber,
          reps: set.reps,
          weightKg: set.weightKg,
          rpe: set.rpe,
          completed: set.completed ?? true,
        })),
      });
    }

    return tx.workoutSession.findUnique({
      where: { id: createdSession.id },
      include: {
        workoutPlan: true,
        sets: {
          include: {
            exercise: true,
          },
          orderBy: [{ exerciseId: "asc" }, { setNumber: "asc" }],
        },
      },
    });
  });

  return res.status(201).json(serializePrisma(session));
});

module.exports = { workoutSessionsRouter };
