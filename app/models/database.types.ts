export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      cafes: {
        Row: {
          body: string | null
          created_at: string | null
          description: string | null
          headline: string | null
          id: string
          logo_url: string | null
          name: string
          photos_urls: string[] | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          description?: string | null
          headline?: string | null
          id?: string
          logo_url?: string | null
          name: string
          photos_urls?: string[] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          description?: string | null
          headline?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          photos_urls?: string[] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          cafe_id: string
          id: number
          name: string
          photo_url: string | null
        }
        Insert: {
          cafe_id: string
          id?: never
          name: string
          photo_url?: string | null
        }
        Update: {
          cafe_id?: string
          id?: never
          name?: string
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_cafe_id_cafes_id_fk"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          cafe_id: string
          count: number
          created_at: string | null
          id: number
          name: string
          photo_url: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          cafe_id: string
          count?: number
          created_at?: string | null
          id?: never
          name: string
          photo_url?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          cafe_id?: string
          count?: number
          created_at?: string | null
          id?: never
          name?: string
          photo_url?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_cafe_id_cafes_id_fk"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          cafe_id: string
          category: string
          created_at: string | null
          id: number
          is_hot: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          cafe_id: string
          category: string
          created_at?: string | null
          id?: never
          is_hot?: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          cafe_id?: string
          category?: string
          created_at?: string | null
          id?: never
          is_hot?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menus_cafe_id_cafes_id_fk"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          ingredient_id: number
          quantity: string
          recipe_id: number
        }
        Insert: {
          ingredient_id: number
          quantity: string
          recipe_id: number
        }
        Update: {
          ingredient_id?: number
          quantity?: string
          recipe_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_ingredients_id_fk"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_recipes_id_fk"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cafe_id: string
          created_at: string | null
          description: string | null
          id: number
          menu_id: number
          name: string
          steps: string[]
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          cafe_id: string
          created_at?: string | null
          description?: string | null
          id?: never
          menu_id: number
          name: string
          steps: string[]
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          cafe_id?: string
          created_at?: string | null
          description?: string | null
          id?: never
          menu_id?: number
          name?: string
          steps?: string[]
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_cafe_id_cafes_id_fk"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_menu_id_menus_id_fk"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_code: string | null
          avatar_url: string | null
          cafe_id: string
          created_at: string | null
          id: string
          mobile: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          auth_code?: string | null
          avatar_url?: string | null
          cafe_id: string
          created_at?: string | null
          id?: string
          mobile?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          auth_code?: string | null
          avatar_url?: string | null
          cafe_id?: string
          created_at?: string | null
          id?: string
          mobile?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_cafe_id_cafes_id_fk"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "SA" | "MA" | "BA"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["SA", "MA", "BA"],
    },
  },
} as const
