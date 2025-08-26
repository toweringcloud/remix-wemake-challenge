import { create } from "zustand";

// 스토어의 상태(state)와 액션(actions)에 대한 타입 정의
interface RoleState {
  role: "manager" | "staff" | null;
  isLoggedIn: boolean;
  login: (role: "manager" | "staff") => void;
  logout: () => void;
}

// Zustand 스토어 생성
export const useRoleStore = create<RoleState>((set) => ({
  role: null,
  isLoggedIn: false,
  login: (role) => set({ role: role, isLoggedIn: true }),
  logout: () => set({ role: null, isLoggedIn: false }),
}));
