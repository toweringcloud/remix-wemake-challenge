export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  [key: string]: unknown;
}

export const recipesData: Recipe[] = [
  {
    id: "1",
    name: "아메리카노",
    description: "케냐 원두를 사용한 깊고 풍부한 풍미의 커피입니다.",
    imageUrl:
      "https://via.placeholder.com/600x400/7d5a4f/ffffff?text=Americano",
    ingredients: [
      { name: "에스프레소", amount: "2샷" },
      { name: "뜨거운 물", amount: "200ml" },
    ],
    steps: [
      "잔에 에스프레소 2샷을 추출합니다.",
      "뜨거운 물을 부어 농도를 조절합니다.",
    ],
  },
  {
    id: "2",
    name: "카페라떼",
    description: "부드러운 우유와 에스프레소의 완벽한 조화를 느껴보세요.",
    imageUrl:
      "https://via.placeholder.com/600x400/c7a487/ffffff?text=Caffe+Latte",
    ingredients: [
      { name: "에스프레소", amount: "2샷" },
      { name: "스팀 우유", amount: "200ml" },
    ],
    steps: [
      "잔에 에스프레소 2샷을 추출합니다.",
      "우유 200ml를 스팀하여 부드러운 거품을 만듭니다.",
      "에스프레소가 담긴 잔에 스팀한 우유를 부어줍니다.",
      "우유 거품을 살짝 올려 마무리합니다.",
    ],
  },
  {
    id: "3",
    name: "딸기 스무디",
    description: "국내산 신선한 딸기를 그대로 갈아 만든 시원한 음료입니다.",
    imageUrl:
      "https://via.placeholder.com/600x400/ff758c/ffffff?text=Strawberry+Smoothie",
    ingredients: [
      { name: "냉동 딸기", amount: "150g" },
      { name: "우유", amount: "100ml" },
      { name: "꿀 또는 시럽", amount: "1큰술" },
    ],
    steps: [
      "믹서기에 냉동 딸기, 우유, 꿀을 모두 넣습니다.",
      "부드러워질 때까지 곱게 갈아줍니다.",
      "시원한 컵에 담아 제공합니다.",
    ],
  },
];
