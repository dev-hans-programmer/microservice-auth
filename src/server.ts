import app from './app';
import Config from './config';
import logger from './config/logger';
import loadSecrets from './config/secrets';

import { AppDataSource } from './config/data-source';

const startServer = async () => {
  try {
    const { privateKey } = await loadSecrets();
    app.locals.keys = {
      privateKey,
    };

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
