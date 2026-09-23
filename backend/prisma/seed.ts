import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/infrastructure/database/prisma.client.js';

async function main() {
  console.log('🌱 Starting database seeding...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@eventticket.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`ℹ️ Admin user already exists (${adminEmail}). Skipping seed.`);
    return;
  }

  // Hash password with salt rounds = 10
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: adminEmail,
      passwordHash: passwordHash,
      role: Role.ADMIN,
      isVerified: true,
      isActive: true,
    },
  });

  console.log(`✅ Admin user created successfully:`);
  console.log(`   ID:    ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role:  ${admin.role}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
