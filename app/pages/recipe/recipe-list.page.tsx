import { Pencil } from "lucide-react";
import { useState } from "react";
import {
  Link,
  redirect,
  useLoaderData,
  useNavigate,
  useSearchParams,
  type LoaderFunction,
} from "react-router-dom";

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
  { title: "Recipes | Caferium" },
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
  if (!session?.cafeId) return redirect("/login");
  const cafeId = session.cafeId;
  console.log("recipes.cafeId", cafeId);

  // URL에서 쿼리 파라미터를 가져옵니다.
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("c");
  console.log("recipes.categoryId", categoryId);

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
  // console.log("recipes.R0", comboProducts);

  // 레시피 목록을 가져오는 쿼리를 동적으로 구성합니다.
  let query = supabase
    .from("menus")
    .select(
      `
      *,
      products (
        name
      ),
      recipes (
        updated_at,
        recipe_ingredients (
          quantity,
          ingredients (
            name
          )
        )
      )
    `
    )
    .eq("cafe_id", cafeId)
    .not("recipes", "is", null);

  // categoryId가 존재하고 '0'(전체)이 아닐 경우, 필터 조건을 추가합니다.
  if (categoryId && categoryId !== "0") {
    query = query.eq("product_id", parseInt(categoryId));
  }
  const { data } = await query.order("name");
  console.log("recipes.RC", data && data.length);

  if (data) {
    const recipes: Recipe[] = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.image_thumb_url,
      updatedAt: item.recipes.updated_at,
      ingredients: item.recipes.recipe_ingredients.map((i: any) => ({
        name: i.ingredients.name,
        quantity: i.quantity,
      })),
      productName: item.products.name,
    }));
    console.log("recipes.R", recipes);
    return [comboProducts, recipes];
  } else return [];
};

export default function RecipeListPage({ loaderData }: Route.ComponentProps) {
  const { roleCode } = useRoleStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // useLoaderData 훅을 직접 호출하여 최신 데이터를 받습니다.
  const [products, recipes] = useLoaderData() as [Product[], Recipe[]];
  console.log("recipes.loaderData[0]", products);
  console.log("recipes.loaderData[1]", recipes);

  // URL의 쿼리스트링에서 현재 선택된 카테고리 값을 가져옵니다.
  // URL에 값이 없으면 '0' (전체)을 기본값으로 사용합니다.
  const currentCategory = searchParams.get("c") || "0";

  // Select 값이 변경될 때 호출될 핸들러 함수입니다.
  const handleCategoryChange = (categoryId: string) => {
    console.log("recipes.selectedCategory", categoryId);
    if (categoryId === "0") {
      // '전체'를 선택하면 쿼리스트링 없이 recipes 목록 페이지로 이동합니다.
      navigate("/dashboard/recipes");
    } else {
      // 특정 카테고리를 선택하면 해당 ID를 쿼리스트링에 추가하여 이동합니다.
      navigate(`/dashboard/recipes?c=${categoryId}`);
    }
  };

  // loaderData가 없으면 아무것도 렌더링하지 않습니다.
  if (!loaderData) return;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-row gap-4">
          <h1 className="text-3xl font-bold text-amber-800">레시피</h1>
          {/* 상품 선택 콤보 */}
          <Select value={currentCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[120px] bg-white">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md border border-stone-200">
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
