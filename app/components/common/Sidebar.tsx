import { NavLink } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";
import { useMenuStore } from "~/stores/menu.store";
import { BookMarked, Archive } from "lucide-react";

export default function Sidebar() {
  const { role } = useRoleStore();
  const { isSidebarOpen, closeSidebar } = useMenuStore();

  const navLinkClass = `flex flex-col items-center justify-center gap-1 p-4 rounded-lg transition-colors duration-200`;
  const getActiveClass = (isActive: boolean) => {
    return isActive
      ? "bg-amber-600 text-white shadow-md"
      : "text-amber-700 hover:bg-amber-100";
  };

  return (
    <>
      {/* ✅ 오버레이 수정:
        - `bg-black bg-opacity-50` 대신 `bg-white/30` 같은 투명한 색상으로 시작하여
        - `backdrop-blur-sm`을 추가하여 뒤쪽 컨텐츠를 블러 처리합니다.
        - `md:hidden`을 유지하여 데스크탑에서는 오버레이가 나타나지 않게 합니다.
      */}
      <div
        className={`fixed inset-0 bg-white/30 backdrop-blur-sm z-30 transition-opacity md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      ></div>

      {/* ✅ 사이드바 수정:
        - `md:relative md:translate-x-0` 부분 제거: 데스크탑에서도 사이드바가 기본적으로 숨겨져 있도록 합니다.
        - `md:left-auto md:w-28 md:border-r` 등 데스크탑 고정 시 필요한 스타일은 Header나 DashboardLayout에서 컨텐츠 영역을 조절해야 합니다.
        - 현재 요구사항은 "햄버거 버튼 클릭할 때만 나오게 해줘"이므로, md에서도 기본 숨김으로 처리합니다.
      */}
      <aside
        className={`fixed top-0 left-0 h-full w-28 bg-white border-r border-gray-200 flex flex-col z-40
                   transform transition-transform ease-in-out duration-300 
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        // 데스크탑에서는 사이드바가 항상 보여야 한다면 이 부분을 다시 조절해야 합니다.
        // 예를 들어 md:flex-shrink-0 md:relative md:translate-x-0 같은 클래스가 필요할 수 있습니다.
        // 현재는 "햄버거 버튼 클릭할 때만 나오게" 요청에 따라 모바일/데스크탑 모두 초기 숨김입니다.
      >
        <div className="p-4 border-b flex items-center justify-center">
          <h2 className="text-xl font-bold text-center text-amber-800">메뉴</h2>
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <NavLink
            to="/dashboard/recipes"
            className={({ isActive }) =>
              `${navLinkClass} ${getActiveClass(isActive)}`
            }
            onClick={closeSidebar}
          >
            <BookMarked size={28} />
            <span className="text-xs font-semibold">레시피</span>
          </NavLink>

          {role === "manager" && (
            <NavLink
              to="/dashboard/inventory"
              className={({ isActive }) =>
                `${navLinkClass} ${getActiveClass(isActive)}`
              }
              onClick={closeSidebar}
            >
              <Archive size={28} />
              <span className="text-xs font-semibold">재고</span>
            </NavLink>
          )}
        </nav>
      </aside>
    </>
  );
}
