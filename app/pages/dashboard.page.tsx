import { useEffect } from "react";
import type { LoaderFunction } from "react-router";
import { BookMarked, Archive } from "lucide-react";

import type { Route } from "./+types/dashboard.page";
import { FeatureCard } from "~/components/feature-card";
import { useRoleStore } from "~/stores/role.store";

export const meta: Route.MetaFunction = () => [
  { title: "Dashboard | Caferium" },
  { name: "description", content: "select recipe or inventory menu" },
];

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const loginStatus = url.searchParams.get("login");
  const roleName = url.searchParams.get("role");
  return { loginStatus, roleName };
};

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const { loginStatus, roleName } = loaderData!;
  const { login, role } = useRoleStore();

  useEffect(() => {
    if (loginStatus === "success" && roleName) {
      login(roleName);
      console.log(`로그인 성공! 역할: ${roleName}`);

      // 중요: 이 로직은 새로고침 시에는 실행되지 않으므로,
      // 한 번 상태를 설정한 후 URL을 깔끔하게 정리하고 싶다면
      window.history.replaceState(null, "", "/dashboard");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h1 className="text-4xl font-bold text-amber-800 mb-4">
        {role === "staff" ? "시니어클럽 카페" : "시니어클럽 카페 관리"}
      </h1>
      <p className="text-lg text-stone-600 mb-10">
        원하시는 메뉴를 선택해주세요.
      </p>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {role === "admin" || role === "manager" ? (
          <>
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
          </>
        ) : null}
        <FeatureCard
          path="/dashboard/products"
          name={role === "staff" ? "상품" : "상품 관리"}
          description={
            <p className="text-stone-500">
              카페의 상품 정보를 조회하고
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
        <FeatureCard
          path="/dashboard/recipes"
          name={role === "staff" ? "레시피" : "레시피 관리"}
          description={
            <p className="text-stone-500">
              카페 음료와 디저트의 레시피를
              <br /> 확인하고 조회합니다.
            </p>
          }
          icon={
            <BookMarked
              size={48}
              className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
            />
          }
        />
        {role === "manager" ? (
          <FeatureCard
            path="/dashboard/stocks"
            name={"재고 그룹 관리"}
            description={
              <p className="text-stone-500">재고 그룹을 관리합니다.</p>
            }
            icon={
              <Archive
                size={48}
                className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
              />
            }
          />
        ) : null}
      </div>
    </div>
  );
}
