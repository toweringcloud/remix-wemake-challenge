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

      // 카페 관리
      route("cafe", "pages/cafe/cafe.page.tsx"),

      // 상품 관리
      route("products", "pages/product/product.page.tsx"),
      route("products/:productId/menus", "pages/product/menu.page.tsx"),

      // 레시피 관리
      route("recipes", "pages/recipe/recipe-list.page.tsx"),
      route("recipes/new", "pages/recipe/recipe-form.page.tsx", {
        id: "recipeNew",
      }),
      route("recipes/:recipeId", "pages/recipe/recipe-detail.page.tsx"),
      route("recipes/:recipeId/edit", "pages/recipe/recipe-form.page.tsx", {
        id: "recipeEdit",
      }),

      // 재고 관리
      route("stocks", "pages/inventory/stock.page.tsx"),
      route("stocks/:stockId/items", "pages/inventory/item.page.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
