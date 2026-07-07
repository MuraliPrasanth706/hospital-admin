import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { runMigrations } from "./config/migrate";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[DB] Migration failed — server not started:", err);
    process.exit(1);
  });