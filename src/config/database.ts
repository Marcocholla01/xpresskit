import prisma from '@/config/prisma-client';

export const initializeDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connection established successfully'.cyan.italic);
  } catch (err: any) {
    console.error('❌ Failed to connect to the database'.red.italic, err);
    process.exit(1); // Exit if DB fails to connect
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('🛑 Database connection closed'.yellow.italic);
  } catch (err: any) {
    console.error('⚠️ Error disconnecting from the database'.red.italic, err);
  }
};
