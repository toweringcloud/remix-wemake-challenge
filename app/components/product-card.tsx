import React, { useState, useEffect } from "react"; // ✅ useState, useEffect import
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

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  action?: React.ReactNode;
}

export function ProductCard({
  id,
  name,
  description,
  imageUrl,
  action,
}: ProductCardProps) {
  // ✅ 이미지 로딩 실패를 기억하기 위한 state
  const [hasLoadError, setHasLoadError] = useState(false);

  // ✅ imageUrl prop이 변경될 때마다 에러 상태를 초기화
  useEffect(() => {
    setHasLoadError(false);
  }, [imageUrl]);

  // ✅ 이미지가 없거나 로드 에러가 발생했는지 확인
  const showFallback = hasLoadError || !imageUrl;

  return (
    <div className="group flex flex-col h-full">
      <Card className="flex flex-col flex-grow overflow-hidden transition-all duration-300 bg-stone-50 border-amber-200 group-hover:shadow-xl group-hover:border-amber-400">
        <div className="flex">
          <div className="w-[30%] flex-shrink-0">
            <Link to={`/dashboard/products/${id}/menus`}>
              {/* ✅ 조건부 렌더링으로 이미지 또는 SVG 플레이스홀더를 보여줌 */}
              {showFallback ? (
                <PlaceholderImage text={name} />
              ) : (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={() => setHasLoadError(true)}
                />
              )}
            </Link>
          </div>
          <div className="flex flex-col w-[70%]">
            <CardHeader>
              <Link to={`/dashboard/products/${id}/menus`}>
                <CardTitle className="text-xl font-bold text-amber-800 hover:underline">
                  {name}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-stone-600">
                {description}
              </CardDescription>
            </CardContent>
            <CardFooter>{action}</CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
