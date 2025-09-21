import { redirect } from "react-router-dom";
import type { ActionFunction } from "react-router-dom";

export const action: ActionFunction = async () => {
  // ✅ 리디렉션 응답을 위한 헤더 생성
  const headers = new Headers();

  // ✅ 'session' 쿠키를 삭제하기 위해 Max-Age=0으로 설정
  headers.append(
    "Set-Cookie",
    `session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );

  // ✅ 헤더와 함께 로그인 페이지로 리디렉션
  return redirect("/login", { headers });
};
