import { Link } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";
import { BookMarked, Archive } from "lucide-react"; // 아이콘 import

export default function DashboardHomePage() {
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
        <Link
          to="/dashboard/recipes"
          className="group block p-8 bg-white rounded-xl text-center shadow-lg border border-amber-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          <BookMarked
            size={48}
            className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
          />
          <h2 className="text-3xl font-bold mb-2 text-amber-800">
            {role === "staff" ? "레시피" : "레시피 관리"}
          </h2>
          <p className="text-stone-500">
            카페 음료와 디저트의 레시피를
            <br /> 확인하고 조회합니다.
          </p>
        </Link>

        {role === "manager" && (
          <Link
            to="/dashboard/inventory"
            className="group block p-8 bg-white rounded-xl text-center shadow-lg border border-amber-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <Archive
              size={48}
              className="mx-auto mb-4 text-amber-600 group-hover:scale-110 transition-transform"
            />
            <h2 className="text-3xl font-bold mb-2 text-amber-800">
              재고 관리
            </h2>
            <p className="text-stone-500">
              원두, 우유, 시럽 등<br /> 각종 재료의 재고를 관리합니다.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
