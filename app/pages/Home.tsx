import { useNavigate } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";

export default function HomePage() {
  const navigate = useNavigate();
  // ✅ Zustand 스토어에서 로그인 상태를 가져옵니다.
  const { isLoggedIn } = useRoleStore();

  const handleStart = () => {
    // ✅ 로그인 상태를 확인하여 분기 처리합니다.
    if (isLoggedIn) {
      navigate("/dashboard"); // 로그인 되어 있으면 대시보드로 이동
    } else {
      navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 이동
    }
  };

  return (
    <div className="text-center py-24">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
        시니어클럽 카페 관리를 시작해보세요!
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        간편하게 레시피를 만들고, 재료 재고를 추적하여 똑똑한 카페 운영을
        시작하세요.
      </p>
      <button
        onClick={handleStart}
        className="mt-8 inline-block bg-blue-600 text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
      >
        시작하기
      </button>
    </div>
  );
}
