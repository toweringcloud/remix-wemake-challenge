import { ChevronLeft, Loader, Save, Trash2, XCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  type ActionFunctionArgs,
  type ActionFunction,
  type LoaderFunctionArgs,
  type LoaderFunction,
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";

import type { Route } from "./+types/recipe-form.page";
import { getCookieSession } from "~/lib/cookie.server";
import { createClient } from "~/lib/supabase.server";
import { useRoleStore } from "~/stores/user.store";

export const meta: Route.MetaFunction = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const isEditMode = Boolean(recipeId);
  return [
    { title: `Recipe ${isEditMode ? "Edit" : "Add"} | Caferium` },
    { name: "description", content: "add new recipe or modify one" },
  ];
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

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const session = getCookieSession(request.headers.get("Cookie"));
  if (!session?.cafeId) return redirect("/login");
  const cafeId = session.cafeId;

  const { recipeId } = params;
  if (!recipeId) return {};
  console.log("recipe-form.menuId", cafeId, recipeId);

  const { supabase } = createClient(request);
  const { data } = await supabase
    .from("recipes")
    .select(
      `
      *,
      menus(id, description, image_url, image_thumb_url),
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
    imageThumbUrl: data.menus.image_thumb_url,
    videoUrl: data.video,
    updatedAt: data.updated_at,
  };
  // console.log("recipe-form.R", recipe);
  return { recipe };
};

export const action: ActionFunction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  try {
    const session = getCookieSession(request.headers.get("Cookie"));
    if (!session?.cafeId) return redirect("/login");
    const cafeId = session.cafeId;

    const formData = await request.formData();
    const actionType = formData.get("actionType");
    console.log("recipe-form.action", cafeId, actionType);

    if (!actionType || !["C", "U", "D"].includes(actionType.toString())) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid action type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { recipeId: menuId } = params;
    if (!menuId) throw new Response("Menu ID not found", { status: 404 });
    console.log("recipe-form", menuId, Object.fromEntries(formData.entries()));

    // Zod를 사용한 유효성 검사 (선택 사항이지만 권장)
    const steps = JSON.parse(formData.get("steps") as string) as string[];
    const ingredients = JSON.parse(
      formData.get("ingredients") as string
    ) as Ingredient[];

    const { supabase } = createClient(request);

    // 1. recipes 테이블에서 현재 레시피의 기본 키(id)를 조회합니다.
    // const { data: recipeData, error: recipeFetchError } = await supabase
    //   .from("recipes")
    //   .select("id")
    //   .eq("menu_id", menuId)
    //   .eq("cafe_id", cafeId)
    //   .single();

    // if (recipeFetchError) throw recipeFetchError;
    // const recipePK = recipeData.id;
    const recipePK = menuId;

    // 2. 레시피 기본 정보(단계)를 업데이트합니다.
    const { error: updateRecipeError } = await supabase
      .from("recipes")
      .update({ steps })
      .eq("menu_id", recipePK);

    if (updateRecipeError) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: updateRecipeError.message || "레시피 단계 정보 업데이트 실패",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 3. 기존 재료 정보를 모두 삭제합니다.
    const { error: deleteLinkError } = await supabase
      .from("recipe_ingredients")
      .delete()
      .eq("recipe_id", recipePK);

    if (deleteLinkError) {
      return new Response(
        JSON.stringify({ ok: false, error: deleteLinkError.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 4. 새로운 재료 정보를 다시 추가합니다.
    // (재료가 ingredients 테이블에 없으면 생성, 있으면 사용 - upsert)
    for (const ing of ingredients) {
      if (!ing.name || !ing.amount) continue; // 빈 재료는 건너뛰기

      // 4-1. ingredients 테이블에 재료 upsert
      const { data: ingData, error: upsertIngError } = await supabase
        .from("ingredients")
        .upsert(
          { name: ing.name.trim(), cafe_id: cafeId },
          { onConflict: "cafe_id, name" } // DB에 설정한 UNIQUE 제약 조건 컬럼들
        )
        .select("id")
        .single();

      if (upsertIngError) {
        return new Response(
          JSON.stringify({ ok: false, error: upsertIngError.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // 4-2. recipe_ingredients 연결 테이블에 데이터 insert
      const { error: insertLinkError } = await supabase
        .from("recipe_ingredients")
        .insert({
          recipe_id: recipePK,
          ingredient_id: ingData.id,
          quantity: ing.amount.trim(),
        });

      if (insertLinkError) {
        return new Response(
          JSON.stringify({ ok: false, error: insertLinkError.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // 모든 작업 성공
    console.log(`products.U: cafe(${cafeId}), recipe(${menuId})`);
    return new Response(
      JSON.stringify({
        ok: true,
        message: "레시피가 성공적으로 수정되었습니다.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (outerError: any) {
    // ✅ 모든 예외를 최종적으로 catch
    console.error("Unhandled error in action function:", outerError);
    return new Response(
      JSON.stringify({
        ok: false,
        error: "서버 내부 오류 발생. 콘솔을 확인하세요.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export default function RecipeFormPage() {
  const { roleCode, isLoading } = useRoleStore();
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  // 레시피 상세 조회 (recipeId가 있으면 수정 모드, 없으면 생성 모드)
  const { recipe } = useLoaderData<Recipe>();
  const actionData = useActionData<{
    ok: boolean;
    message?: string;
    error?: string;
  }>();
  const isEditMode = Boolean(recipeId);
  console.log("recipe.loaderData", recipe, isEditMode);

  // 각 state의 타입을 명확하게 지정
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 폼 제출이 완료되었는지 확인
  const isSubmitting = navigation.state === "submitting";

  // action 결과에 따라 토스트 메시지 표시
  useEffect(() => {
    if (actionData) {
      if (actionData.ok) {
        toast.success("레시피 관리", { description: actionData.message });
        navigate(`/dashboard/recipes/${recipeId}`);
      } else {
        toast.error("레시피 관리", { description: actionData.error });
      }
    }
  }, [actionData, navigate]);

  // 수정 모드일 때 데이터 채우기
  useEffect(() => {
    if (isEditMode && recipe) {
      setName(recipe.name);
      setDescription(recipe.description);
      setIngredients(
        recipe.ingredients.length > 0
          ? recipe.ingredients
          : [{ name: "", amount: "" }]
      );
      setSteps(recipe.steps.length > 0 ? recipe.steps : [""]);
    }
  }, [isEditMode, recipe]);

  // 권한 확인 및 초기 데이터 설정
  useEffect(() => {
    if (isLoading || roleCode === null) {
      return;
    }
    if (!["SA", "MA"].includes(roleCode)) {
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

  // 폼 제출 핸들러 (디버깅용)
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submission started!");
    const formData = new FormData(event.currentTarget);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  };

  if (!recipe || !roleCode) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6 text-amber-800">
          {isEditMode ? name : "새 레시피 등록"}
        </h1>
        <div className="flex space-x-3">
          <Link to="/dashboard/recipes">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white font-bold py-2 px-2 rounded-lg hover:bg-gray-600"
            >
              <ChevronLeft className="h-6 w-6" />
              {""}
            </button>
          </Link>
        </div>
      </div>
      <Form
        method="post"
        onSubmit={handleFormSubmit} // 디버깅용 코드 유지
        className="bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <input type="hidden" name="actionType" value="U" />
        <input type="hidden" name="steps" value={JSON.stringify(steps)} />
        <input
          type="hidden"
          name="ingredients"
          value={JSON.stringify(ingredients)}
        />

        {/* 레시피 이름, 설명 */}
        <div className="flex items-start justify-between">
          {/* Left side: Description */}
          <div className="grow pr-4">
            {/* Add padding to the right */}
            <label
              htmlFor="description"
              className="block text-lg font-bold mb-2"
            >
              메뉴 설명
            </label>
            <span className="text-sm text-gray-800">{description}</span>
          </div>

          {/* Right side: Thumbnail Image */}
          {recipe.imageThumbUrl && (
            <div
              className="w-24 h-24 shrink-0"
              onClick={() => setIsModalOpen(true)}
            >
              {/* Fixed size for thumbnail */}
              <img
                src={recipe.imageThumbUrl}
                alt={name}
                className="w-full h-full object-cover rounded-md border-0"
              />
            </div>
          )}
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
        <div className="flex justify-end space-x-4 pt-0">
          <Button
            type="button"
            variant="outline"
            className="group flex items-center gap-1 hover:text-red-600 hover:border-red-600 transition-colors"
            onClick={() => navigate("/dashboard/recipes")}
          >
            <XCircle className="h-4 w-4" />
            취소
          </Button>
          <Button
            type="submit"
            className="group flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white transition-colors"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "저장 중..." : "저장"}
          </Button>
        </div>
      </Form>

      {/* --- Image Modal --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-xl p-0 border-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Adjust max-w-* as needed */}
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={name}
              className="w-full h-auto object-contain cursor-pointer rounded-lg shadow-xl"
              onClick={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
