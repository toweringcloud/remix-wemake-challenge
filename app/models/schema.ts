import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ☕️ Cafe (카페)
export const cafes = pgTable("cafes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  description: text("description"),
  logo: text("logo_url"),
  headline: text("headline"),
  body: text("body"),
  video: text("video_url"),
  photos: text("photos_urls").array(), // 이미지 URL 목록 (배열 타입)
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
    auth: text("auth_code").notNull(),
    mobile: varchar("mobile", { length: 50 }),
    avatar: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    cafeId: uuid("cafe_id")
      .notNull()
      .references(() => cafes.id),
  },
  (table) => {
    return {
      // ✅ cafeId와 role 필드를 묶어 고유 제약 조건을 추가합니다.
      cafeRoleUnique: uniqueIndex("cafe_role_unique_idx").on(
        table.cafeId,
        table.role
      ),
    };
  }
);

// 📦 Item (재고 아이템)
export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  count: integer("count").notNull().default(0),
  unit: varchar("unit", { length: 50 }),
  photo: text("photo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id),
});

// 🥕 Ingredient (재료)
export const ingredients = pgTable("ingredients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  photo: text("photo_url"),
  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id),
});

// ✅ Recipe + Ingredient (N:M 관계)
export const recipeIngredients = pgTable(
  "recipe_ingredients",
  {
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }), // 레시피 삭제 시 같이 삭제
    ingredientId: uuid("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "cascade" }), // 재료 삭제 시 같이 삭제
    quantity: varchar("quantity", { length: 100 }).notNull(), // 예: "2샷", "200ml"
  },
  (table) => {
    // recipeId와 ingredientId를 묶어 복합 기본 키로 설정
    return {
      pk: primaryKey({ columns: [table.recipeId, table.ingredientId] }),
    };
  }
);

// 🍳 Recipe (레시피)
export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  // ingredients: text("ingredients").array().notNull(), // 재료 목록 (배열 타입)
  steps: text("steps").array().notNull(), // 단계 목록 (배열 타입)
  video: text("video_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id),
});

// --- 관계 정의 (Drizzle Relations) ---

// 카페 중심의 관계 설정 (하나의 카페는 여러 사용자, 아이템 등을 가짐)
export const cafesRelations = relations(cafes, ({ many }) => ({
  users: many(users),
  items: many(items),
  ingredients: many(ingredients),
  recipes: many(recipes),
}));

// 각 테이블이 어떤 카페에 속하는지 정의
export const usersRelations = relations(users, ({ one }) => ({
  cafe: one(cafes, { fields: [users.cafeId], references: [cafes.id] }),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  cafe: one(cafes, { fields: [items.cafeId], references: [cafes.id] }),
}));

export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
  cafe: one(cafes, { fields: [ingredients.cafeId], references: [cafes.id] }),
  recipeIngredients: many(recipeIngredients),
}));

export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipeId],
      references: [recipes.id],
    }),
    ingredient: one(ingredients, {
      fields: [recipeIngredients.ingredientId],
      references: [ingredients.id],
    }),
  })
);

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  cafe: one(cafes, { fields: [recipes.cafeId], references: [cafes.id] }),
  recipeIngredients: many(recipeIngredients),
}));
