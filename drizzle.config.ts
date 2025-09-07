import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./app/models/schema.ts",
  out: "./app/models/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
