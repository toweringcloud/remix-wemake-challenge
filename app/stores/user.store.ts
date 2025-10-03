import { create } from "zustand";

// 유저 스토어의 상태와 액션에 대한 타입 정의
export type UserRole = "SA" | "MA" | "BA";

interface RoleState {
  cafeId: string | null;
  roleCode: UserRole | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  login: (cafeId: string, roleCode: UserRole) => void;
  logout: () => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  cafeId: null,
  roleCode: null,
  isLoggedIn: false,
  isLoading: true,

  login: (cafeId, roleCode) =>
    set({ cafeId, roleCode, isLoggedIn: true, isLoading: false }),
  logout: () =>
    set({
      cafeId: null,
      roleCode: null,
      isLoggedIn: false,
      isLoading: true,
    }),
}));
