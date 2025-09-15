import { useEffect } from "react";
import type { LoaderFunction } from "react-router";
import { BookMarked, Archive, CookingPot, ShoppingCart } from "lucide-react";

import type { Route } from "./+types/dashboard.page";
import { FeatureCard } from "~/components/feature-card";
import { useRoleStore } from "~/stores/role.store";
import { createClient } from "~/utils/supabase.server";

export const meta: Route.MetaFunction = () => [
  { title: "Dashboard | Caferium" },
  { name: "description", content: "select recipe or inventory menu" },
];

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.has("login")) {
    const loginStatus = url.searchParams.get("login");
    const roleCode = url.searchParams.get("roleCode");
    const cafeId = url.searchParams.get("cafeId");

    const { supabase } = createClient(request);
    const { data: cafes } = await supabase
      .from("cafes")
      .select()
      .eq("id", cafeId);
    const cafeName = cafes![0].name;
    console.log("cafes", cafes);
    return { loginStatus, roleCode, cafeId, cafeName };
  }
};

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const { login } = useRoleStore();

  useEffect(() => {
    if (loaderData) {
      const { loginStatus, roleCode, cafeId, cafeName } = loaderData;
      if (loginStatus === "success" && roleCode && cafeId && cafeName) {
        login(cafeName, cafeId, roleCode);
        console.log(`로그인 성공! 역할: ${cafeName} | ${roleCode}`);

        // 중요: 이 로직은 새로고침 시에는 실행되지 않으므로,
        // 한 번 상태를 설정한 후 URL을 깔끔하게 정리하고 싶다면
        window.history.replaceState(null, "", "/dashboard");
      }
    }
  }, [loaderData, login]);

  const { roleCode } = useRoleStore();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h1 className="text-4xl font-bold text-amber-800 mb-4">
        {roleCode === "BA" ? "시니어클럽 카페" : "시니어클럽 카페 관리"}
      </h1>
      <p className="text-lg text-stone-600 mb-10">
        원하시는 메뉴를 선택해주세요.
      </p>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {roleCode === "SA" ? (
          <FeatureCard
            path="/dashboard/cafe"
            name={"카페 관리"}
            description={
              <p className="text-stone-500">
                카페의 기본 정보를 조회하고
                <br /> 수정합니다.
              </p>
            }
            icon={
              <BookMarked
                size={48}
                className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
              />
            }
          />
        ) : null}
        {roleCode === "SA" || roleCode === "MA" ? (
          <FeatureCard
            path="/dashboard/products"
            name={"상품 관리"}
            description={
              <p className="text-stone-500">
                카페의 상품 정보와 상품별 메뉴를
                <br /> 확인하고 조회합니다.
              </p>
            }
            icon={
              <ShoppingCart
                size={48}
                className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
              />
            }
          />
        ) : null}
        <FeatureCard
          path="/dashboard/recipes"
          name={roleCode === "BA" ? "레시피" : "레시피 관리"}
          description={
            <p className="text-stone-500">
              카페 음료와 디저트의 레시피를
              <br /> 확인하고 조회합니다.
            </p>
          }
          icon={
            <CookingPot
              size={48}
              className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
            />
          }
        />
        <FeatureCard
          path="/dashboard/stocks"
          name={roleCode === "BA" ? "재고" : "재고 관리"}
          description={
            <p className="text-stone-500">
              카페의 식재료에 대한
              <br /> 재고를 관리합니다.
            </p>
          }
          icon={
            <Archive
              size={48}
              className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
            />
          }
        />
      </div>
    </div>
  );
}
