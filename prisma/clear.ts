import prisma from '../src/config/prisma-client';

async function main() {
  console.log('🧨 Clearing all records...');

  await prisma.session.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleared successfully');
}

main()
  .catch(e => {
    console.error('❌ Error clearing DB:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
