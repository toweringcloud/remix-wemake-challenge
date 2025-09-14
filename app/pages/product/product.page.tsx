import React, { useState } from "react";
import { useRoleStore } from "~/stores/role.store";
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
import { Pencil } from "lucide-react";
import { Link } from "react-router";

// ✅ 1. 상품 데이터의 타입을 명확하게 정의합니다.
type Product = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

// 임시 데이터
const mockProducts: Product[] = [
  {
    id: 1,
    name: "커피",
    description: "에스프레소 기반의 다양한 커피 음료",
    imageUrl: "https://via.placeholder.com/150/6b4f4b/ffffff?text=Coffee",
  },
  {
    id: 2,
    name: "라떼",
    description:
      "에스프레소와 우유, 또는 다양한 베이스가 조화로운 부드러운 음료",
    imageUrl: "https://via.placeholder.com/150/c7a487/ffffff?text=Latte",
  },
  {
    id: 3,
    name: "티",
    description: "전통차와 향긋한 과일차",
    imageUrl: "https://via.placeholder.com/150/9b6a5c/ffffff?text=Tea",
  },
  {
    id: 4,
    name: "에이드",
    description: "과일청과 탄산수의 상큼한 조화가 돋보이는 음료",
    imageUrl: "https://via.placeholder.com/150/87ceeb/ffffff?text=Ade",
  },
];

export default function ProductsPage() {
  const { role } = useRoleStore();

  // ✅ 2. useState에 Product 타입 또는 null을 가질 수 있다고 명시합니다.
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    console.log("저장될 상품 정보:", selectedProduct);
    setIsEditDialogOpen(false);
  };

  // ✅ 3. onChange 핸들러를 타입에 안전하게 수정합니다.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        [id]: value,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-800">
          상품(메뉴 그룹) 관리
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <Link to={`/dashboard/products/${product.id}/menus`} key={product.id}>
            <Card className="group relative overflow-hidden h-full">
              <CardHeader className="p-0">
                <div className="aspect-video bg-stone-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl text-amber-800">
                  {product.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  {product.description}
                </CardDescription>
              </CardContent>
              {role === "manager" && (
                <div className="absolute top-2 right-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditClick(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>"{selectedProduct?.name}" 상품 수정</DialogTitle>
            <DialogDescription>
              상품의 이름, 설명, 이미지를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <Input
                id="name"
                value={selectedProduct?.name || ""}
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
                value={selectedProduct?.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="picture" className="text-right">
                이미지
              </Label>
              <Input id="picture" type="file" className="col-span-3" />
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
