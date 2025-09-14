import React, { useState } from "react";
import { useRoleStore } from "../../stores/role.store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
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
import { Pencil, PlusCircle } from "lucide-react";

// ✅ 1. 재고 그룹(Stock) 데이터의 타입을 명확하게 정의합니다.
type Stock = {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
};

// 임시 데이터 (실제로는 DB에서 조회)
const mockStocks: Stock[] = [
  {
    id: 1,
    name: "원두",
    description: "커피 추출에 사용되는 원두",
    image: "https://via.placeholder.com/150/6b4f4b/ffffff?text=Beans",
  },
  {
    id: 2,
    name: "유제품",
    description: "우유, 크림, 요거트 등",
    image: "https://via.placeholder.com/150/ffffff/000000?text=Dairy",
  },
  {
    id: 3,
    name: "시럽 및 소스",
    description: "음료에 사용되는 시럽과 소스",
    image: "https://via.placeholder.com/150/f9a825/ffffff?text=Syrup",
  },
  {
    id: 4,
    name: "일회용품",
    description: "컵, 빨대, 냅킨 등",
    image: "https://via.placeholder.com/150/e0e0e0/000000?text=ETC",
  },
];

export default function StocksPage() {
  const { role } = useRoleStore();

  // ✅ 2. useState에 Stock 타입 또는 null을 가질 수 있다고 명시합니다.
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    // 실제 앱에서는 여기서 수정 API를 호출합니다.
    console.log("저장될 재고 그룹 정보:", selectedStock);
    setIsEditDialogOpen(false);
  };

  // ✅ 3. Input 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (selectedStock) {
      setSelectedStock({
        ...selectedStock,
        [id]: value,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-800">재고 그룹 관리</h1>
        {role === "manager" && (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> 새 그룹 추가
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockStocks.map((stock) => {
          const placeholderImageUrl = `https://dummyimage.com/300x200/f5f5f4/a1887f.png&text=${encodeURIComponent(stock.name)}`;
          const finalImageUrl = stock.image || placeholderImageUrl;
          return (
            <Card key={stock.id} className="group relative overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-video bg-stone-100">
                  <img
                    src={finalImageUrl}
                    alt={stock.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl text-amber-800">
                  {stock.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  {stock.description}
                </CardDescription>
              </CardContent>
              {role === "manager" && (
                <div className="absolute top-2 right-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditClick(stock)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* 수정 Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>"{selectedStock?.name}" 그룹 수정</DialogTitle>
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
                value={selectedStock?.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                설명
              </Label>
              <Input
                id="description"
                value={selectedStock?.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
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
            <Button type="submit" onClick={handleSaveChanges}>
              저장하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
