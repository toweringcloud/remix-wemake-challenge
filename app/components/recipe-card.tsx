import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { PlaceholderImage } from "~/components/common/placeholder-image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface RecipeCardProps {
  id: number;
  name: string;
  description: string;
  ingredients: { name: string; quantity: string }[];
  imageUrl?: string;
  action?: React.ReactNode;
}

export function RecipeCard({
  id,
  name,
  description,
  ingredients,
  imageUrl,
  action,
}: RecipeCardProps) {
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    setHasLoadError(false);
  }, [imageUrl]);

  const showFallback = hasLoadError || !imageUrl;

  return (
    // ✅ 1. Card 자체를 반응형 Grid 컨테이너로 만듭니다. h-full은 Grid가 높이를 맞추도록 합니다.
    <Card className="h-full grid grid-cols-1 sm:grid-cols-[35%_1fr] overflow-hidden transition-all duration-300 bg-stone-50 border-amber-200 group-hover:shadow-xl group-hover:border-amber-400">
      {/* --- Grid의 첫 번째 아이템: 이미지 영역 --- */}
      <div className="relative h-48 sm:h-auto">
        <Link to={`/dashboard/recipes/${id}`} className="block w-full h-full">
          {showFallback ? (
            <div className="absolute inset-0">
              <PlaceholderImage text={name} />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setHasLoadError(true)}
            />
          )}
        </Link>
      </div>

      {/* --- Grid의 두 번째 아이템: 콘텐츠 영역 --- */}
      {/* ✅ 2. 콘텐츠 영역은 Flexbox를 사용해 내부 요소를 위아래로 정렬합니다. */}
      <div className="flex flex-col px-4 sm:pr-4 sm:pl-0 justify-between">
        {/* 상단 그룹 (제목 + 설명 + 재료) */}
        <div>
          <CardHeader className="p-0">
            <Link to={`/dashboard/recipes/${id}`}>
              <CardTitle className="text-lg font-bold text-amber-800 hover:underline">
                {name}
              </CardTitle>
            </Link>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <CardDescription className="text-stone-600">
              {description}
              {ingredients.length > 0 ? (
                <ul className="list-disc list-inside space-y-0 pt-2 text-xs">
                  {ingredients.map((item, idx) => (
                    <li key={idx}>
                      {item.name}: {item.quantity}
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardDescription>
          </CardContent>
        </div>

        {/* 하단 그룹 (액션 버튼) */}
        <CardFooter className="p-0 pt-4 flex justify-end">{action}</CardFooter>
      </div>
    </Card>
  );
}
