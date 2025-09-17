import { DateTime } from "luxon";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/models/database.types";

export const readCafeData = async ({
  client,
  startDate,
  endDate,
  limit,
}: {
  client: SupabaseClient<Database>;
  startDate: DateTime;
  endDate: DateTime;
  limit: number;
}) => {
  const { data, error } = await client
    .from("cafes")
    .select(
      `
        name,
        description,
        logo_url,
        headline,
        body
      `
    )
    .order("name", { ascending: false })
    .gte("created_at", startDate.toISO())
    .lte("created_at", endDate.toISO())
    .limit(limit);
  console.log("getCafeData", data);

  if (error) throw error;
  return data;
};
