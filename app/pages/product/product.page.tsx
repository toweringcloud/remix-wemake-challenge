import { Pencil, Plus, Save, Trash2, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
  type ActionFunction,
  type LoaderFunction,
} from "react-router";
import { z } from "zod";

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

// 상품 타입 정의
interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  [key: string]: unknown;
}

export const loader: LoaderFunction = async ({ request }: Route.LoaderArgs) => {
  const session = getCookieSession(request.headers.get("Cookie"));
  if (!session) throw new Response("Unauthorized", { status: 401 });
  if (!session?.cafeId) return redirect("/login");
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

// ✅ 1. zod를 사용하여 유효성 검사 스키마를 정의합니다.
const productSchema = z.object({
  name: z.string().min(1, { message: "상품 이름은 필수입니다." }),
  description: z.string().optional(),
  id: z.string().optional(),
});

export const action: ActionFunction = async ({ request }: Route.ActionArgs) => {
  const session = getCookieSession(request.headers.get("Cookie"));
  if (!session) throw new Response("Unauthorized", { status: 401 });
  if (!session?.cafeId) return redirect("/login");
  const cafeId = session.cafeId;

  const formData = await request.formData();
  console.log("products.formData", formData);
  const actionType = formData.get("actionType");
  if (!actionType || !cafeId) return;

  // ✅ 2. formData를 zod 스키마로 파싱합니다.
  const submission = productSchema.safeParse(Object.fromEntries(formData));

  // ✅ 3. 유효성 검사 실패 시, 에러 메시지를 클라이언트로 반환합니다.
  if (!submission.success) {
    return { errors: submission.error.flatten().fieldErrors };
  }

  const { name, description, id } = submission.data;
  const { supabase } = createClient(request);

  if (actionType === "C") {
    const { error } = await supabase
      .from("products")
      .insert({ name, description, cafe_id: cafeId });

    if (error) throw error;
    console.log(`products.C: cafe(${cafeId})`);
    return { ok: true, action: actionType };
  }

  if (actionType === "U") {
    const { error } = await supabase
      .from("products")
      .update({ name, description })
      .eq("id", id)
      .eq("cafe_id", cafeId);

    if (error) throw error;
    console.log(`products.U: cafe(${cafeId}), product(${id})`);
    return { ok: true, action: actionType };
  }

  if (actionType === "D") {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("cafe_id", cafeId);

    if (error) throw error;
    console.log(`products.D: cafe(${cafeId}), product(${id})`);
    return { ok: true, action: actionType };
  }

  return {
    ok: false,
    action: actionType,
    error: "Invalid action type",
    status: 400,
  };
};

export default function ProductsPage({ loaderData }: Route.ComponentProps) {
  const { roleCode } = useRoleStore();
  const navigate = useNavigate();
  const navigation = useNavigation(); // ✅ 폼 제출 상태를 추적

  // ✅ useActionData 훅으로 action의 반환값을 가져옵니다.
  const actionData = useActionData() as {
    ok?: boolean;
    errors?: { name?: string[]; description?: string[] };
  };

  // 상품 목록 조회
  const [products] = useState<Product[]>(loaderData || []);
  console.log("products.loaderData", loaderData);

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

  // 상품 수정
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  // 상품 삭제
  const [oneToDelete, setOneToDelete] = useState<Product | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const handleDeleteClick = (menu: Product) => {
    setOneToDelete(menu);
    setIsAlertOpen(true);
  };
  const confirmDelete = () => {
    if (!oneToDelete) return;
    console.log(`삭제 또는 비활성화 대상 : '${oneToDelete.name}'`);
    setIsAlertOpen(false);
    setOneToDelete(null);
  };

  // 접근 권한 확인
  useEffect(() => {
    if (roleCode !== "SA" && roleCode !== "MA") {
      alert("접근 권한이 없습니다.");
      navigate("/dashboard");
    }
  }, [roleCode, navigate]);

  // ✅ 폼 제출이 완료되었는지 확인
  const isSubmitting = navigation.state === "submitting";

  // ✅ actionData나 isSubmitting 상태가 변경될 때마다 실행
  useEffect(() => {
    // 폼 제출이 끝났고(idle), 작업이 성공적으로 완료되었다면
    if (!isSubmitting && actionData?.ok) {
      // 모든 다이얼로그를 닫습니다.
      setIsNewDialogOpen(false);
      setIsEditDialogOpen(false);
      setIsAlertOpen(false);
    }
  }, [actionData, isSubmitting]);

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
          <Form method="post">
            <div className="grid gap-4 py-4">
              {/* 등록(Create)임을 알리는 hidden input */}
              <input type="hidden" name="actionType" value="C" />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="상품 명"
                  onChange={handleInputChange}
                  className="col-span-3"
                  autoComplete="off"
                />
                {/* ✅ 이름 필드에 대한 에러 메시지 표시 */}
                {actionData?.errors?.name && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.name[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  설명
                </Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="상품 설명"
                  onChange={handleInputChange}
                  className="col-span-3"
                  autoComplete="off"
                />
                {/* ✅ 설명 필드에 대한 에러 메시지 표시 (필요 시) */}
                {actionData?.errors?.description && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.description[0]}
                  </p>
                )}
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
              {/* ✅ isSubmitting 상태를 사용해 버튼 비활성화 및 로딩 표시 */}
              <Button
                type="submit"
                className="group flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </Form>
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
          <Form method="post">
            <div className="grid gap-4 py-4">
              {/* 수정(Update)임을 알리는 hidden input */}
              <input type="hidden" name="actionType" value="U" />
              {/* 수정할 상품의 ID를 전달하는 hidden input */}
              <input type="hidden" name="id" value={selectedProduct?.id} />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="상품 명"
                  value={selectedProduct?.name || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                  autoComplete="off"
                />
                {/* ✅ 이름 필드에 대한 에러 메시지 표시 */}
                {actionData?.errors?.name && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.name[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  설명
                </Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="상품 설명"
                  value={selectedProduct?.description || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                  autoComplete="off"
                />
                {/* ✅ 설명 필드에 대한 에러 메시지 표시 (필요 시) */}
                {actionData?.errors?.description && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.description[0]}
                  </p>
                )}
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
              {/* ✅ isSubmitting 상태를 사용해 버튼 비활성화 및 로딩 표시 */}
              <Button
                type="submit"
                className="group flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ✅ 상품 삭제 팝업 */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              "{oneToDelete?.name}" 상품 내에 등록된 메뉴가 없을 경우에만 삭제
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
              <Form method="post">
                {/* 삭제(Delete)임을 알리는 hidden input */}
                <input type="hidden" name="actionType" value="D" />
                {/* 삭제할 상품의 ID를 전달하는 hidden input */}
                <input type="hidden" name="id" value={oneToDelete?.id} />

                <Button
                  type="submit"
                  variant="destructive"
                  className="group flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white transition-colors"
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4 group-hover:text-white transition-colors" />
                  {isSubmitting ? "처리 중..." : "삭제 확인"}
                </Button>
              </Form>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
