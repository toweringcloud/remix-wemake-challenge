import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // 루트 레이아웃
  route("/", "layouts/root.layout.tsx", [
    index("pages/home.page.tsx"),
    route("login", "pages/login.page.tsx"),

    // 대시보드 레이아웃
    route("dashboard", "layouts/dashboard.layout.tsx", [
      // 대시보드
      index("pages/dashboard.page.tsx"),

      // 레시피 관리
      route("recipes", "pages/recipes/recipe-list.page.tsx"),
      route("recipes/new", "pages/recipes/recipe-form.page.tsx", {
        id: "recipeNew",
      }),
      route("recipes/:recipeId", "pages/recipes/recipe-detail.page.tsx"),
      route("recipes/:recipeId/edit", "pages/recipes/recipe-form.page.tsx", {
        id: "recipeEdit",
      }),

      // 재고 관리
      route("inventory", "pages/inventory/inventory.page.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
