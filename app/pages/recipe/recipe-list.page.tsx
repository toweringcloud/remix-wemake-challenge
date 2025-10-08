import { useState } from "react";
import { Link, redirect, type LoaderFunction } from "react-router-dom";
import { Pencil } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import type { Route } from "./+types/recipe-list.page";
import { RecipeCard } from "~/components/recipe-card";
import { getCookieSession } from "~/lib/cookie.server";
import { createClient } from "~/lib/supabase.server";
import { useRoleStore } from "~/stores/user.store";

export const meta: Route.MetaFunction = () => [
  { title: "Recipe List | Caferium" },
  { name: "description", content: "show all the recipe cards" },
];

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
        description,
        image_url,
        image_thumb_url,
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
      description: item.menus.description,
      ingredients: item.recipe_ingredients.map((i: any) => ({
        name: i.ingredients.name,
        quantity: i.quantity,
      })),
      productName: item.menus.products.name,
      imageUrl: item.menus.image_thumb_url,
      updatedAt: item.updated_at,
    }));
    console.log("recipes.R", recipes);
    return [comboProducts, recipes];
  } else return [];
};

export default function RecipeListPage({ loaderData }: Route.ComponentProps) {
  const { roleCode } = useRoleStore();

  if (!loaderData) return;

  // 상품 목록 조회
  const [products] = useState<Product[]>(loaderData[0]);
  console.log("recipes.loaderData[0]", products);

  // 레시피 목록 조회
  const [recipes] = useState<Recipe[]>(loaderData[1]);
  console.log("recipes.loaderData[1]", recipes);

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
          {/* 상품 선택 콤보 */}
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-[120px] bg-white">
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
                // 매니저일 경우: 수정 버튼
                <div className="flex items-center gap-2 ml-auto -mb-2">
                  <Link to={`/dashboard/recipes/${recipe.id}/edit`}>
                    <button className="cursor-pointer flex items-center gap-1 text-sm text-amber-600 hover:text-white p-2 rounded-md hover:bg-amber-500 transition-colors">
                      <Pencil className="h-4 w-4" />
                      수정
                    </button>
                  </Link>
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
