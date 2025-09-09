import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "~/components/layout/sidebar";
import { useRoleStore } from "~/stores/role.store";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { isLoggedIn } = useRoleStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 bg-amber-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
