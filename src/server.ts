import app from './app';
import Config from './config';
import logger from './config/logger';

const startServer = () => {
  try {
    app.listen(parseInt(Config.PORT || '0'), () =>
      logger.info(`Microservice auth server running on ${Config.PORT}`),
    );
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};
startServer();
