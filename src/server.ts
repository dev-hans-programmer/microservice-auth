import app from './app';
import Config from './config';

const startServer = () => {
  try {
    app.listen(parseInt(Config.PORT || '0'), () =>
      console.log(`Server running on ${Config.PORT}`),
    );
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Call it here 👇
startServer();
