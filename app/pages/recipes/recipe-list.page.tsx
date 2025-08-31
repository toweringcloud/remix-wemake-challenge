import { Link } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";
import { recipesData } from "~/data/recipes.data";
import type { Route } from "./+types/recipe-list.page";
import { RecipeCard } from "~/components/recipe-card";
import { Pencil, Trash2 } from "lucide-react";

export const meta: Route.MetaFunction = () => [
  { title: "Recipe List | Caferium" },
  { name: "description", content: "show all the recipe cards" },
];

export default function RecipeListPage() {
  const { role } = useRoleStore();
  const recipes = recipesData;

  const handleDelete = (recipeName: string) => {
    // 실제 앱에서는 삭제 API를 호출합니다.
    alert(`${recipeName} 레시피를 삭제합니다.`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {role === "staff" ? "레시피" : "레시피 관리"}
        </h1>
        {/* 스토어에서 가져온 role 값으로 매니저 여부를 확인합니다. */}
        {role === "manager" && (
          <Link to="/dashboard/recipes/new">
            <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
              + 새 레시피 등록
            </button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            name={recipe.name}
            description={recipe.description}
            imageUrl={recipe.imageUrl}
            action={
              role === "manager" ? (
                // 매니저일 경우: 수정/삭제 버튼
                <div className="flex items-center gap-2 ml-auto -mb-2">
                  <Link
                    to={`/dashboard/recipes/${recipe.id}/edit`}
                    className="flex items-center gap-1 text-sm text-stone-600 hover:text-black p-2 rounded-md hover:bg-stone-200 transition-colors"
                  >
                    <Pencil size={14} />
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe.name)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-white p-2 rounded-md hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              ) : (
                // 스태프일 경우: 상세보기 링크
                <div className="flex items-center gap-2 ml-auto -mb-2">
                  <Link
                    to={`/dashboard/recipes/${recipe.id}`}
                    className="text-sm font-semibold text-amber-600 hover:underline"
                  >
                    상세보기
                  </Link>
                </div>
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
