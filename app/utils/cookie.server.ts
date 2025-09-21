import { parse } from "cookie";

/**
 * HTTP 요청 헤더의 Cookie 문자열을 객체로 파싱합니다.
 * @param cookieString request.headers.get('Cookie')로부터의 값
 * @returns 파싱된 쿠키 객체
 */
// ✅ 함수의 반환 타입을 Record<string, string | undefined> 로 수정
export function parseCookie(
  cookieString: string | null | undefined
): Record<string, string | undefined> {
  return parse(cookieString || "");
}

/**
 * HTTP 요청 헤더의 Cookie 문자열을 객체로 파싱합니다.
 * @param cookieString request.headers.get('Cookie')로부터의 값
 * @returns 파싱된 쿠키 객체
 */
export function parseCookie2(
  cookieString: string | null | undefined
): Record<string, string> {
  const cookies: Record<string, string> = {};

  if (cookieString) {
    cookieString.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      const key = parts[0]?.trim();
      const value = parts.slice(1).join("=").trim();
      if (key) {
        // key와 value를 decode하여 원래 값으로 복원
        cookies[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
  }

  return cookies;
}
