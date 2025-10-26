import { Tag } from "lucide-react";
import { useFetcher } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

// 상태 값과 한글 표시명을 매핑하는 객체
export const STATUS_OPTIONS = {
  BEFORE_OPEN: "오픈전",
  ON_SALE: "판매중",
  SOLD_OUT: "매진",
  OUT_OF_STOCK: "품절",
  HOLD: "보류",
};

// 상태 변경 UI를 위한 새로운 컴포넌트
export function MenuStatusChanger({
  menuId,
  currentStatus,
}: {
  menuId: number;
  currentStatus: keyof typeof STATUS_OPTIONS;
}) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  // 낙관적 UI 업데이트
  const optimisticStatus = isSubmitting
    ? (fetcher.formData?.get("status") as keyof typeof STATUS_OPTIONS)
    : currentStatus;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "cursor-pointer flex items-center gap-1 text-sm p-1.5 rounded-md transition-colors whitespace-nowrap",
            optimisticStatus === "ON_SALE"
              ? "text-green-600 hover:bg-green-500 hover:text-white"
              : "text-stone-600 hover:bg-stone-500 hover:text-white"
          )}
          disabled={isSubmitting}
        >
          <Tag className="h-4 w-4" />
          {STATUS_OPTIONS[optimisticStatus] || "상태 변경"}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white shadow-md border border-stone-200 rounded-md"
      >
        {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
          <DropdownMenuItem
            key={value}
            disabled={isSubmitting}
            // ✅ 메뉴 아이템 선택 시 fetcher.submit 호출
            onSelect={() => {
              if (value !== currentStatus) {
                fetcher.submit(
                  { actionType: "S", id: menuId.toString(), status: value },
                  { method: "post" }
                );
              }
            }}
            className="text-sm cursor-pointer"
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
