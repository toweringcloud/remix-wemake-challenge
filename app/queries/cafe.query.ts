import { DateTime } from "luxon";
// import client from "~/utils/supabase.client";
import { createClient } from "~/utils/supabase.server";

export const getCafeData = async ({
  request,
  startDate,
  endDate,
  limit,
}: {
  request: Request;
  startDate: DateTime;
  endDate: DateTime;
  limit: number;
}) => {
  // const { data, error } = await client
  //   .from("cafes")
  //   .select(
  //     `
  //       name,
  //       description,
  //       logo_url,
  //       headline,
  //       body
  //   `
  //   )
  //   .order("name", { ascending: false })
  //   .gte("created_at", startDate.toISO())
  //   .lte("created_at", endDate.toISO())
  //   .limit(limit);

  const { supabase } = createClient(request);
  const { data, error } = await supabase
    .from("cafes")
    .select("name, description, logo_url, headline, body")
    .order("name", { ascending: false })
    .gte("created_at", startDate.toISO())
    .lte("created_at", endDate.toISO())
    .limit(limit);
  console.log("getCafeData", data);

  if (error) throw error;
  return data;
};
