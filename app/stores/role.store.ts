import { create } from "zustand";

// 권한 스토어의 상태와 액션에 대한 타입 정의
export type UserRole = "SA" | "MA" | "BA";

interface RoleState {
  cafeName: string;
  cafeId: string | null;
  roleCode: UserRole | null;
  isLoggedIn: boolean;
  login: (cafeName: string, cafeId: string, roleCode: UserRole) => void;
  logout: () => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  cafeName: "카페리움",
  cafeId: null,
  roleCode: null,
  isLoggedIn: false,
  login: (cafeName, cafeId, roleCode) =>
    set({ cafeName, cafeId, roleCode, isLoggedIn: true }),
  logout: () =>
    set({
      cafeName: "카페리움",
      cafeId: null,
      roleCode: null,
      isLoggedIn: false,
    }),
}));
