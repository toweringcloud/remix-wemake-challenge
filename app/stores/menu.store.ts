import { create } from "zustand";

// 메뉴 스토어의 상태 및 액션 타입 정의
interface MenuState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void; // 메뉴 항목 클릭 시 사이드바를 닫기 위한 액션
}

export const useMenuStore = create<MenuState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
}));
