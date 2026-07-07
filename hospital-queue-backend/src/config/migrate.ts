import fs from "fs";
import path from "path";
import { pool } from "./db";

/**
 * Reads db/schema.sql and runs it against the connected database.
 * All statements use IF NOT EXISTS so it is safe to call on every startup.
 */
export const runMigrations = async (): Promise<void> => {
  const schemaPath = path.join(__dirname, "../../db/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");
  await pool.query(sql);
  console.log("[DB] Schema migrations applied.");
};
