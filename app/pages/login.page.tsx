import { useState } from "react";
import { Form, redirect, useNavigation } from "react-router-dom";
import { Coffee, UserRound, Briefcase, LoaderCircle } from "lucide-react";

import { createClient } from "~/utils/supabase.server";
import type { Route } from "./+types/login.page";

export const meta: Route.MetaFunction = () => [
  { title: "Login | Caferium" },
  { name: "description", content: "sign-in with role and code" },
];

export const action = async ({ request }: Route.ActionArgs) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const formData = await request.formData();
  const roleName = formData.get("role");
  const roleCode = roleName === "manager" ? "MA" : "BA";
  const authCode = formData.get("auth");
  console.log("formData", formData);

  const { supabase } = createClient(request);
  const { data: users } = await supabase
    .from("users")
    .select()
    .eq("role", roleCode as string)
    .eq("auth_code", authCode as string);
  console.log("users", users);

  const exists = users && users.length > 0 ? true : false;
  if (exists && users && users[0]) {
    return redirect(
      `/dashboard?login=success&roleCode=${roleCode}&cafeId=${users[0].cafe_id}`
    );
  } else {
    return {
      message: "입장코드 정보가 올바르지 않습니다!",
    };
  }
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [selectedRole, setSelectedRole] = useState<"staff" | "manager">(
    "staff"
  );
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center h-full bg-amber-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl border-t-4 border-amber-600">
        <h1 className="text-3xl font-bold text-center text-amber-800 flex items-center justify-center gap-2">
          <Coffee className="text-amber-600" size={30} /> <span>카페리움</span>
        </h1>
        <Form method="post" className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              역할을 선택해 주세요.
            </label>
            <div className="flex items-center justify-around bg-amber-50 rounded-lg p-1.5 shadow-inner">
              <label
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md cursor-pointer transition-all duration-200 
                                ${
                                  selectedRole === "staff"
                                    ? "bg-amber-600 text-white shadow-md" // 선택 시 진한 커피색
                                    : "text-amber-700 hover:bg-amber-100" // 비선택 시 부드러운 커피색
                                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="BA"
                  checked={selectedRole === "staff"}
                  onChange={() => setSelectedRole("staff")}
                  className="sr-only"
                />
                <UserRound size={18} />
                바리스타
              </label>
              <label
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md cursor-pointer transition-all duration-200 
                                ${
                                  selectedRole === "manager"
                                    ? "bg-amber-600 text-white shadow-md" // 선택 시 진한 커피색
                                    : "text-amber-700 hover:bg-amber-100" // 비선택 시 부드러운 커피색
                                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="manager"
                  checked={selectedRole === "manager"}
                  onChange={() => setSelectedRole("manager")}
                  className="sr-only"
                />
                <Briefcase size={18} />
                매니저
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="password-input"
              className="block text-sm font-medium text-amber-800"
            >
              입장코드를 입력해 주세요.
            </label>
            <input
              type="password"
              id="password-input"
              name="auth"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-800 placeholder-amber-400" // 입력창 스타일 변경
              required
              placeholder="cafe로 시작하는 입장코드 입력"
            />
          </div>
          <div>
            {/* ✅ 로그인 버튼 색상을 다크 브라우니 톤으로 변경 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 font-bold text-white bg-amber-800 rounded-md hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 shadow-lg transition-colors"
            >
              {isSubmitting ? (
                <span className="flex justify-center items-center">
                  <LoaderCircle className="animate-spin" />
                </span>
              ) : (
                "로그인"
              )}
            </button>
            {actionData?.message && (
              <p className="text-sm text-red-500">{actionData.message}</p>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
