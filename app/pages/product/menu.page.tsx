import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil, PlusCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useRoleStore } from "~/stores/user.store";

// Menu 타입 정의 (기존과 동일)
type Menu = {
  id: number;
  name: string;
  isHot: boolean;
  price: number;
  stock: number;
  isActive: boolean;
  image: string | null;
};

// 임시 데이터에 이미지 URL 추가
const mockMenus: Menu[] = [
  {
    id: 1,
    name: "아메리카노",
    isHot: true,
    price: 4500,
    stock: 100,
    isActive: true,
    image: "https://via.placeholder.com/150/6b4f4b/ffffff?text=Americano",
  },
  {
    id: 2,
    name: "아메리카노",
    isHot: false,
    price: 5000,
    stock: 100,
    isActive: true,
    image: null,
  },
  {
    id: 3,
    name: "카페라떼",
    isHot: true,
    price: 5000,
    stock: 80,
    isActive: false,
    image: "https://via.placeholder.com/150/c7a487/ffffff?text=Latte",
  },
];

export default function MenusPage() {
  const { roleCode } = useRoleStore();
  const { productId } = useParams();

  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // ... (기존 핸들러 함수들은 그대로 유지)
  const handleEditClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    console.log("저장될 메뉴 정보:", selectedMenu);
    setIsEditDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ...
  };

  const handleSwitchChange = (id: "isHot" | "isActive", checked: boolean) => {
    // ...
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-800">
          {productId}번 상품의 메뉴 관리
        </h1>
        {roleCode === "MA" && (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> 새 메뉴 추가
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockMenus.map((menu) => {
          const placeholderImageUrl = `https://dummyimage.com/300x200/f5f5f4/a1887f.png&text=${encodeURIComponent(menu.name)}`;
          const finalImageUrl = menu.image || placeholderImageUrl;

          return (
            <Card
              key={menu.id}
              className={`group relative overflow-hidden ${!menu.isActive && "opacity-50"}`}
            >
              {/* ✅ 이미지 표시를 위한 CardHeader 추가 */}
              <CardHeader className="p-0">
                <div className="aspect-video bg-stone-100">
                  <img
                    src={finalImageUrl}
                    alt={menu.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-amber-800">
                      {menu.name}
                    </CardTitle>
                    <CardDescription
                      className={menu.isHot ? "text-red-500" : "text-blue-500"}
                    >
                      {menu.isHot ? "HOT" : "ICE"}
                    </CardDescription>
                  </div>
                  <p className="text-lg font-semibold">
                    {menu.price.toLocaleString()}원
                  </p>
                </div>
                <div className="text-sm text-stone-500 mt-2">
                  <span>재고: {menu.stock}개</span>
                  <span className="ml-2">|</span>
                  <span className="ml-2">
                    상태: {menu.isActive ? "판매중" : "품절"}
                  </span>
                </div>
              </CardContent>
              {roleCode === "MA" && (
                <div className="absolute top-2 right-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditClick(menu)}
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
            <DialogTitle>"{selectedMenu?.name}" 메뉴 수정</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                메뉴명
              </Label>
              <Input
                id="name"
                value={selectedMenu?.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                가격
              </Label>
              <Input
                id="price"
                type="number"
                value={selectedMenu?.price || 0}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                재고
              </Label>
              <Input
                id="stock"
                type="number"
                value={selectedMenu?.stock || 0}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            {/* ✅ 이미지 수정 필드 추가 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                이미지
              </Label>
              <Input id="image" type="file" className="col-span-3" />
            </div>
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isHot"
                  checked={selectedMenu?.isHot}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isHot", checked)
                  }
                />
                <Label htmlFor="isHot">HOT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={selectedMenu?.isActive}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isActive", checked)
                  }
                />
                <Label htmlFor="isActive">판매중</Label>
              </div>
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
