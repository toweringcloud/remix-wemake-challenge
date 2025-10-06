import React from "react";
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
  description?: string;
  imageUrl?: string;
  imageThumbUrl?: string;
  action?: React.ReactNode;
}

export function ProductCard({
  id,
  name,
  description,
  imageUrl,
  imageThumbUrl,
  action,
}: ProductCardProps) {
  return (
    <div className="group flex flex-col h-full">
      <Card className="flex flex-col flex-grow overflow-hidden transition-all duration-300 bg-stone-50 border-amber-200 group-hover:shadow-xl group-hover:border-amber-400">
        <div className="flex">
          <div className="w-[30%] flex-shrink-0">
            <Link to={`/dashboard/products/${id}/menus`}>
              {imageThumbUrl ? ( // ✅ 썸네일 URL이 있으면 썸네일 사용
                <img
                  src={imageThumbUrl} // ✅ 썸네일 이미지 사용
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : imageUrl ? ( // 썸네일이 없으면 원본 이미지 (대신 크기가 클 수 있음)
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PlaceholderImage text={name} />
                // <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                //   이미지 없음
                // </div>
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
