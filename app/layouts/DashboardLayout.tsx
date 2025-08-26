import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "~/components/common/Sidebar";
import { useRoleStore } from "~/stores/role.store";

export default function DashboardLayout() {
  const navigate = useNavigate();
  // ✅ Zustand 스토어에서 로그인 상태를 가져옵니다.
  const { isLoggedIn } = useRoleStore();

  // ✅ 컴포넌트가 렌더링될 때 로그인 상태를 확인합니다.
  useEffect(() => {
    // 만약 로그인 상태가 아니라면
    if (!isLoggedIn) {
      // alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // ✅ 로그인 상태가 아닐 경우, 리다이렉트가 처리되기 전에
  // 자식 컴포넌트(Outlet)가 렌더링되는 것을 방지합니다.
  if (!isLoggedIn) {
    return null; // 또는 로딩 스피너와 같은 UI를 보여줄 수 있습니다.
  }

  // 로그인 상태일 경우에만 정상적으로 페이지를 보여줍니다.
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet /> {/* 대시보드 하위 페이지들이 여기에 렌더링됩니다 */}
      </div>
    </div>
  );
}
