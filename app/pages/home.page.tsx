import { useNavigate } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";
import type { Route } from "./+types/home.page";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useState } from "react";
import { PulsatingButton } from "~/components/magicui/pulsating-button";
// import { getCafeData } from "~/queries/cafe.queries";
// import { DateTime } from "luxon";
import { createClient } from "~/utils/supabase.server";

export const meta: Route.MetaFunction = () => [
  { title: "Home | Caferium" },
  { name: "description", content: "introduce about the cafe" },
];

export async function loader({ request }: Route.LoaderArgs) {
  // const cafes = await getCafeData({
  //   request,
  //   startDate: DateTime.now().startOf("day"),
  //   endDate: DateTime.now().endOf("day"),
  //   limit: 10,
  // });

  const { supabase } = createClient(request);
  const { data: cafes } = await supabase.from("cafes").select();
  console.log("cafes", cafes);
  // cafes [
  //   {
  //     id: 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0',
  //     name: '어반 그라인드',
  //     description: '도심 속의 현대적인 커피 공간',
  //     logo_url: null,
  //     headline: '최고급 원두로 내린 스페셜티 커피',
  //     body: '매일 아침 직접 로스팅한 신선한 원두를 사용합니다.',
  //     video_url: null,
  //     photos_urls: null,
  //     created_at: '2025-09-07T13:40:00.900276+00:00',
  //     updated_at: '2025-09-07T13:40:00.900276+00:00'
  //   }
  // ]

  if (cafes && cafes.length > 0) {
    return cafes[0];
  }
  return null;
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useRoleStore();

  // ✅ 플러그인을 state로 관리하여 안정적으로 초기화합니다.
  const [autoplayPlugin, setAutoplayPlugin] = useState(() =>
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  // ✅ 슬라이드 쇼에 사용할 샘플 커피숍 이미지 URL 배열
  const imageUrls = [
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1740&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1742&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1887&auto=format&fit=crop",
  ];

  const handleStart = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-6 bg-amber-50">
      <Carousel
        className="w-full max-w-2xl lg:max-w-4xl mb-10 shadow-2xl rounded-xl"
        plugins={[autoplayPlugin]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {imageUrls.map((url, index) => (
            <CarouselItem key={index}>
              <div className="aspect-video md:aspect-[2/1] lg:aspect-[2.4/1]">
                <img
                  src={url}
                  alt={`Coffee shop image ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16" />
        <CarouselNext className="mr-16" />
      </Carousel>

      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          {loaderData?.headline || "레시피와 재고를 한 곳에서 관리하세요!"}
        </h1>
        <p className="mt-4 text-md md:text-lg text-gray-600">
          {loaderData?.body ||
            "복잡한 메뉴 관리와 재고 계산은 이제 그만. 똑똑한 운영에만 집중하세요."}
        </p>
        <button
          onClick={handleStart}
          className="mt-8 inline-flex items-center justify-center bg-amber-600 text-white font-bold text-3xl py-3 px-8 rounded-lg hover:bg-amber-700 transition-transform hover:scale-105"
        >
          <PulsatingButton>
            {loaderData?.name || "대시보드로 이동"}
          </PulsatingButton>
        </button>
      </div>
    </div>
  );
}
