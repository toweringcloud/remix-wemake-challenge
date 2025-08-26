import { Menu, Coffee, LogOut, BookMarked, Archive } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";
import { useMenuStore } from "~/stores/menu.store";

export default function Header() {
  const { isLoggedIn, role, logout } = useRoleStore();
  const { toggleSidebar } = useMenuStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md z-20 relative">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isLoggedIn && (
            <button
              onClick={toggleSidebar}
              className="md:hidden p-1 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="메뉴 열기"
            >
              {/* ✅ 햄버거 메뉴 아이콘 적용 */}
              <Menu size={24} />
            </button>
          )}
          <Link
            to={isLoggedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2 text-xl font-bold text-gray-800"
          >
            {/* ✅ 로고 아이콘 적용 */}
            <Coffee className="text-blue-600" />
            <span>
              {role === "staff" ? "시니어클럽 카페" : "시니어클럽 카페 관리"}
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          {isLoggedIn && (
            <>
              <NavLink
                to="/dashboard/recipes"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                {/* ✅ 레시피 관리 아이콘 적용 */}
                <BookMarked size={18} />
                <span>{role === "staff" ? "레시피" : "레시피 관리"}</span>
              </NavLink>

              {role === "manager" && (
                <NavLink
                  to="/dashboard/inventory"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                >
                  {/* ✅ 재고 관리 아이콘 적용 */}
                  <Archive size={18} />
                  <span>재고 관리</span>
                </NavLink>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
              >
                {/* ✅ 로그아웃 아이콘 적용 */}
                <LogOut size={16} />
                <span>로그아웃</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
