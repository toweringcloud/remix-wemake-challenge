import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";
import { Coffee, UserRound, Briefcase } from "lucide-react";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"staff" | "manager">(
    "staff"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useRoleStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (selectedRole === "manager" && password === "cafem001") {
      login("manager");
      navigate("/dashboard");
    } else if (selectedRole === "staff" && password === "cafeb001") {
      login("staff");
      navigate("/dashboard");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-amber-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl border-t-4 border-amber-600">
        <h1 className="text-3xl font-bold text-center text-amber-800 flex items-center justify-center gap-2">
          <Coffee className="text-amber-600" size={30} /> <span>카페리움</span>
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              역할 선택
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
                  value="staff"
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
              비밀번호
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-800 placeholder-amber-400" // 입력창 스타일 변경
              required
              placeholder="비밀번호 입력"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            {/* ✅ 로그인 버튼 색상을 다크 브라우니 톤으로 변경 */}
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-amber-800 rounded-md hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 shadow-lg transition-colors"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
