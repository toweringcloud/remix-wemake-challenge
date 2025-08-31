import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface MenuCardProps {
  path: string;
  name: string;
  description: React.ReactNode;
  icon: React.ReactNode;
}

export function MenuCard({ path, name, description, icon }: MenuCardProps) {
  return (
    <Link to={path}>
      <div className="group flex flex-col h-full">
        <Card className="flex flex-col flex-grow overflow-hidden shadow-lg transition-all duration-300 bg-stone-50 border-amber-200 group-hover:shadow-xl group-hover:border-amber-400">
          <div className="flex">
            <div className="w-[30%] flex items-center justify-center p-4 text-amber-600 group-hover:scale-110 transition-transform">
              {/* ✅ 아이콘이 SVG라면 w-full h-full을 적용합니다. */}
              {/* icon prop으로 넘어오는 SVG는 별도 size 지정 없이 컨테이너에 맞춰집니다. */}
              {React.isValidElement(icon)
                ? React.cloneElement(icon as React.ReactElement<any>, {
                    className: "w-full h-full",
                  })
                : icon}
            </div>
            <div className="flex flex-col w-[70%]">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-amber-800 hover:underline">
                  {name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-stone-600">
                  {description}
                </CardDescription>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </Link>
  );
}
