import { useState } from "react";
import { Link, redirect, type LoaderFunction } from "react-router-dom";
import { Pencil, Plus, Trash2, XCircle } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
  if (!session?.cafeId) return redirect("/login");
  const cafeId = session.cafeId;
  console.log("recipes.cafeId", cafeId);

  const { supabase } = createClient(request);
  const { data: productData } = await supabase
    .from("products")
    .select()
    .eq("cafe_id", cafeId)
    .order("name");

  const products: Product[] = productData!.map((item: any) => ({
    id: item.id,
    name: item.name,
  }));
  const comboProducts = [{ id: 0, name: "전체" }, ...products];
  console.log("recipes.R0", comboProducts);

  const { data } = await supabase
    .from("recipes")
    .select(
      `
      *,
      menus (
        products (
          name
        )
      ),
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
      productName: item.menus.products.name,
      imageUrl: item.video,
      updatedAt: item.updated_at,
    }));
    console.log("recipes.R", recipes);
    return [comboProducts, recipes];
  } else return [];
};

// 상품 타입 정의
type Product = {
  id: number;
  name: string;
};

// 레시피 타입 정의
type Recipe = {
  id: number;
  name: string;
  description: string;
  ingredients: [{ name: string; quantity: string }];
  [key: string]: any;
};

export default function RecipeListPage({ loaderData }: Route.ComponentProps) {
  const { roleCode } = useRoleStore();

  if (!loaderData) return;

  // 상품 목록 조회
  const [products] = useState<Product[]>(loaderData[0]);
  console.log("recipes.loaderData[0]", loaderData);

  // 레시피 목록 조회
  const [recipes] = useState<Recipe[]>(loaderData[1]);
  console.log("recipes.loaderData[1]", loaderData);

  // 레시피 삭제
  const [oneToDelete, setOneToDelete] = useState<Recipe | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const handleDeleteClick = (menu: Recipe) => {
    setOneToDelete(menu);
    setIsAlertOpen(true);
  };
  const confirmDelete = () => {
    if (!oneToDelete) return;
    console.log(`삭제 또는 비활성화 대상 : '${oneToDelete.name}'`);
    setIsAlertOpen(false);
    setOneToDelete(null);
  };

  // 레시피 선택 콤보
  const [selectedProduct, setSelectedProduct] = useState("전체");
  const filteredRecipes =
    selectedProduct === "전체"
      ? recipes
      : recipes.filter(
          (recipe: Recipe) => recipe.productName === selectedProduct
        );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-row gap-4">
          <h1 className="text-3xl font-bold text-amber-800">레시피</h1>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md border border-stone-200">
              {products.map((product) => (
                <SelectItem key={product.id} value={product.name}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
        {filteredRecipes.map((recipe) => (
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
              "{oneToDelete?.name}" 레시피가 삭제되며, 메뉴 수정에서 레시피 생성
              액션을 통해 다시 추가할 수 있습니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                variant="outline"
                className="group flex items-center gap-1 hover:text-red-600 hover:border-red-600 transition-colors"
                onClick={() => setOneToDelete(null)}
              >
                <XCircle className="h-4 w-4 group-hover:text-red-600 transition-colors" />
                취소
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                className="group flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white transition-colors"
                onClick={confirmDelete}
              >
                <Trash2 className="h-4 w-4 group-hover:text-white transition-colors" />
                삭제 확인
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
