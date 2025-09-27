import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

import type { Route } from "./+types/dashboard.layout";
import Sidebar from "~/components/layout/sidebar";
import { useCafeStore } from "~/stores/cafe.store";
import { getCookieSession } from "~/utils/cookie.server";
import { createClient } from "~/utils/supabase.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
    const session = getCookieSession(request.headers.get("Cookie"));
    if (!session) throw new Response("Unauthorized", { status: 401 });
    if (!session?.cafeId) return { cafe: null };

    const { supabase } = createClient(request);
    const { data: cafe } = await supabase
      .from("cafes")
      .select("name")
      .eq("id", session.cafeId)
      .single();
    return { cafe };
  } catch (error) {
    return { cafe: null }; // ✅ json() 없이 객체 반환
  }
};

export default function DashboardLayout() {
  // const { cafe } = useLoaderData<typeof loader>();
  const { cafe } = useLoaderData() as { cafe: { name: string } | null };
  const { setName } = useCafeStore();

  // ✅ loader 데이터가 변경될 때마다 스토어의 카페 이름을 업데이트
  useEffect(() => {
    if (cafe?.name) {
      setName(cafe.name);
    }
  }, [cafe, setName]);

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 bg-amber-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
