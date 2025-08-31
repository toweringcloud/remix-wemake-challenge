// 재고 아이템에 대한 인터페이스
export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  [key: string]: unknown;
}

// 재고 초기 데이터
export const inventoryData: InventoryItem[] = [
  { id: 1, name: "케냐 AA 원두", quantity: 10, unit: "kg" },
  { id: 2, name: "에티오피아 예가체프 원두", quantity: 8, unit: "kg" },
  { id: 3, name: "서울우유 1L", quantity: 20, unit: "개" },
  { id: 4, name: "매일두유 99.89 1L", quantity: 12, unit: "개" },
  { id: 5, name: "바닐라 시럽", quantity: 5, unit: "병" },
  { id: 6, name: "냉동 딸기", quantity: 15, unit: "kg" },
  { id: 7, name: "플레인 요거트", quantity: 6, unit: "통" },
  { id: 8, name: "일회용 컵 (12oz)", quantity: 350, unit: "개" },
  { id: 9, name: "컵 홀더", quantity: 280, unit: "개" },
  { id: 10, name: "빨대", quantity: 800, unit: "개" },
];

// 레시피 재료에 대한 인터페이스
export interface IngridientItem {
  id: number;
  name: string;
  [key: string]: unknown;
}

// 레시피 재료 초기 데이터
export const ingridientData: IngridientItem[] = [
  { id: 1, name: "[원두] 케냐 AA", unit: "kg" },
  { id: 2, name: "에티오피아 예가체프 원두", quantity: 8, unit: "kg" },
  { id: 3, name: "서울우유 1L", quantity: 20, unit: "개" },
  { id: 4, name: "매일두유 99.89 1L", quantity: 12, unit: "개" },
  { id: 5, name: "바닐라 시럽", quantity: 5, unit: "병" },
  { id: 6, name: "냉동 딸기", quantity: 15, unit: "kg" },
  { id: 7, name: "플레인 요거트", quantity: 6, unit: "통" },
  { id: 8, name: "일회용 컵 (12oz)", quantity: 350, unit: "개" },
  { id: 9, name: "컵 홀더", quantity: 280, unit: "개" },
  { id: 10, name: "빨대", quantity: 800, unit: "개" },
];
