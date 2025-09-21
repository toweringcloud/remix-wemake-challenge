import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

import type { Route } from "./+types/root.layout";
import Header from "~/components/layout/header";
import { useRoleStore } from "~/stores/user.store";
import { parseCookie } from "~/utils/cookie.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  // const cookieHeader = request.headers.get("Cookie");
  // const cookies = cookieHeader ? parse(cookieHeader) : {};
  // const sessionCookie = cookies.session;

  // if (sessionCookie) {
  //   try {
  //     // Base64 디코딩 후 JSON 파싱
  //     const sessionData = JSON.parse(
  //       Buffer.from(sessionCookie, "base64").toString()
  //     );
  //     return { session: sessionData };
  //   } catch (error) {
  //     // 쿠키 파싱 실패 시
  //     return { session: null };
  //   }
  // }
  // return { session: null };
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
      // Zustand 스토어의 login 액션을 호출하여 상태를 동기화
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
