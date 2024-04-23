/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.jsx",
  driver: "pg",
  dbCredentials: {
    connectionString:
      "postgresql://TimurSejati:WiZKEUwH1f0G@ep-black-snow-04700455.us-east-2.aws.neon.tech/expenses_tracker_db?sslmode=require",
    // connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
};
