import { NavLink } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";
import { useMenuStore } from "~/stores/menu.store";

export default function Sidebar() {
  const { role } = useRoleStore();
  const { isSidebarOpen, closeSidebar } = useMenuStore();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 text-lg ${
      isActive
        ? "bg-blue-600 text-white font-bold shadow-md"
        : "text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar} // 배경 클릭 시 닫히도록 toggle 대신 close 사용
        aria-hidden="true"
      ></div>
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-center">관리 메뉴</h2>
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <NavLink
            to="/dashboard/recipes"
            className={navLinkClass}
            onClick={closeSidebar}
          >
            <span>{role === "staff" ? "레시피" : "레시피 관리"}</span>
          </NavLink>
          {/* ✅ role이 'manager'일 때만 재고 관리 메뉴를 렌더링합니다. */}
          {role === "manager" && (
            <NavLink to="/dashboard/inventory" className={navLinkClass}>
              <span>재고 관리</span>
            </NavLink>
          )}
        </nav>
      </aside>
    </>
  );
}
