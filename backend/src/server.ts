import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
    console.log(`Swagger docs: http://localhost:${env.PORT}/api/docs`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
