import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";

export default function RootLayout() {
  return (
    // ✅ flex 컨테이너로 변경하고, 화면 전체 높이를 차지하도록 설정
    <div className="flex flex-col h-screen">
      <Header />
      {/* ✅ flex-1을 추가하여 헤더를 제외한 모든 수직 공간을 채우도록 설정 */}
      {/* ✅ overflow-y-auto는 로그인 페이지 외 다른 페이지에서 내용이 길어질 경우를 대비 */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
