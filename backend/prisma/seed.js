require('dotenv/config');

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function daysAgo(value) {
  const date = new Date();
  date.setDate(date.getDate() - value);
  return date;
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const clientEmail = process.env.CLIENT_EMAIL;
  const clientPassword = process.env.CLIENT_PASSWORD;

  if (!adminEmail || !adminPassword || !clientEmail || !clientPassword) {
    throw new Error('Defina ADMIN_EMAIL, ADMIN_PASSWORD, CLIENT_EMAIL e CLIENT_PASSWORD no .env');
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  });

  const demoClientsConfig = [
    { email: clientEmail.toLowerCase(), password: clientPassword },
    { email: 'joao.silva@treinododia.com', password: 'Cliente123!' },
    { email: 'maria.santos@treinododia.com', password: 'Cliente123!' },
    { email: 'ana.costa@treinododia.com', password: 'Cliente123!' },
  ];

  const demoUsers = [];

  for (const clientConfig of demoClientsConfig) {
    const passwordHash = await bcrypt.hash(clientConfig.password, 10);

    const user = await prisma.user.upsert({
      where: { email: clientConfig.email },
      update: {
        passwordHash,
        role: 'user',
      },
      create: {
        email: clientConfig.email,
        passwordHash,
        role: 'user',
      },
    });

    demoUsers.push(user);
  }

  const demoUserIds = demoUsers.map((user) => user.id);

  const existingSessions = await prisma.workoutSession.findMany({
    where: { userId: { in: demoUserIds } },
    select: { id: true },
  });

  if (existingSessions.length) {
    await prisma.workoutSessionSet.deleteMany({
      where: {
        workoutSessionId: { in: existingSessions.map((session) => session.id) },
      },
    });
  }

  await prisma.workoutSession.deleteMany({ where: { userId: { in: demoUserIds } } });

  const existingPlans = await prisma.workoutPlan.findMany({
    where: { userId: { in: demoUserIds } },
    select: { id: true },
  });

  if (existingPlans.length) {
    await prisma.workoutPlanExercise.deleteMany({
      where: {
        workoutPlanId: { in: existingPlans.map((plan) => plan.id) },
      },
    });
  }

  await prisma.workoutPlan.deleteMany({ where: { userId: { in: demoUserIds } } });
  await prisma.workoutLog.deleteMany({ where: { userId: { in: demoUserIds } } });

  const strengthCategory = await prisma.exerciseCategory.upsert({
    where: { slug: 'forca' },
    update: { name: 'Força' },
    create: { slug: 'forca', name: 'Força' },
  });

  const conditioningCategory = await prisma.exerciseCategory.upsert({
    where: { slug: 'condicionamento' },
    update: { name: 'Condicionamento' },
    create: { slug: 'condicionamento', name: 'Condicionamento' },
  });

  const mobilityCategory = await prisma.exerciseCategory.upsert({
    where: { slug: 'mobilidade' },
    update: { name: 'Mobilidade' },
    create: { slug: 'mobilidade', name: 'Mobilidade' },
  });

  const squat = await prisma.exercise.upsert({
    where: {
      categoryId_name: {
        categoryId: strengthCategory.id,
        name: 'Agachamento Livre',
      },
    },
    update: { equipment: 'Barra Olímpica' },
    create: {
      categoryId: strengthCategory.id,
      name: 'Agachamento Livre',
      equipment: 'Barra Olímpica',
      isUnilateral: false,
    },
  });

  const benchPress = await prisma.exercise.upsert({
    where: {
      categoryId_name: {
        categoryId: strengthCategory.id,
        name: 'Supino Reto',
      },
    },
    update: { equipment: 'Barra Olímpica' },
    create: {
      categoryId: strengthCategory.id,
      name: 'Supino Reto',
      equipment: 'Barra Olímpica',
      isUnilateral: false,
    },
  });

  const deadlift = await prisma.exercise.upsert({
    where: {
      categoryId_name: {
        categoryId: strengthCategory.id,
        name: 'Levantamento Terra',
      },
    },
    update: { equipment: 'Barra Olímpica' },
    create: {
      categoryId: strengthCategory.id,
      name: 'Levantamento Terra',
      equipment: 'Barra Olímpica',
      isUnilateral: false,
    },
  });

  const rowing = await prisma.exercise.upsert({
    where: {
      categoryId_name: {
        categoryId: conditioningCategory.id,
        name: 'Remo Ergométrico',
      },
    },
    update: { equipment: 'Remo Concept2' },
    create: {
      categoryId: conditioningCategory.id,
      name: 'Remo Ergométrico',
      equipment: 'Remo Concept2',
      isUnilateral: false,
    },
  });

  const bike = await prisma.exercise.upsert({
    where: {
      categoryId_name: {
        categoryId: conditioningCategory.id,
        name: 'Bike Intervalada',
      },
    },
    update: { equipment: 'Bicicleta Ergométrica' },
    create: {
      categoryId: conditioningCategory.id,
      name: 'Bike Intervalada',
      equipment: 'Bicicleta Ergométrica',
      isUnilateral: false,
    },
  });

  const shoulderMobility = await prisma.exercise.upsert({
    where: {
      categoryId_name: {
        categoryId: mobilityCategory.id,
        name: 'Mobilidade de Ombro',
      },
    },
    update: { equipment: 'Faixa Elástica' },
    create: {
      categoryId: mobilityCategory.id,
      name: 'Mobilidade de Ombro',
      equipment: 'Faixa Elástica',
      isUnilateral: false,
    },
  });

  for (const [index, user] of demoUsers.entries()) {
    const baseOffset = index * 2;

    await prisma.workoutLog.createMany({
      data: [
        {
          userId: user.id,
          workoutDate: daysAgo(9 + baseOffset),
          description: 'Treino A: foco em técnica de agachamento e core.',
        },
        {
          userId: user.id,
          workoutDate: daysAgo(6 + baseOffset),
          description: 'Treino B: supino + puxadas com progressão de carga.',
        },
        {
          userId: user.id,
          workoutDate: daysAgo(3 + baseOffset),
          description: 'Treino C: condicionamento intervalado e mobilidade.',
        },
        {
          userId: user.id,
          workoutDate: daysAgo(1 + baseOffset),
          description: 'Treino D: sessão leve de recuperação ativa.',
        },
      ],
    });

    const strengthPlan = await prisma.workoutPlan.create({
      data: {
        userId: user.id,
        title: `Plano Força ${index + 1}`,
        description: 'Ciclo de 4 semanas com progressão de carga em básicos.',
        isActive: true,
      },
    });

    const conditioningPlan = await prisma.workoutPlan.create({
      data: {
        userId: user.id,
        title: `Plano Condicionamento ${index + 1}`,
        description: 'Sessões curtas de cardio intervalado e mobilidade.',
        isActive: index % 2 === 0,
      },
    });

    await prisma.workoutPlanExercise.createMany({
      data: [
        {
          workoutPlanId: strengthPlan.id,
          exerciseId: squat.id,
          sortOrder: 1,
          targetSets: 4,
          targetRepsMin: 5,
          targetRepsMax: 6,
          targetWeightKg: 80 + index * 5,
          restSeconds: 150,
        },
        {
          workoutPlanId: strengthPlan.id,
          exerciseId: benchPress.id,
          sortOrder: 2,
          targetSets: 4,
          targetRepsMin: 6,
          targetRepsMax: 8,
          targetWeightKg: 60 + index * 2,
          restSeconds: 120,
        },
        {
          workoutPlanId: strengthPlan.id,
          exerciseId: deadlift.id,
          sortOrder: 3,
          targetSets: 3,
          targetRepsMin: 4,
          targetRepsMax: 5,
          targetWeightKg: 100 + index * 5,
          restSeconds: 180,
        },
        {
          workoutPlanId: conditioningPlan.id,
          exerciseId: rowing.id,
          sortOrder: 1,
          targetSets: 6,
          targetRepsMin: 1,
          targetRepsMax: 1,
          restSeconds: 60,
          notes: 'Intervalos de 1min forte / 1min leve',
        },
        {
          workoutPlanId: conditioningPlan.id,
          exerciseId: bike.id,
          sortOrder: 2,
          targetSets: 8,
          targetRepsMin: 1,
          targetRepsMax: 1,
          restSeconds: 45,
        },
        {
          workoutPlanId: conditioningPlan.id,
          exerciseId: shoulderMobility.id,
          sortOrder: 3,
          targetSets: 3,
          targetRepsMin: 10,
          targetRepsMax: 12,
          restSeconds: 30,
        },
      ],
    });

    const startedA = daysAgo(2 + baseOffset);
    const finishedA = new Date(startedA.getTime() + 65 * 60 * 1000);
    const startedB = daysAgo(baseOffset);
    const finishedB = new Date(startedB.getTime() + 42 * 60 * 1000);

    const sessionA = await prisma.workoutSession.create({
      data: {
        userId: user.id,
        workoutPlanId: strengthPlan.id,
        startedAt: startedA,
        finishedAt: finishedA,
        feelingScore: 4,
        notes: 'Boa execução técnica e progressão consistente.',
      },
    });

    const sessionB = await prisma.workoutSession.create({
      data: {
        userId: user.id,
        workoutPlanId: conditioningPlan.id,
        startedAt: startedB,
        finishedAt: finishedB,
        feelingScore: 5,
        notes: 'Sessão curta, alta intensidade e recuperação adequada.',
      },
    });

    await prisma.workoutSessionSet.createMany({
      data: [
        {
          workoutSessionId: sessionA.id,
          exerciseId: squat.id,
          setNumber: 1,
          reps: 6,
          weightKg: 80 + index * 5,
          rpe: 7.5,
          completed: true,
        },
        {
          workoutSessionId: sessionA.id,
          exerciseId: squat.id,
          setNumber: 2,
          reps: 6,
          weightKg: 82 + index * 5,
          rpe: 8.0,
          completed: true,
        },
        {
          workoutSessionId: sessionA.id,
          exerciseId: benchPress.id,
          setNumber: 1,
          reps: 8,
          weightKg: 60 + index * 2,
          rpe: 7.0,
          completed: true,
        },
        {
          workoutSessionId: sessionB.id,
          exerciseId: rowing.id,
          setNumber: 1,
          reps: 1,
          weightKg: 0,
          rpe: 8.0,
          completed: true,
        },
        {
          workoutSessionId: sessionB.id,
          exerciseId: bike.id,
          setNumber: 1,
          reps: 1,
          weightKg: 0,
          rpe: 8.5,
          completed: true,
        },
      ],
    });
  }

  const totalUsers = await prisma.user.count();
  const totalPlans = await prisma.workoutPlan.count();
  const totalSessions = await prisma.workoutSession.count();
  const totalLogs = await prisma.workoutLog.count();

  console.log(
    `Seed concluído com sucesso. Admin: ${adminUser.email} | Usuários: ${totalUsers} | Planos: ${totalPlans} | Sessões: ${totalSessions} | Logs: ${totalLogs}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
