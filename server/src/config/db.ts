import { Pool } from "pg";
import dotenv from "dotenv";
import { logger } from "../utils/logger";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

pool.on("error", (err) => {
  logger.error("Unexpected error on idle client", err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
