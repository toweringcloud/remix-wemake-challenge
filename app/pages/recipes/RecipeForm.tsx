import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";

// 재료 항목에 대한 인터페이스 정의
interface Ingredient {
  name: string;
  amount: string;
}

export default function RecipeFormPage() {
  const navigate = useNavigate();
  const { role } = useRoleStore();
  const { recipeId } = useParams<{ recipeId: string }>();

  // ✅ 권한 확인 로직
  useEffect(() => {
    if (role !== "manager") {
      alert("접근 권한이 없습니다.");
      navigate("/dashboard"); // 대시보드 홈으로 리다이렉트
    }
  }, [role, navigate]);

  // recipeId가 있으면 수정 모드, 없으면 생성 모드
  const isEditMode = Boolean(recipeId);

  // 각 state의 타입을 명확하게 지정
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "" },
  ]);
  const [steps, setSteps] = useState<string[]>([""]);

  useEffect(() => {
    if (isEditMode) {
      // API 호출로 기존 데이터를 가져온다고 가정
      const fetchedData = {
        name: "카페라떼",
        description: "부드러운 우유와 에스프레소의 완벽한 조화",
        ingredients: [
          { name: "에스프레소", amount: "2샷" },
          { name: "우유", amount: "200ml" },
        ],
        steps: [
          "잔에 에스프레소 2샷을 추출합니다.",
          "우유 200ml를 스팀합니다.",
        ],
      };
      setName(fetchedData.name);
      setDescription(fetchedData.description);
      setIngredients(fetchedData.ingredients);
      setSteps(fetchedData.steps);
    }
  }, [isEditMode, recipeId]);

  // 재료 관련 핸들러 (매개변수 타입 지정)
  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const newIngredients = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    setIngredients(newIngredients);
  };
  const addIngredient = () =>
    setIngredients([...ingredients, { name: "", amount: "" }]);
  const removeIngredient = (index: number) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  // 만드는 법 관련 핸들러 (매개변수 타입 지정)
  const handleStepChange = (index: number, value: string) => {
    const newSteps = steps.map((step, i) => (i === index ? value : step));
    setSteps(newSteps);
  };
  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index: number) =>
    setSteps(steps.filter((_, i) => i !== index));

  // 폼 제출 핸들러 (이벤트 객체 타입 지정)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { name, description, ingredients, steps };
    console.log("Form Data Submitted:", formData);
    alert(
      isEditMode ? "레시피가 수정되었습니다." : "새 레시피가 등록되었습니다."
    );
    navigate("/dashboard/recipes");
  };

  // ✅ 매니저가 아닐 경우, 리다이렉트 되기 전까지 로딩 또는 null을 반환하여 UI 렌더링을 방지
  if (role !== "manager") {
    return null; // 또는 <p>권한 확인 중...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "레시피 수정" : "새 레시피 등록"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        {/* 레시피 이름, 설명 */}
        <div>
          <label htmlFor="name" className="block text-lg font-bold mb-2">
            레시피 이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-lg font-bold mb-2">
            간단한 설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            className="w-full p-2 border rounded"
            rows={3}
          ></textarea>
        </div>

        {/* 재료 관리 */}
        <div>
          <h2 className="text-lg font-bold mb-2">재료</h2>
          {ingredients.map((ing, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="재료명 (예: 우유)"
                value={ing.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="수량 (예: 200ml)"
                value={ing.amount}
                onChange={(e) =>
                  handleIngredientChange(index, "amount", e.target.value)
                }
                className="w-1/2 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="bg-red-500 text-white px-3 py-2 rounded"
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 bg-gray-200 text-black py-2 px-4 rounded"
          >
            + 재료 추가
          </button>
        </div>

        {/* 만드는 법 관리 */}
        <div>
          <h2 className="text-lg font-bold mb-2">만드는 법</h2>
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <span className="font-bold">{index + 1}.</span>
              <textarea
                placeholder="만드는 법 단계 입력"
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                className="w-full p-2 border rounded"
                rows={2}
              ></textarea>
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="bg-red-500 text-white px-3 py-2 rounded"
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="mt-2 bg-gray-200 text-black py-2 px-4 rounded"
          >
            + 단계 추가
          </button>
        </div>

        {/* 최종 제출 버튼 */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/dashboard/recipes")}
            className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600"
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            {isEditMode ? "수정 완료" : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
