import { App } from "./app";
import { Database } from "./config/database";
import { env } from "./config/env";

const start = async (): Promise<void> => {
  const database = new Database();
  await database.connect();

  const app = new App();
  app.app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

