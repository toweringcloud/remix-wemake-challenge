import { useEffect, useState } from "react";
import {
  Link,
  redirect,
  useLoaderData,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "react-router-dom";

import type { Route } from "./+types/recipe-detail.page";
import { PlaceholderImage } from "~/components/common/placeholder-image";
import { getCookieSession } from "~/lib/cookie.server";
import { createClient } from "~/lib/supabase.server";
import { useRoleStore } from "~/stores/user.store";

export const meta: Route.MetaFunction = () => [
  { title: "Recipe Detail | Caferium" },
  {
    name: "description",
    content: "recipe detail",
  },
];

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const session = getCookieSession(request.headers.get("Cookie"));
  if (!session) throw new Response("Unauthorized", { status: 401 });
  if (!session?.cafeId) return redirect("/login");
  const cafeId = session.cafeId;
  console.log("recipe-detail.cafeId", cafeId);

  const { recipeId } = params;
  console.log("recipe-detail.menuId", recipeId);

  const { supabase } = createClient(request);
  const { data } = await supabase
    .from("recipes")
    .select(
      `
      *,
      menus(id, image_url, image_thumb_url),
      recipe_ingredients (
        quantity,
        ingredients (
          name
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
    description: data.description,
    ingredients: data.recipe_ingredients.map((i: any) => ({
      name: i.ingredients.name,
      amount: i.quantity,
    })),
    steps: data.steps,
    imageUrl: data.menus.image_thumb_url,
    videoUrl: data.video_url,
    updatedAt: data.updated_at,
  };
  console.log("recipe-detail.R", recipe);
  return { recipe };
};

// 레시피(Recipe) 타입 정의
type Recipe = {
  id: number;
  name: string;
  description: string;
  ingredients: [{ name: string; quantity: string }];
  steps: string[];
  [key: string]: any;
};

export default function RecipeDetailPage() {
  const { roleCode } = useRoleStore();

  // const { recipe } = useLoaderData<typeof loader>();
  const { recipe } = useLoaderData<Recipe>();
  console.log("recipe.loaderData", recipe);

  // ✅ 이미지 로딩 실패를 기억하기 위한 state
  const [hasLoadError, setHasLoadError] = useState(false);

  // ✅ imageUrl prop이 변경될 때마다 에러 상태를 초기화
  useEffect(() => {
    setHasLoadError(false);
  }, [recipe.imageUrl]);

  // ✅ 이미지가 없거나 로드 에러가 발생했는지 확인
  // const showFallback = hasLoadError || !recipe.videoUrl;
  const showFallback = hasLoadError || !recipe.imageUrl;

  if (!recipe) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">레시피를 찾을 수 없습니다.</h1>
        <Link
          to="/dashboard/recipes"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{recipe.name}</h1>
        <div className="flex space-x-3">
          <Link to="/dashboard/recipes">
            <button className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600">
              목록
            </button>
          </Link>
          {/* 매니저일 경우에만 '수정하기' 버튼이 보입니다. */}
          {roleCode === "MA" && (
            <Link to={`/dashboard/recipes/${recipe.id}/edit`}>
              <button className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700">
                수정
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* ✅ 가로 모드(md 이상)에서 Flex 레이아웃 적용 */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-amber-200 flex flex-col md:flex-row gap-6">
        {/* ✅ 이미지 섹션 (좌측 40%) */}
        <div
          // ✅ 모바일(기본)에서는 aspect-square, md 이상에서는 aspect-auto로 변경
          className="md:w-2/5 flex-shrink-0 flex items-center justify-center bg-stone-50 rounded-lg overflow-hidden border border-amber-100 
                     aspect-square md:aspect-auto w-full"
        >
          {showFallback ? (
            <PlaceholderImage text={recipe.name} />
          ) : (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover"
              onError={() => setHasLoadError(true)}
            />
          )}
        </div>

        {/* ✅ 데이터 섹션 (우측 60%) */}
        <div className="md:w-3/5 flex-grow space-y-6">
          <p className="text-lg text-stone-600">{recipe.description}</p>
          {/* 재료 섹션 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4">
              필요한 재료
            </h2>
            <ul className="list-disc list-inside space-y-2">
              {recipe.ingredients.map(
                (ing: { name: string; amount: number }, index: number) => (
                  <li key={index} className="text-gray-700">
                    <span className="font-semibold">{ing.name}</span>:{" "}
                    {ing.amount}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* 만드는 법 섹션 */}
          <div>
            <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4">
              만드는 법
            </h2>
            <ol className="list-decimal list-inside space-y-3">
              {recipe.steps.map((step: string, index: number) => (
                <li
                  key={index}
                  className="text-gray-700 leading-relaxed text-sm"
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
