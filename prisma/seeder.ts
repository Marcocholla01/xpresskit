import { faker } from '@faker-js/faker';
import { Role } from '../generated/prisma'; // or '@prisma/client'
import prisma from '../src/config/prisma-client';
import { hashPassword } from '../src/utils/password';
// Number of users to seed — default is 300
const totalUsers = parseInt(process.argv[2] || '300');

// Convert enum to array
const roles: Role[] = Object.values(Role);

// Helper to pick a random role
const getRandomRole = (): Role => {
  const index = Math.floor(Math.random() * roles.length);
  return roles[index];
};

async function main() {
  console.log(`🌱 Seeding ${totalUsers} user(s) with random roles...\n`);

  const password = await hashPassword('Password123!');

  for (let i = 0; i < totalUsers; i++) {
    const role = getRandomRole();

    const user = await prisma.user.create({
      data: {
        fullNames: faker.person.fullName(),
        emailVerified: faker.datatype.boolean(),
        username: faker.internet.username().toLowerCase() + faker.string.alphanumeric(3),
        emailAddress: faker.internet.email().toLowerCase(),
        phoneNumber: faker.phone.number({ style: 'international' }),
        password,
        role,
      },
    });

    console.log(`✅ [${i + 1}/${totalUsers}] Created ${user.username} (${role})`);
  }

  console.log(`\n🎉 Done seeding ${totalUsers} users\n`);
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
