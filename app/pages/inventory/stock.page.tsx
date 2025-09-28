import React, { useState } from "react";
import { Form, type LoaderFunction } from "react-router";
import { Pencil, Plus, Save, Trash2, XCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
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

// ✅ 1. 재고(Stock) 데이터 정의
type Stock = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

export default function StocksPage({ loaderData }: Route.ComponentProps) {
  const { roleCode } = useRoleStore();

  // 재고 목록 조회
  const [stocks] = useState<Stock[]>(loaderData || []);
  console.log("stocks.loaderData", loaderData);

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
  const [oneToDelete, setOneToDelete] = useState<Stock | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const handleDeleteClick = (menu: Stock) => {
    setOneToDelete(menu);
    setIsAlertOpen(true);
  };
  const confirmDelete = () => {
    if (!oneToDelete) return;
    console.log(`삭제 또는 비활성화 대상 : '${oneToDelete.name}'`);
    setIsAlertOpen(false);
    setOneToDelete(null);
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
                    onClick={() => handleDeleteClick(stock)}
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

      {/* ✅ 재고 등록 팝업 */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>재고 등록</DialogTitle>
            <DialogDescription>
              재고 그룹의 이름, 설명, 이미지를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <Form method="post">
            <div className="grid gap-4 pt-2 pb-8">
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
                <Label htmlFor="picture" className="text-right">
                  이미지
                </Label>
                <Input
                  id="picture"
                  name="picture"
                  type="file"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="group flex items-center gap-1 hover:text-red-600 hover:border-red-600 transition-colors"
                onClick={() => setIsNewDialogOpen(false)}
              >
                <XCircle className="h-4 w-4" />
                취소
              </Button>
              <Button
                type="submit"
                className="group flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                onClick={handleSaveNew}
              >
                <Save className="h-4 w-4" />
                저장
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ✅ 재고 수정 팝업 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>"{selectedStock?.name}" 재고 수정</DialogTitle>
            <DialogDescription>
              재고 그룹의 이름, 설명, 이미지를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <Form method="post">
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
                <Label htmlFor="picture" className="text-right">
                  이미지
                </Label>
                <Input
                  id="picture"
                  name="picture"
                  type="file"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="group flex items-center gap-1 hover:text-red-600 hover:border-red-600 transition-colors"
                onClick={() => setIsEditDialogOpen(false)}
              >
                <XCircle className="h-4 w-4" />
                취소
              </Button>
              <Button
                type="submit"
                className="group flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                onClick={handleSaveEdit}
              >
                <Save className="h-4 w-4" />
                저장
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ✅ 재고 삭제 팝업 */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              "{oneToDelete?.name}" 재고 내에 등록된 아이템이 없을 경우에만 삭제
              가능합니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                variant="outline"
                className="group flex items-center gap-1 hover:text-red-600 hover:border-red-600 transition-colors"
                onClick={() => setOneToDelete(null)}
              >
                <XCircle className="h-4 w-4 group-hover:text-red-600 transition-colors" />
                취소
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                className="group flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white transition-colors"
                onClick={confirmDelete}
              >
                <Trash2 className="h-4 w-4 group-hover:text-white transition-colors" />
                삭제 확인
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
