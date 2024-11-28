import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.resolve(process.cwd(), "..", ".env"),
});

export const DB_CONFIG = {
  host: process.env["DB_HOST"] || "localhost",
  user: process.env["DB_USER"] || "root",
  password: process.env["DB_PASS"] || undefined,
  database: process.env["DB_SCHEMA"] || "test",
};
