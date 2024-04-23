import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
// const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
const sql = neon(
  "postgresql://TimurSejati:WiZKEUwH1f0G@ep-black-snow-04700455.us-east-2.aws.neon.tech/expenses_tracker_db?sslmode=require"
);
export const db = drizzle(sql, { schema });
