import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

import type { Route } from "./+types/root.layout";
import Header from "~/components/layout/header";
import { useRoleStore } from "~/stores/user.store";
import { parseCookie } from "~/lib/cookie.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
    const cookies = parseCookie(request.headers.get("Cookie"));
    const session = JSON.parse(
      Buffer.from(cookies.session || "", "base64").toString()
    );
    return { session };
  } catch (error) {
    return { session: null }; // ✅ json() 없이 객체 반환
  }
};

export default function RootLayout() {
  const { session } = useLoaderData<typeof loader>();
  const { login, logout, isLoggedIn } = useRoleStore();

  useEffect(() => {
    // 로더 데이터에 세션 정보가 있고, Zustand 상태가 아직 로그인 상태가 아닐 때
    if (session && !isLoggedIn) {
      login(session.cafeId, session.roleCode);
    }
    // 로더 데이터에 세션 정보가 없는데, Zustand 상태는 로그인 상태일 때 (예: 쿠키 만료)
    else if (!session && isLoggedIn) {
      logout();
    }
  }, [session, login, logout, isLoggedIn]);

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
