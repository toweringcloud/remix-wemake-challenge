import { Form, Link, NavLink } from "react-router-dom";
import {
  Menu,
  Coffee,
  LogOut,
  BookMarked,
  Archive,
  CookingPot,
  ShoppingCart,
} from "lucide-react";

import { useCafeStore } from "~/stores/cafe.store";
import { useMenuStore } from "~/stores/menu.store";
import { useRoleStore } from "~/stores/user.store";

export default function Header() {
  const { isLoggedIn, roleCode } = useRoleStore();
  const { name: cafeName } = useCafeStore();
  const { toggleSidebar } = useMenuStore();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${
      isActive
        ? "bg-amber-600 text-white font-semibold"
        : "text-amber-700 hover:bg-amber-100"
    }`;

  if (!roleCode) return null;

  return (
    <header className="bg-white/70 backdrop-blur-sm border-b border-amber-200 z-20 relative">
      <div className="container mx-auto px-0 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isLoggedIn && (
            <button
              onClick={toggleSidebar}
              className="md:hidden p-1 rounded-md text-amber-700 hover:bg-amber-100"
              aria-label="메뉴 열기"
            >
              <Menu size={24} />
            </button>
          )}
          <Link
            to={isLoggedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2 text-xl font-bold text-amber-800"
          >
            <Coffee className="text-amber-700" />
            <span>{cafeName || "카페리움"}</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-2">
          {isLoggedIn && (
            <>
              {roleCode === "SA" ? (
                <NavLink to="/dashboard/cafe" className={navLinkClass}>
                  <BookMarked size={18} />
                  <span>{"카페"}</span>
                </NavLink>
              ) : null}
              {["SA", "MA"].includes(roleCode) ? (
                <NavLink to="/dashboard/products" className={navLinkClass}>
                  <ShoppingCart size={18} />
                  <span>{"상품"}</span>
                </NavLink>
              ) : null}
              <NavLink to="/dashboard/recipes" className={navLinkClass}>
                <CookingPot size={18} />
                <span>{"레시피"}</span>
              </NavLink>
              <NavLink to="/dashboard/stocks" className={navLinkClass}>
                <Archive size={18} />
                <span>{"재고"}</span>
              </NavLink>

              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="cursor-pointer flex items-center gap-2 text-amber-700 hover:bg-amber-100 font-semibold py-2 px-3 rounded-md transition-colors"
                >
                  <LogOut size={16} />
                  <span>로그아웃</span>
                </button>
              </Form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
