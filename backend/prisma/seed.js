require('dotenv/config');

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const clientEmail = process.env.CLIENT_EMAIL;
  const clientPassword = process.env.CLIENT_PASSWORD;

  if (!adminEmail || !adminPassword || !clientEmail || !clientPassword) {
    throw new Error('Defina ADMIN_EMAIL, ADMIN_PASSWORD, CLIENT_EMAIL e CLIENT_PASSWORD no .env');
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const clientPasswordHash = await bcrypt.hash(clientPassword, 10);

  await prisma.user.upsert({
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

  await prisma.user.upsert({
    where: { email: clientEmail.toLowerCase() },
    update: {
      passwordHash: clientPasswordHash,
      role: 'user',
    },
    create: {
      email: clientEmail.toLowerCase(),
      passwordHash: clientPasswordHash,
      role: 'user',
    },
  });

  console.log('Seed concluído com sucesso.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
