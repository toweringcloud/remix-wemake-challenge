import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  Form,
  type LoaderFunctionArgs,
  type LoaderFunction,
  useLoaderData,
  redirect,
} from "react-router-dom";
import { Save, Trash2, XCircle } from "lucide-react";

import type { Route } from "./+types/recipe-form.page";
import { getCookieSession } from "~/lib/cookie.server";
import { createClient } from "~/lib/supabase.server";
import { useRoleStore } from "~/stores/user.store";

export const meta: Route.MetaFunction = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const isEditMode = Boolean(recipeId);
  return [
    { title: `Recipe ${isEditMode ? "Modify" : "Add"} | Caferium` },
    { name: "description", content: "add new recipe or modify one" },
  ];
};

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const session = getCookieSession(request.headers.get("Cookie"));
  if (!session) throw new Response("Unauthorized", { status: 401 });
  if (!session?.cafeId) return redirect("/login");
  const cafeId = session.cafeId;
  console.log("recipe-form.cafeId", cafeId);

  const { recipeId } = params;
  console.log("recipe-form.menuId", recipeId);

  // 레시피 등록
  if (!recipeId) return {};

  const { supabase } = createClient(request);
  const { data } = await supabase
    .from("recipes")
    .select(
      `
      *,
      menus(id, description, image_url),
      recipe_ingredients (
        quantity,
        ingredients (
          id, name
        )
      )
    `
    )
    .eq("cafe_id", cafeId)
    .eq("menu_id", recipeId)
    .single();

  if (!data) {
    throw new Response("Recipe Not Found", { status: 404 });
  }

  const recipe: Recipe = {
    id: data.menus.id,
    name: data.name,
    description: data.menus.description,
    ingredients: data.recipe_ingredients.map((i: any) => ({
      id: i.ingredients.id,
      name: i.ingredients.name,
      amount: i.quantity,
    })),
    steps: data.steps,
    imageUrl: data.menus.image_url,
    videoUrl: data.video,
    updatedAt: data.updated_at,
  };
  console.log("recipe-form.R", recipe);
  return { recipe };
};

// 레시피 타입 정의
type Recipe = {
  id: number;
  name: string;
  description: string;
  ingredients: [{ name: string; quantity: string }];
  steps: string[];
  [key: string]: any;
};

// 재료 타입 정의
interface Ingredient {
  id?: number;
  name: string;
  amount: string;
}

export default function RecipeFormPage() {
  const navigate = useNavigate();
  const { roleCode } = useRoleStore();
  const { recipeId } = useParams<{ recipeId: string }>();

  // 레시피 상세 조회 (recipeId가 있으면 수정 모드, 없으면 생성 모드)
  const { recipe } = useLoaderData<Recipe>();
  const isEditMode = Boolean(recipeId);
  console.log("recipe.loaderData", recipe, isEditMode);

  // 각 state의 타입을 명확하게 지정
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<string[]>([""]);

  useEffect(() => {
    if (roleCode !== "MA") {
      alert("접근 권한이 없습니다.");
      navigate("/dashboard");
    }

    // ✅ 수정 모드일 때, URL의 ID를 사용해 올바른 데이터를 불러옵니다.
    if (isEditMode) {
      const recipeToEdit = recipe;
      if (recipeToEdit) {
        setName(recipeToEdit.name);
        setDescription(recipeToEdit.description);
        setIngredients(recipeToEdit.ingredients);
        setSteps(recipeToEdit.steps);
      }
    }
  }, [isEditMode, recipeId, roleCode, navigate]);

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
  if (roleCode !== "MA") {
    return null; // 또는 <p>권한 확인 중...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-amber-800">
        {isEditMode ? name : "새 레시피 등록"}
      </h1>

      <Form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        {/* 레시피 이름, 설명 */}
        <div>
          <label htmlFor="description" className="block text-lg font-bold mb-2">
            메뉴 설명
          </label>
          <span className="text-sm text-gray-800">{description}</span>
        </div>

        {/* 재료 관리 */}
        <div>
          <h2 className="text-lg font-bold mb-2">필요한 재료</h2>
          {ingredients.map((ing, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 mb-2 text-sm"
            >
              <input
                type="text"
                placeholder="재료명 (예: 우유)"
                value={ing.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                className="w-1/2 p-2 border rounded"
                autoComplete="off"
              />
              <input
                type="text"
                placeholder="수량 (예: 200ml)"
                value={ing.amount}
                onChange={(e) =>
                  handleIngredientChange(index, "amount", e.target.value)
                }
                className="w-1/2 p-2 border rounded"
                autoComplete="off"
              />
              <button
                type="button"
                title="삭제"
                onClick={() => removeIngredient(index)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 text-sm text-amber-700 bg-amber-100 hover:bg-amber-200 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            + 재료 추가
          </button>
        </div>

        {/* 만드는 법 관리 */}
        <div>
          <h2 className="text-lg font-bold mb-2">만드는 법</h2>
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 mb-2 text-sm"
            >
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
                title="삭제"
                onClick={() => removeStep(index)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="mt-2 text-sm text-amber-700 bg-amber-100 hover:bg-amber-200 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            + 단계 추가
          </button>
        </div>

        {/* 최종 제출 버튼 */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/dashboard/recipes")}
            // ✅ 보조 버튼 스타일로 변경
            className="bg-white text-gray-700 border border-gray-300 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <XCircle size={18} />
            취소
          </button>
          <button
            type="submit"
            // ✅ amber 색상으로 변경
            className="bg-amber-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            {isEditMode ? "수정 완료" : "등록하기"}
          </button>
        </div>
      </Form>
    </div>
  );
}
