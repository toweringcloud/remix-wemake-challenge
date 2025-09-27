import { useState } from "react";
import { Link, type LoaderFunction } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import type { Route } from "./+types/recipe-list.page";
import { RecipeCard } from "~/components/recipe-card";
import { useRoleStore } from "~/stores/user.store";
import { getCookieSession } from "~/utils/cookie.server";
import { createClient } from "~/utils/supabase.server";
import { Button } from "~/components/ui/button";

export const meta: Route.MetaFunction = () => [
  { title: "Recipe List | Caferium" },
  { name: "description", content: "show all the recipe cards" },
];

export const loader: LoaderFunction = async ({ request }: Route.LoaderArgs) => {
  const session = getCookieSession(request.headers.get("Cookie"));
  if (!session) throw new Response("Unauthorized", { status: 401 });
  if (!session?.cafeId) return { cafe: null };
  const cafeId = session.cafeId;
  console.log("recipes.cafeId", cafeId);

  const { supabase } = createClient(request);
  const { data } = await supabase
    .from("recipes")
    .select(
      `
      *,
      recipe_ingredients (
        quantity,
        ingredients (
          name
        )
      )
    `
    )
    .eq("cafe_id", cafeId)
    .order("name");

  if (data) {
    const recipes: Recipe[] = data.map((item: any) => ({
      id: item.menu_id,
      name: item.name,
      description: item.description,
      ingredients: item.recipe_ingredients.map((i: any) => ({
        name: i.ingredients.name,
        quantity: i.quantity,
      })),
      imageUrl: item.video,
      updatedAt: item.updated_at,
    }));
    console.log("recipes.R", data);
    return recipes;
  } else return [];
};

// 레시피(Recipe) 타입 정의
type Recipe = {
  id: number;
  name: string;
  description: string;
  ingredients: [{ name: string; quantity: string }];
  imageUrl: string;
  [key: string]: any;
};

export default function RecipeListPage({ loaderData }: Route.ComponentProps) {
  const { roleCode } = useRoleStore();

  const [recipes] = useState<Recipe[]>(loaderData || []);

  // 레시피 삭제
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const handleDeleteClick = (menu: Recipe) => {
    setRecipeToDelete(menu); // 어떤 메뉴를 삭제할지 state에 저장
    setIsAlertOpen(true); // Dialog를 엽니다.
  };
  const confirmDelete = () => {
    if (!recipeToDelete) return;
    // 실제 앱에서는 여기서 삭제 API를 호출합니다.
    console.log(`'${recipeToDelete.name}' 레시피를 삭제합니다.`);
    setIsAlertOpen(false);
    setRecipeToDelete(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-800">레시피</h1>

        {/* 스토어에서 가져온 role 값으로 매니저 여부를 확인합니다. */}
        {roleCode === "MA" && (
          <Link to="/dashboard/recipes/new">
            <button className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 flex flex-row gap-2 items-center">
              <Plus className="h-4 w-4" /> 등록
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
            ingredients={recipe.ingredients}
            imageUrl={recipe.imageUrl}
            action={
              roleCode === "MA" ? (
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
                    onClick={() => handleDeleteClick(recipe)}
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

      {/* ✅ 레시피 삭제 팝업 */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              "{recipeToDelete?.name}" 레시피 정보가 삭제되며 메뉴 수정에서
              레시피 생성 액션을 통해 추가할 수 있습니다. 이 작업은 되돌릴 수
              없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRecipeToDelete(null)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              삭제 확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
