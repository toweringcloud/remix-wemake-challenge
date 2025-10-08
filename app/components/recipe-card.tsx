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

interface RecipeCardProps {
  id: number;
  name: string;
  description: string;
  ingredients: [{ name: string; quantity: string }];
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
                <CardTitle className="text-lg font-bold text-amber-800 hover:underline">
                  {name}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-stone-600">
                {description}
                {ingredients.length > 0 ? (
                  <ul className="list-disc list-inside space-y-0 py-2 text-xs">
                    {ingredients.map((item, idx) => (
                      <li key={idx}>
                        {item.name}: {item.quantity}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardDescription>
            </CardContent>
            <CardFooter>{action}</CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
