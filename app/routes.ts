import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // 루트 레이아웃
  route("/", "layouts/root.layout.tsx", [
    index("pages/home.page.tsx"),
    route("login", "pages/login.page.tsx"),
    route("logout", "pages/logout.page.tsx"),

    // Protected APIs
    route("apis/send-welcome-mail", "pages/cafe/send-welcome-mail.tsx"),
    route("apis/update-cafe-ments", "pages/cafe/update-cafe-ments.tsx"),

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
      route("recipes/:recipeId", "pages/recipe/recipe-detail.page.tsx"),
      route("recipes/:recipeId/edit", "pages/recipe/recipe-form.page.tsx", {}),

      // 재고 관리
      route("stocks", "pages/inventory/stock.page.tsx"),
      route("stocks/:stockId/items", "pages/inventory/item.page.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
