import { Link, useParams } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";
import { recipesData } from "~/data/recipes.data";
import type { Route } from "./+types/recipe-detail.page";
import { PlaceholderImage } from "~/components/common/placeholder-image";
import { useEffect, useState } from "react";

export const meta: Route.MetaFunction = () => [
  { title: "Recipe Detail | Caferium" },
  {
    name: "description",
    content: "show detail information on a selected recipe",
  },
];

export default function RecipeDetailPage() {
  const { roleCode } = useRoleStore();
  const { recipeId } = useParams();

  // 실제 앱에서는 useParams의 recipeId를 사용해 API로 데이터를 가져옵니다.
  // ✅ URL의 recipeId와 일치하는 레시피를 데이터 배열에서 찾습니다.
  const recipe = recipesData.find((r) => r.id === recipeId);

  if (!recipe) {
    return (
      <div className="p-6 text-center text-lg text-red-600">
        레시피를 찾을 수 없습니다.
      </div>
    );
  }

  // ✅ 이미지 로딩 실패를 기억하기 위한 state
  const [hasLoadError, setHasLoadError] = useState(false);

  // ✅ imageUrl prop이 변경될 때마다 에러 상태를 초기화
  useEffect(() => {
    setHasLoadError(false);
  }, [recipe.imageUrl]);

  // ✅ 이미지가 없거나 로드 에러가 발생했는지 확인
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
              <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
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
              {recipe.ingredients.map((ing, index) => (
                <li key={index} className="text-gray-700">
                  <span className="font-semibold">{ing.name}</span>:{" "}
                  {ing.amount}
                </li>
              ))}
            </ul>
          </div>

          {/* 만드는 법 섹션 */}
          <div>
            <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4">
              만드는 법
            </h2>
            <ol className="list-decimal list-inside space-y-3">
              {recipe.steps.map((step, index) => (
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
