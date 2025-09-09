import { BookMarked, Archive } from "lucide-react";

import type { Route } from "./+types/dashboard.page";
import { MenuCard } from "~/components/menu-card";
import { useRoleStore } from "~/stores/role.store";

export const meta: Route.MetaFunction = () => [
  { title: "Dashboard | Caferium" },
  { name: "description", content: "select recipe or inventory menu" },
];

export default function DashboardPage() {
  const { role } = useRoleStore();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h1 className="text-4xl font-bold text-amber-800 mb-4">
        {role === "staff" ? "시니어클럽 카페" : "시니어클럽 카페 관리"}
      </h1>
      <p className="text-lg text-stone-600 mb-10">
        원하시는 메뉴를 선택해주세요.
      </p>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <MenuCard
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
        {role === "manager" && (
          <MenuCard
            path="/dashboard/inventory"
            name="재고 관리"
            description={
              <p className="text-stone-500">
                원두, 우유, 시럽 등<br /> 각종 재료의 재고를 관리합니다.
              </p>
            }
            icon={
              <Archive
                size={48}
                className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
              />
            }
          />
        )}
      </div>
    </div>
  );
}
