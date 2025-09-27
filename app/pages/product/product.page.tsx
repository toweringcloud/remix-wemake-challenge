import React, { useEffect, useState } from "react";
import {
  Form,
  useNavigate,
  type ActionFunction,
  type LoaderFunction,
} from "react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";

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

import type { Route } from "./+types/product.page";
import { ProductCard } from "~/components/product-card";
import { useRoleStore } from "~/stores/user.store";
import { getCookieSession } from "~/utils/cookie.server";
import { createClient } from "~/utils/supabase.server";

export const meta: Route.MetaFunction = () => [
  { title: "Products | Caferium" },
  { name: "description", content: "product list" },
];

export const loader: LoaderFunction = async ({ request }: Route.LoaderArgs) => {
  const session = getCookieSession(request.headers.get("Cookie"));
  if (!session) throw new Response("Unauthorized", { status: 401 });
  if (!session?.cafeId) return { cafe: null };
  const cafeId = session.cafeId;
  console.log("products.cafeId", cafeId);

  const { supabase } = createClient(request);
  const { data } = await supabase
    .from("products")
    .select()
    .eq("cafe_id", cafeId);

  if (data) {
    const products: Product[] = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.image_url,
      updatedAt: item.updated_at,
    }));
    console.log("products.R", products);
    return products;
  } else return [];
};

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

type Product = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  [key: string]: unknown;
};

export default function ProductsPage({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { roleCode } = useRoleStore();

  const [products] = useState<Product[]>(loaderData || []);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  // 폼 입력 값 업데이트
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
  const [recipeToDelete, setRecipeToDelete] = useState<Product | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const handleDeleteClick = (menu: Product) => {
    setRecipeToDelete(menu); // 어떤 메뉴를 삭제할지 state에 저장
    setIsAlertOpen(true); // Dialog를 엽니다.
  };
  const confirmDelete = () => {
    if (!recipeToDelete) return;
    // 실제 앱에서는 여기서 삭제 API를 호출합니다.
    console.log(`'${recipeToDelete.name}' 레시피를 삭제합니다.`);
    setIsAlertOpen(false);
    setRecipeToDelete(null);
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
        <h1 className="text-3xl font-bold text-amber-800">상품</h1>

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
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            name={product.name}
            description={product.description}
            imageUrl={product.imageUrl}
            action={
              roleCode === "SA" ||
              (roleCode === "MA" && (
                // 매니저일 경우: 수정/삭제 버튼
                <div className="flex items-center gap-2 ml-auto -mb-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="flex items-center gap-1 text-sm text-amber-600 hover:text-white p-2 rounded-md hover:bg-amber-500 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
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

      {/* ✅ 상품 등록 팝업 */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>상품 등록</DialogTitle>
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
                  placeholder="상품 명"
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
                  placeholder="상품 설명"
                  onChange={handleInputChange}
                  className="col-span-3"
                  autoComplete="off"
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

      {/* ✅ 상품 수정 팝업 */}
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
                  placeholder="상품 명"
                  value={selectedProduct?.name || ""}
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
                  placeholder="상품 설명"
                  value={selectedProduct?.description || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                  autoComplete="off"
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

      {/* ✅ 상품 삭제 팝업 */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              "{recipeToDelete?.name}" 상품 내에 등록된 메뉴가 없을 경우에만
              삭제 가능합니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRecipeToDelete(null)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              삭제 확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
