import React, { useEffect, useState } from "react";
import {
  Form,
  useNavigate,
  type ActionFunction,
  type LoaderFunction,
} from "react-router";
import { Pencil, Trash2 } from "lucide-react";
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

import type { Route } from "./+types/product.page";
import { ProductCard } from "~/components/product-card";
import { useRoleStore } from "~/stores/user.store";
import { createClient } from "~/utils/supabase.server";
import { parseCookie } from "~/utils/cookie.server";

export const meta: Route.MetaFunction = () => [
  { title: "Products | Caferium" },
  { name: "description", content: "product list" },
];

export const action: ActionFunction = async ({ request }: Route.ActionArgs) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const cafeId = formData.get("cafeId");
  const productId = formData.get("productId");
  console.log("products.formData", formData);

  if (!actionType || !cafeId || !productId) return;
  const { supabase } = createClient(request);

  switch (actionType) {
    case "C":
      const { data: resIns } = await supabase
        .from("products")
        .insert(formData)
        .eq("cafe_id", cafeId as string);
      console.log(`products.C`, resIns);
      break;

    case "U":
      const { data: resUpd } = await supabase
        .from("products")
        .update(formData)
        .eq("cafe_id", cafeId as string)
        .eq("id", productId);
      console.log(`products.U`, resUpd);
      break;

    // case "D":
    //   const { data: resDel } = await supabase
    //     .from("products")
    //     .delete(formData)
    //     .eq("cafe_id", cafeId as string)
    //     .eq("id", productId);
    //   console.log(`products.D`, resDel);
    //   break;
  }
};

export const loader: LoaderFunction = async ({ request }: Route.LoaderArgs) => {
  const cookies = parseCookie(request.headers.get("Cookie"));
  const session = JSON.parse(
    Buffer.from(cookies.session || "", "base64").toString()
  );
  if (!session?.cafeId) return { cafe: null };

  const cafeId = session.cafeId;
  console.log("products.cafeId", cafeId);

  const { supabase } = createClient(request);
  const { data: products } = await supabase
    .from("products")
    .select()
    .eq("cafe_id", cafeId);
  console.log("products.R", products);
  return products;
};

type Product = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

export default function ProductsPage({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { cafeId, roleCode } = useRoleStore();
  console.log("products.roleCode", roleCode);
  console.log("products.R", loaderData);

  const [products] = useState<Product[]>(loaderData || []);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        [id]: value,
      });
    }
  };

  // 상품 등록
  const handleNewClick = () => {
    setIsNewDialogOpen(true);
  };
  const handleSaveNew = () => {
    console.log("products.saveNew:", selectedProduct);
    setIsNewDialogOpen(false);
  };

  // 상품 수정
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };
  const handleSaveEdit = () => {
    console.log("products.saveEdit:", selectedProduct);
    setIsEditDialogOpen(false);
  };

  // 상품 삭제
  const handleDelete = (productId: number) => {
    alert(`상품(${productId})을 삭제합니다.`);
  };

  // 접근 권한 확인
  useEffect(() => {
    if (roleCode !== "SA" && roleCode !== "MA") {
      alert("접근 권한이 없습니다.");
      navigate("/dashboard");
    }
  }, [roleCode, navigate]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-800">상품 관리</h1>

        {roleCode === "SA" && (
          <button
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
            onClick={() => handleNewClick()}
          >
            + 새 상품 등록
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            name={product.name}
            description={product.description}
            imageUrl={product.imageUrl}
            action={
              roleCode === "SA" && (
                <div className="absolute top-2 right-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditClick(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-white p-2 rounded-md hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              )
            }
          />
        ))}
      </div>

      {/* New Product Dialog */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>"{selectedProduct?.name}" 상품 등록</DialogTitle>
            <DialogDescription>
              상품의 이름, 설명, 이미지를 등록합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form method="post">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
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
            </Form>
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

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>"{selectedProduct?.name}" 상품 수정</DialogTitle>
            <DialogDescription>
              상품의 이름, 설명, 이미지를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form method="post">
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
            </Form>
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
