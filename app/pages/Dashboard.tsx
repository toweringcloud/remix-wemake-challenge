import { Link } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";

export default function DashboardPage() {
  const { role } = useRoleStore();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        시니어클럽 {role === "staff" ? "카페" : "카페 관리"}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        원하시는 관리 메뉴를 선택해주세요.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 레시피 관리 카드 */}
        <Link
          to="/dashboard/recipes"
          className="group block p-8 bg-blue-500 rounded-xl text-white text-center shadow-lg hover:bg-blue-600 transition-all transform hover:-translate-y-1"
        >
          <h2 className="text-4xl font-bold mb-2">
            {role === "staff" ? "레시피" : "레시피 관리"}
          </h2>
          <p>
            카페 음료와 디저트의 레시피를
            <br /> 확인하고 조회합니다.
          </p>
        </Link>

        {/* 재고 관리 카드 */}
        {/* ✅ role이 'manager'일 때만 재고 관리 카드를 렌더링합니다. */}
        {role === "manager" && (
          <Link
            to="/dashboard/inventory"
            className="group block p-8 bg-green-500 rounded-xl text-white text-center shadow-lg hover:bg-green-600 transition-all transform hover:-translate-y-1"
          >
            <h2 className="text-4xl font-bold mb-2">재고 관리</h2>
            <p className="text-green-100">
              원두, 우유, 시럽 등<br /> 각종 재료의 재고를 관리합니다.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
