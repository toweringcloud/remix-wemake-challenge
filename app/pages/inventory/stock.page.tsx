import React, { useEffect, useState } from "react";
import { useNavigate, type LoaderFunction } from "react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import type { Route } from "./+types/stock.page";
import { StockCard } from "~/components/stock-card";
import { useRoleStore } from "~/stores/user.store";
import { getCookieSession } from "~/utils/cookie.server";
import { createClient } from "~/utils/supabase.server";

export const meta: Route.MetaFunction = () => [
  { title: "Stocks | Caferium" },
  { name: "description", content: "stock list" },
];

export const loader: LoaderFunction = async ({ request }: Route.LoaderArgs) => {
  const session = getCookieSession(request.headers.get("Cookie"));
  if (!session) throw new Response("Unauthorized", { status: 401 });
  if (!session?.cafeId) return { cafe: null };
  const cafeId = session.cafeId;
  console.log("stocks.cafeId", cafeId);

  const { supabase } = createClient(request);
  const { data: stocks } = await supabase
    .from("stocks")
    .select()
    .eq("cafe_id", cafeId);
  console.log("stocks.R", stocks);
  return stocks;
};

// ✅ 1. 인벤토리(Stock) 데이터의 타입을 명확하게 정의합니다.
type Stock = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

export default function StocksPage({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { roleCode } = useRoleStore();
  console.log("stocks.loaderData", loaderData);

  const [stocks] = useState<Stock[]>(loaderData || []);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  // 폼 입력 값 업데이트
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (selectedStock) {
      setSelectedStock({
        ...selectedStock,
        [id]: value,
      });
    }
  };

  // 재고 등록
  const handleNewClick = () => {
    setIsNewDialogOpen(true);
  };
  const handleSaveNew = () => {
    console.log("stocks.saveNew:", selectedStock);
    setIsNewDialogOpen(false);
  };

  // 재고 수정
  const handleEditClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsEditDialogOpen(true);
  };
  const handleSaveEdit = () => {
    console.log("stocks.saveEdit:", selectedStock);
    setIsEditDialogOpen(false);
  };

  // 재고 삭제
  const handleDelete = (stockId: number) => {
    alert(`재고그룹(${stockId})을 삭제합니다.`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-800">재고</h1>

        {roleCode === "SA" ||
          (roleCode === "MA" && (
            <button
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 flex flex-row gap-2 items-center"
              onClick={() => handleNewClick()}
            >
              <Plus className="h-4 w-4" />
              등록
            </button>
          ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stocks.map((stock) => (
          <StockCard
            key={stock.id}
            id={stock.id.toString()}
            name={stock.name}
            description={stock.description}
            imageUrl={stock.imageUrl}
            action={
              roleCode === "SA" ||
              (roleCode === "MA" && (
                // 매니저일 경우: 수정/삭제 버튼
                <div className="flex items-center gap-2 ml-auto -mb-2">
                  <button
                    onClick={() => handleEditClick(stock)}
                    className="flex items-center gap-1 text-sm text-amber-600 hover:text-white p-2 rounded-md hover:bg-amber-500 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(stock.id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-white p-2 rounded-md hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              ))
            }
          />
        ))}
      </div>

      {/* 재고 그룹 등록 팝업 */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>재고 등록</DialogTitle>
            <DialogDescription>
              재고 그룹의 이름, 설명, 이미지를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <Input
                id="name"
                placeholder="재고 그룹 명"
                onChange={handleInputChange}
                className="col-span-3"
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                설명
              </Label>
              <Input
                id="description"
                placeholder="재고 그룹 설명"
                onChange={handleInputChange}
                className="col-span-3"
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                이미지
              </Label>
              <Input id="image" type="file" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNewDialogOpen(false)}
            >
              취소
            </Button>
            <Button type="submit" onClick={handleSaveNew}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 재고 그룹 수정 팝업 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>"{selectedStock?.name}" 재고 수정</DialogTitle>
            <DialogDescription>
              재고 그룹의 이름, 설명, 이미지를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <Input
                id="name"
                placeholder="재고 그룹 명"
                value={selectedStock?.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                설명
              </Label>
              <Input
                id="description"
                placeholder="재고 그룹 설명"
                value={selectedStock?.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                이미지
              </Label>
              <Input id="image" type="file" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              취소
            </Button>
            <Button type="submit" onClick={handleSaveEdit}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
