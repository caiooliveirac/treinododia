const { Router } = require("express");
const { z } = require("zod");

const { prisma } = require("../lib/prisma");
const { serializePrisma } = require("../lib/serialize");
const {
  resolveScopedUserId,
  requireRoles,
  sessionAuthMiddleware,
} = require("../middlewares/session-auth");

const workoutPlansRouter = Router();
workoutPlansRouter.use(sessionAuthMiddleware);
workoutPlansRouter.use(requireRoles(["admin", "user"]));

const planExerciseSchema = z
  .object({
    exerciseId: z.string().uuid(),
    sortOrder: z.number().int().positive(),
    targetSets: z.number().int().positive().optional(),
    targetRepsMin: z.number().int().positive().optional(),
    targetRepsMax: z.number().int().positive().optional(),
    targetWeightKg: z.number().nonnegative().optional(),
    restSeconds: z.number().int().nonnegative().optional(),
    notes: z.string().trim().optional(),
  })
  .refine(
    (value) =>
      value.targetRepsMin == null ||
      value.targetRepsMax == null ||
      value.targetRepsMin <= value.targetRepsMax,
    {
      message: "targetRepsMin não pode ser maior que targetRepsMax.",
      path: ["targetRepsMin"],
    }
  );

workoutPlansRouter.get("/workout-plans", async (req, res) => {
  const querySchema = z.object({
    userId: z.string().uuid().optional(),
    activeOnly: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
  });

  const { userId, activeOnly } = querySchema.parse(req.query);
  const scopedUserId = resolveScopedUserId(req, userId);

  if (!scopedUserId) {
    return res.status(403).json({
      message: "Você não pode acessar dados de outro usuário.",
    });
  }

  const plans = await prisma.workoutPlan.findMany({
    where: {
      userId: scopedUserId,
      ...(activeOnly ? { isActive: true } : {}),
    },
    include: {
      planExercises: {
        include: {
          exercise: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  return res.json(serializePrisma(plans));
});

workoutPlansRouter.post("/workout-plans", async (req, res) => {
  const bodySchema = z.object({
    userId: z.string().uuid(),
    title: z.string().trim().min(1),
    description: z.string().trim().optional(),
    isActive: z.boolean().optional(),
    exercises: z.array(planExerciseSchema).optional(),
  });

  const payload = bodySchema.parse(req.body);
  const scopedUserId = resolveScopedUserId(req, payload.userId);

  if (!scopedUserId) {
    return res.status(403).json({
      message: "Você não pode criar plano para outro usuário.",
    });
  }

  const sortOrders = (payload.exercises || []).map((item) => item.sortOrder);
  const hasDuplicatedSortOrder = new Set(sortOrders).size !== sortOrders.length;

  if (hasDuplicatedSortOrder) {
    return res.status(400).json({
      message: "Cada exercício do plano deve ter sortOrder único.",
    });
  }

  const plan = await prisma.$transaction(async (tx) => {
    const createdPlan = await tx.workoutPlan.create({
      data: {
        userId: scopedUserId,
        title: payload.title,
        description: payload.description,
        isActive: payload.isActive ?? true,
      },
    });

    if (payload.exercises?.length) {
      await tx.workoutPlanExercise.createMany({
        data: payload.exercises.map((item) => ({
          workoutPlanId: createdPlan.id,
          exerciseId: item.exerciseId,
          sortOrder: item.sortOrder,
          targetSets: item.targetSets,
          targetRepsMin: item.targetRepsMin,
          targetRepsMax: item.targetRepsMax,
          targetWeightKg: item.targetWeightKg,
          restSeconds: item.restSeconds,
          notes: item.notes,
        })),
      });
    }

    return tx.workoutPlan.findUnique({
      where: { id: createdPlan.id },
      include: {
        planExercises: {
          include: {
            exercise: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });
  });

  return res.status(201).json(serializePrisma(plan));
});

module.exports = { workoutPlansRouter };
