import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/models/database.types";

const client = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default client;
