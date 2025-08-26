import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // 루트 레이아웃
  route("/", "layouts/RootLayout.tsx", [
    index("pages/Home.tsx"),
    route("login", "pages/Login.tsx"),

    // 대시보드 레이아웃
    route("dashboard", "layouts/DashboardLayout.tsx", [
      // 대시보드
      index("pages/Dashboard.tsx"),

      // 레시피 관리
      route("recipes", "pages/recipes/RecipeList.tsx"),
      route("recipes/new", "pages/recipes/RecipeForm.tsx", { id: "recipeNew" }),
      route("recipes/:recipeId", "pages/recipes/RecipeDetail.tsx"),
      route("recipes/:recipeId/edit", "pages/recipes/RecipeForm.tsx", {
        id: "recipeEdit",
      }),

      // 재고 관리
      route("inventory", "pages/inventory/Inventory.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
