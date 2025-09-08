import app from './app';
import Config from './config';
import { AppDataSource } from './config/data-source';
import logger from './config/logger';

const startServer = async () => {
  try {
    const connection = await AppDataSource.initialize();
    logger.info(`Database initialised: ${connection.isInitialized}`);
    // check the data in db
    app.listen(Config.PORT, () =>
      logger.info(`Microservice auth server running on ${Config.PORT}`),
    );
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};
void startServer();
