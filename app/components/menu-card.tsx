import { Flame, Snowflake } from "lucide-react";
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

interface MenuCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  isHot: boolean;
  imageUrl: string;
  action?: React.ReactNode;
}

export function MenuCard({
  id,
  name,
  description,
  category,
  isHot,
  imageUrl,
  action,
}: MenuCardProps) {
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    setHasLoadError(false);
  }, [imageUrl]);

  const showFallback = hasLoadError || !imageUrl;

  return (
    <div className="group flex flex-col h-full">
      <Card className="flex flex-col flex-grow overflow-hidden transition-all duration-300 bg-stone-50 border-amber-200 group-hover:shadow-xl group-hover:border-amber-400">
        <div className="flex">
          <div className="w-[30%] flex-shrink-0">
            <Link to={`/dashboard/recipes/${id}`}>
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
              <Link to={`/dashboard/recipes/${id}`}>
                <CardTitle className="text-xl font-bold text-amber-800 hover:underline flex flex-row gap-1">
                  {name}{" "}
                  {/* {["커피", "라떼"].find((i) => i === category) != undefined && */}
                  {category !== "디저트" ? (
                    isHot ? (
                      <Flame className="h-4 w-4 text-red-500" />
                    ) : (
                      <Snowflake className="h-4 w-4 text-blue-500" />
                    )
                  ) : null}
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
