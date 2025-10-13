import { useFetcher } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// 상태 값과 한글 표시명을 매핑하는 객체
export const STATUS_OPTIONS = {
  BEFORE_OPEN: "오픈 전",
  ON_SALE: "판매중",
  SOLD_OUT: "매진",
  OUT_OF_STOCK: "품절",
  HOLD: "일시 중지",
};

// 상태 변경 UI를 위한 별도 컴포넌트
export function MenuStatusChanger({
  menuId,
  currentStatus,
}: {
  menuId: number;
  currentStatus: keyof typeof STATUS_OPTIONS;
}) {
  const fetcher = useFetcher();

  // fetcher가 데이터를 제출 중일 때 낙관적 UI 업데이트를 위한 상태
  const isSubmitting = fetcher.state !== "idle";
  const optimisticStatus = isSubmitting
    ? (fetcher.formData?.get("status") as string)
    : currentStatus;

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="actionType" value="S" />
      <input type="hidden" name="id" value={menuId} />

      <Select
        name="status"
        value={optimisticStatus}
        // Select 값이 변경되면 자동으로 폼을 제출합니다.
        onValueChange={(value) => {
          fetcher.submit(
            { actionType: "S", id: menuId.toString(), status: value },
            { method: "post" }
          );
        }}
        disabled={isSubmitting}
      >
        <SelectTrigger className="w-auto border-0 bg-transparent p-2 text-sm text-amber-600 ring-offset-0 transition-colors hover:bg-amber-500 hover:text-white focus:ring-0">
          <SelectValue placeholder="상태 변경" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-md border border-stone-200 rounded-md">
          {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
            <SelectItem key={value} value={value} className="text-xs">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </fetcher.Form>
  );
}
