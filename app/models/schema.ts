import {
  bigint,
  boolean,
  integer,
  text,
  timestamp,
  pgEnum,
  pgTable,
  primaryKey,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ☕️ Cafe (카페)
export const cafes = pgTable("cafes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).unique().notNull(),
  description: text("description"),
  headline: varchar("headline", { length: 256 }),
  body: text("body"),
  logo: text("logo_url"),
  video: text("video_url"),
  images: text("images_urls").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 🧑‍🍳 User (사용자)
export const userRoleEnum = pgEnum("user_role", ["SA", "MA", "BA"]);
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    role: userRoleEnum("role").notNull(),
    auth: varchar("auth_code", { length: 512 }),
    mobile: varchar("mobile", { length: 16 }),
    avatar: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    cafeId: uuid("cafe_id")
      .notNull()
      .references(() => cafes.id),
  },
  (table) => {
    return [
      {
        cafeRoleUnique: unique("cafe_role_unique_idx").on(
          table.cafeId,
          table.role
        ),
      },
    ];
  }
);

// 🪄 Product (상품)
export const products = pgTable(
  "products",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 64 }).notNull(),
    description: text("description"),
    image: text("image_url"),
    cafeId: uuid("cafe_id")
      .notNull()
      .references(() => cafes.id),
  },
  (table) => {
    return [
      {
        cafeProductNameUnique: unique("cafe_product_name_unique_idx").on(
          table.cafeId,
          table.name
        ),
      },
    ];
  }
);

// ✨ Menu (메뉴)
export const menus = pgTable("menus", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 64 }).notNull(),
  isHot: boolean("is_hot").notNull().default(true), // 핫/아이스 여부
  price: integer("price").notNull().default(0), // 가격
  stock: integer("stock").notNull().default(0), // 재고 수량
  isActive: boolean("is_active").default(true), // 판매 여부
  image: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  productId: bigint("product_id", { mode: "number" })
    .notNull()
    .references(() => products.id),
  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id),
});

// 🍳 Recipe (레시피)
export const recipes = pgTable("recipes", {
  name: varchar("name", { length: 64 }).notNull(),
  description: text("description"),
  // ingredients: text("ingredients").array().notNull(), -> recipe_ingredients
  steps: text("steps").array().notNull(),
  video: text("video_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  menuId: bigint("menu_id", { mode: "number" })
    .primaryKey() // ✅ menuId를 PK로 설정
    .references(() => menus.id, { onDelete: "cascade" }),
  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id),
});

// 🥕 Ingredient (재료)
export const ingredients = pgTable("ingredients", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 64 }).notNull(),
  image: text("image_url"),
  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id),
});

// ✅ Recipe + Ingredient (N:M 관계)
export const recipeIngredients = pgTable(
  "recipe_ingredients",
  {
    recipeId: bigint("recipe_id", { mode: "number" })
      .notNull()
      .references(() => recipes.menuId, { onDelete: "cascade" }),
    ingredientId: bigint("ingredient_id", { mode: "number" })
      .notNull()
      .references(() => ingredients.id, { onDelete: "cascade" }),
    quantity: varchar("quantity", { length: 16 }).notNull(), // 예: "2샷", "200ml"
  },
  (table) => {
    return [
      {
        pk: primaryKey({ columns: [table.recipeId, table.ingredientId] }),
      },
    ];
  }
);

// 🪄 Stock (재고 아이템 그룹)
export const stocks = pgTable(
  "stocks",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 64 }).notNull(),
    description: text("description"),
    image: text("image_url"),
    cafeId: uuid("cafe_id")
      .notNull()
      .references(() => cafes.id),
  },
  (table) => {
    return [
      {
        cafeStockNameUnique: unique("cafe_stock_name_unique_idx").on(
          table.cafeId,
          table.name
        ),
      },
    ];
  }
);

// 📦 Item (재고 아이템)
export const items = pgTable("items", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 64 }).notNull(), // 예: 에스프레소 원두, 아몬드 시럽 등
  count: integer("count").notNull().default(0),
  unit: varchar("unit", { length: 16 }), // 예: 개, 봉지, ml 등
  image: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  stockId: bigint("stock_id", { mode: "number" })
    .notNull()
    .references(() => stocks.id),
  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id),
});

// --- 관계 정의 (Drizzle Relations) ---

// 카페 중심의 관계 설정 (하나의 카페는 여러 사용자, 아이템 등을 가짐)
export const cafesRelations = relations(cafes, ({ many }) => ({
  users: many(users),
  products: many(products),
  menus: many(menus),
  recipes: many(recipes),
  ingredients: many(ingredients),
  stocks: many(items),
  items: many(items),
}));

// 각 테이블이 어떤 카페에 속하는지 정의
export const usersRelations = relations(users, ({ one }) => ({
  cafe: one(cafes, { fields: [users.cafeId], references: [cafes.id] }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  cafe: one(cafes, { fields: [products.cafeId], references: [cafes.id] }),
  menus: many(menus),
}));

export const menusRelations = relations(menus, ({ one }) => ({
  cafe: one(cafes, { fields: [menus.cafeId], references: [cafes.id] }),
  menuGroup: one(products, {
    fields: [menus.productId],
    references: [products.id],
  }),
  recipe: one(recipes, {
    fields: [menus.id],
    references: [recipes.menuId],
  }),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  cafe: one(cafes, { fields: [recipes.cafeId], references: [cafes.id] }),
  menu: one(menus, { fields: [recipes.menuId], references: [menus.id] }),
  ingredients: many(recipeIngredients),
}));

export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
  cafe: one(cafes, { fields: [ingredients.cafeId], references: [cafes.id] }),
  recipes: many(recipeIngredients),
}));

export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipeId],
      references: [recipes.menuId],
    }),
    ingredient: one(ingredients, {
      fields: [recipeIngredients.ingredientId],
      references: [ingredients.id],
    }),
  })
);

export const stocksRelations = relations(stocks, ({ one, many }) => ({
  cafe: one(cafes, { fields: [stocks.cafeId], references: [cafes.id] }),
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  cafe: one(cafes, { fields: [items.cafeId], references: [cafes.id] }),
  stock: one(stocks, { fields: [items.stockId], references: [stocks.id] }),
}));
