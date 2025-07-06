import { disconnectDB, initializeDB } from '@/config/database';
import 'colors';
// import './app';
import { socketServer } from '@/socket/socket';

import { PORT } from './config/envs';
import { getDefaultGateway, getLocalIPAddress } from './utils/network';

// Handle Uncaught Exceptions
process.on('uncaughtException', error => {
  console.error(`❌ ERROR: ${error.message}`);
  console.error('Shutting down the server due to an uncaught exception...'.yellow.italic);
  process.exit(1);
});

const main = async () => {
  try {
    // Initialize Database
    await initializeDB();

    const gateway = getDefaultGateway();
    const localIP = getLocalIPAddress(gateway);

    console.log({ gateway, localIP });

    // Start the server
    const server = socketServer.listen(PORT, () =>
      console.log(`🚀 Server is running on http://${localIP}:${PORT}`.green.italic)
    );

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (error: any) => {
      console.error(`❌ ERROR: ${error.message}`.red.italic);
      console.error(
        'Shutting down the server due to an unhandled promise rejection...'.yellow.italic,
        error
      );

      server.close(async () => {
        await disconnectDB(); // Cleanup DB connection
        process.exit(1);
      });
    });

    // Graceful Shutdown
    process.on('SIGINT', async () => {
      console.log('\n⏳ Gracefully shutting down...'.magenta.italic);
      server.close(async () => {
        await disconnectDB();
        console.log('✅ Server and DB connection closed.'.magenta.italic);
        process.exit(0);
      });
    });
  } catch (error: any) {
    console.error(`❌ Application failed to start: ${error.message}`.red.italic);
    process.exit(1);
  }
};

main();
