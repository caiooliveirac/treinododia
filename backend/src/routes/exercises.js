const { Router } = require("express");
const { z } = require("zod");

const { prisma } = require("../lib/prisma");
const { serializePrisma } = require("../lib/serialize");
const { requireRoles, sessionAuthMiddleware } = require("../middlewares/session-auth");

const exercisesRouter = Router();
exercisesRouter.use(sessionAuthMiddleware);
exercisesRouter.use(requireRoles(["admin", "user"]));

exercisesRouter.get("/exercise-categories", async (_req, res) => {
  const categories = await prisma.exerciseCategory.findMany({
    orderBy: [{ name: "asc" }],
  });

  return res.json(serializePrisma(categories));
});

exercisesRouter.get("/exercises", async (req, res) => {
  const querySchema = z.object({
    categoryId: z.coerce.number().int().positive().optional(),
    q: z.string().trim().optional(),
  });

  const { categoryId, q } = querySchema.parse(req.query);

  const exercises = await prisma.exercise.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(q
        ? {
            name: {
              contains: q,
              mode: "insensitive",
            },
          }
        : {}),
    },
    include: {
      category: true,
    },
    orderBy: [{ name: "asc" }],
  });

  return res.json(serializePrisma(exercises));
});

exercisesRouter.post("/exercises", async (req, res) => {
  if (req.session?.role !== "admin") {
    return res.status(403).json({
      message: "Somente administrador pode cadastrar exercícios.",
    });
  }

  const bodySchema = z.object({
    categoryId: z.number().int().positive().optional(),
    name: z.string().trim().min(1),
    equipment: z.string().trim().min(1).optional(),
    isUnilateral: z.boolean().optional(),
  });

  const payload = bodySchema.parse(req.body);

  const exercise = await prisma.exercise.create({
    data: {
      categoryId: payload.categoryId,
      name: payload.name,
      equipment: payload.equipment,
      isUnilateral: payload.isUnilateral ?? false,
    },
    include: {
      category: true,
    },
  });

  return res.status(201).json(serializePrisma(exercise));
});

module.exports = { exercisesRouter };
