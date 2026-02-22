const { Router } = require("express");
const { z } = require("zod");

const { prisma } = require("../lib/prisma");
const { serializePrisma } = require("../lib/serialize");
const { adminAuthMiddleware } = require("../middlewares/admin-auth");

const adminRouter = Router();

adminRouter.use("/admin", adminAuthMiddleware);

adminRouter.get("/admin/dashboard", async (_req, res) => {
  const [
    totalUsers,
    totalPlans,
    totalSessions,
    totalWorkoutLogs,
    activePlans,
    recentUsers,
    recentPlans,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.workoutPlan.count(),
    prisma.workoutSession.count(),
    prisma.workoutLog.count(),
    prisma.workoutPlan.count({ where: { isActive: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.workoutPlan.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        user: true,
      },
    }),
  ]);

  return res.json(
    serializePrisma({
      summary: {
        totalUsers,
        totalPlans,
        totalSessions,
        totalWorkoutLogs,
        activePlans,
      },
      recentUsers,
      recentPlans,
    })
  );
});

adminRouter.get("/admin/users", async (req, res) => {
  const querySchema = z.object({
    q: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
  });

  const { q, page, pageSize } = querySchema.parse(req.query);
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        email: {
          contains: q,
          mode: "insensitive",
        },
      }
    : undefined;

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return res.json(
    serializePrisma({
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    })
  );
});

adminRouter.get("/admin/plans", async (req, res) => {
  const querySchema = z.object({
    activeOnly: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
  });

  const { activeOnly, page, pageSize } = querySchema.parse(req.query);
  const skip = (page - 1) * pageSize;

  const where = activeOnly ? { isActive: true } : undefined;

  const [items, total] = await Promise.all([
    prisma.workoutPlan.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
      include: {
        user: true,
        planExercises: true,
      },
    }),
    prisma.workoutPlan.count({ where }),
  ]);

  return res.json(
    serializePrisma({
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    })
  );
});

module.exports = { adminRouter };
