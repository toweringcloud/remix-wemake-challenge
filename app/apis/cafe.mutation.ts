import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.type";

export const updateCafeMents = async (
  client: SupabaseClient<Database>,
  cafeId: string,
  descriptions: string[]
) => {
  const { error } = await client
    .from("cafes")
    .update({
      body: descriptions.join(", "),
    })
    .eq("cafe_id", cafeId);

  if (error) {
    throw error;
  }
};
