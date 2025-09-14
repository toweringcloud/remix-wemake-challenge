import { create } from "zustand";

// 권한 스토어의 상태와 액션에 대한 타입 정의
interface RoleState {
  role: "admin" | "manager" | "staff" | null;
  isLoggedIn: boolean;
  login: (role: "admin" | "manager" | "staff") => void;
  logout: () => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: null,
  isLoggedIn: false,
  login: (role) => set({ role: role, isLoggedIn: true }),
  logout: () => set({ role: null, isLoggedIn: false }),
}));
