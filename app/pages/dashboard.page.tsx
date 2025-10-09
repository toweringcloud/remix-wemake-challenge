import { BookMarked, Archive, CookingPot, ShoppingCart } from "lucide-react";

import type { Route } from "./+types/dashboard.page";
import { FeatureCard } from "~/components/feature-card";
import { useRoleStore } from "~/stores/user.store";
import { useCafeStore } from "~/stores/cafe.store";

// ✅ loader 데이터를 활용하여 meta의 title 변경
// export const meta: Route.MetaFunction = ({ matches }: Route.MetaArgs) => {
//   const dashboardLayoutMatch = matches.find(
//     (match: any) => match.pathname === "/dashboard" // 또는 레이아웃에 고유한 id가 있다면 id로 찾기
//   );

//   type DashboardLoaderData = { cafe: { name: string } | null };
//   const loaderData = dashboardLayoutMatch?.loaderData as
//     | DashboardLoaderData
//     | undefined;
//   const cafeName = loaderData?.cafe?.name || "Caferium";

//   return [
//     { title: `Dashboard | ${cafeName || "Caferium"}` },
//     { name: "description", content: "feature list" },
//   ];
// };

export const meta: Route.MetaFunction = () => {
  return [
    { title: `Dashboard | Caferium` },
    { name: "description", content: "feature list" },
  ];
};

export default function DashboardPage() {
  const { roleCode } = useRoleStore();
  const { name } = useCafeStore();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-3xl font-bold text-amber-800 mb-4">
        {`${name}'s 대시보드`}
      </div>
      <p className="text-lg text-stone-600 mb-10">
        조회 또는 관리할 기능을 선택해주세요.
      </p>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {roleCode === "SA" ? (
          <>
            <FeatureCard
              path="/dashboard/cafe"
              name={"카페 관리"}
              description={
                <p className="text-stone-500">카페의 기본 정보를 관리합니다.</p>
              }
              icon={
                <BookMarked
                  size={48}
                  className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
                />
              }
            />
            <FeatureCard
              path="/dashboard/schedules"
              name={"근무 관리"}
              description={
                <p className="text-stone-500">교대 근무 현황을 관리합니다.</p>
              }
              icon={
                <BookMarked
                  size={48}
                  className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
                />
              }
            />
          </>
        ) : null}
        {roleCode === "SA" || roleCode === "MA" ? (
          <FeatureCard
            path={`/dashboard/products`}
            name={"상품 관리"}
            description={
              <p className="text-stone-500">
                상품 정보와 상품별 메뉴를 관리합니다.
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
          path={`/dashboard/recipes`}
          name={roleCode === "BA" ? "레시피" : "레시피 관리"}
          description={
            <p className="text-stone-500">
              음료와 디저트의 레시피를 {roleCode === "BA" ? "확인" : "관리"}
              합니다.
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
          path={`/dashboard/stocks`}
          name={roleCode === "BA" ? "재고" : "재고 관리"}
          description={
            <p className="text-stone-500">
              식재료에 대한 재고를 {roleCode === "BA" ? "확인" : "관리"}합니다.
            </p>
          }
          icon={
            <Archive
              size={48}
              className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
            />
          }
        />
        {/* {roleCode === "SA" || roleCode === "MA" ? (
          <FeatureCard
            path={`/dashboard/sales`}
            name={"매출 관리"}
            description={
              <p className="text-stone-500">메뉴별 판매 현황을 관리합니다.</p>
            }
            icon={
              <Archive
                size={48}
                className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
              />
            }
          />
        ) : null} */}
      </div>
    </div>
  );
}
