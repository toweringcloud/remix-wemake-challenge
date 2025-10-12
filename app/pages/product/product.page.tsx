import { Loader, Pencil, Plus, Save, Trash2, XCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  type ActionFunction,
  type LoaderFunction,
} from "react-router";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
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
import { Switch } from "~/components/ui/switch";

import type { Route } from "./+types/product.page";
import { ProductCard } from "~/components/product-card";
import { getCookieSession } from "~/lib/cookie.server";
import { createThumbnail } from "~/lib/image.server";
import { createClient } from "~/lib/supabase.server";
import { cn } from "~/lib/utils";
import { useRoleStore } from "~/stores/user.store";

export const meta: Route.MetaFunction = () => [
  { title: "Products | Caferium" },
  { name: "description", content: "product list" },
];

// 상품 타입 정의
interface Product {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  [key: string]: any;
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
    .eq("cafe_id", cafeId)
    .order("name");

  if (data) {
    const products: Product[] = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.image_url,
      imageThumbUrl: item.image_thumb_url,
      updatedAt: item.updated_at,
    }));
    // console.log("products.R", products);
    return products;
  } else return [];
};

// ✅ zod를 사용하여 유효성 검사 스키마를 정의합니다.
const schemaForInsert = z.object({
  name: z.string().min(1, { message: "상품 이름은 필수입니다." }),
  description: z.string().optional(),
});
const schemaForUpdate = z.object({
  id: z.string().min(1, { message: "상품 아이디는 필수입니다." }),
  name: z.string().min(1, { message: "상품 이름은 필수입니다." }),
  description: z.string().optional(),
});
const schemaForDelete = z.object({
  id: z.string().min(1, { message: "상품 아이디는 필수입니다." }),
});

export const action: ActionFunction = async ({ request }: Route.ActionArgs) => {
  try {
    const session = getCookieSession(request.headers.get("Cookie"));
    if (!session) throw new Response("Unauthorized", { status: 401 });
    if (!session?.cafeId) return redirect("/login");

    const cafeId = session.cafeId;
    const formData = await request.formData();
    const actionType = formData.get("actionType");

    if (!actionType || !["C", "U", "D"].includes(actionType.toString())) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid action type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { supabase } = createClient(request);
    const storageInstance = supabase.storage.from("images");
    const storageDivision = `${cafeId}/product`; // 상품 이미지용 버킷 카테고리

    // --- C: 생성 (Create) ---
    if (actionType === "C") {
      // ✅ formData 유효성 검사 실패 시, 에러 메시지를 클라이언트로 반환합니다.
      const submission = schemaForInsert.safeParse(
        Object.fromEntries(formData)
      );
      if (!submission.success) {
        return new Response(
          JSON.stringify({ errors: submission.error.flatten().fieldErrors }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      const { name, description } = submission.data;

      let imageUrl: string | null = null;
      let imageThumbUrl: string | null = null;
      const imageFile = formData.get("image") as File;

      if (imageFile && imageFile.size > 0) {
        // ✅ 파일 확장자를 소문자로 변환합니다.
        const originalName = imageFile.name;
        const extension = originalName.split(".").pop()?.toLowerCase();
        const baseName = originalName.split(".").slice(0, -1).join(".");
        console.log("products.C.imageFile", imageFile);

        // ✅ 확장자가 없는 파일이거나 유효하지 않은 경우를 대비
        if (!extension || !["jpg", "jpeg", "png", "webp"].includes(extension)) {
          return new Response(
            JSON.stringify({
              ok: false,
              errors: { image: ["지원하지 않는 파일 형식입니다."] },
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // 1. 원본 이미지 업로드
        const originalFilePath = `${storageDivision}/${uuidv4()}-original.${extension}`;
        const { error: originalUploadError } = await storageInstance.upload(
          originalFilePath,
          imageFile,
          {
            contentType: imageFile.type, // 원본 MIME 타입 지정
          }
        );

        if (originalUploadError) {
          return new Response(
            JSON.stringify({
              ok: false,
              errors: { image: ["이미지 업로드 실패"] },
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        imageUrl =
          storageInstance.getPublicUrl(originalFilePath).data.publicUrl;

        // 2. 썸네일 생성 및 업로드
        try {
          const { buffer: thumbBuffer, mimeType: thumbMimeType } =
            await createThumbnail(imageFile);
          const thumbFilePath = `${storageDivision}/${uuidv4()}-thumb.webp`;

          const { error: thumbUploadError } = await storageInstance.upload(
            thumbFilePath,
            thumbBuffer,
            {
              contentType: thumbMimeType, // 썸네일 MIME 타입 지정
            }
          );

          if (thumbUploadError) {
            console.error("썸네일 업로드 실패:", thumbUploadError);
            // 썸네일 업로드 실패 시 원본만 저장하고 계속 진행하거나, 더 엄격하게 에러 처리
            // 여기서는 경고만 출력하고 null로 처리
          } else {
            imageThumbUrl =
              storageInstance.getPublicUrl(thumbFilePath).data.publicUrl;
          }
        } catch (imageProcessError) {
          console.error("이미지 처리(썸네일 생성) 실패:", imageProcessError);
          // 썸네일 생성 실패 시에도 원본만 저장하고 계속 진행
        }
      }

      const { error } = await supabase.from("products").insert({
        name,
        description,
        image_url: imageUrl,
        image_thumb_url: imageThumbUrl,
        cafe_id: cafeId,
      });

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, error: error.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      console.log(`products.C: cafe(${cafeId})`);
      return new Response(JSON.stringify({ ok: true, action: actionType }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- U: 수정 (Update) ---
    if (actionType === "U") {
      const submission = schemaForUpdate.safeParse(
        Object.fromEntries(formData)
      );
      if (!submission.success) {
        return new Response(
          JSON.stringify({ errors: submission.error.flatten().fieldErrors }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      const { id: productId, name, description } = submission.data;

      const updateData: {
        name?: string;
        description?: string;
        image_url?: string | null;
        image_thumb_url?: string | null;
      } = { name, description };
      const imageFile = formData.get("image") as File;
      const removeImage = formData.get("removeImage") === "true"; // 이미지 삭제 스위치 값

      // 기존 이미지 URL 조회 (삭제를 위해)
      const { data: existingOne, error: fetchError } = await supabase
        .from("products")
        .select("image_url, image_thumb_url")
        .eq("id", productId)
        .single();

      if (fetchError || !existingOne) {
        return new Response(
          JSON.stringify({ ok: false, error: "Product not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // 새 이미지 업로드 또는 기존 이미지 삭제 처리
      if (imageFile && imageFile.size > 0 && !removeImage) {
        // 새 이미지 업로드 전, 기존 이미지(원본 및 썸네일) 삭제
        if (existingOne.image_url) {
          const oldOriginalFilePath =
            existingOne.image_url.split("/images/")[1];
          const filesToDelete = [oldOriginalFilePath];
          if (existingOne.image_thumb_url) {
            // ✅ 썸네일 경로도 삭제 목록에 추가
            const oldThumbFilePath =
              existingOne.image_thumb_url.split("/images/")[1];
            filesToDelete.push(oldThumbFilePath);
          }
          await storageInstance.remove(filesToDelete); // 일괄 삭제
        }

        // ✅ 파일 확장자를 소문자로 변환합니다.
        const originalName = imageFile.name;
        const extension = originalName.split(".").pop()?.toLowerCase();
        const baseName = originalName.split(".").slice(0, -1).join(".");
        console.log("products.U.imageFile", imageFile);

        // ✅ 확장자가 없는 파일이거나 유효하지 않은 경우를 대비
        if (!extension || !["jpg", "jpeg", "png", "webp"].includes(extension)) {
          return new Response(
            JSON.stringify({
              ok: false,
              errors: { image: ["지원하지 않는 파일 형식입니다."] },
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // 1. 새 원본 이미지 업로드
        const originalFilePath = `${storageDivision}/${uuidv4()}-original.${extension}`;
        const { error: originalUploadError } = await storageInstance.upload(
          originalFilePath,
          imageFile,
          { contentType: imageFile.type }
        );

        if (originalUploadError) {
          return new Response(
            JSON.stringify({
              ok: false,
              errors: { image: ["새 이미지 업로드 실패"] },
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        updateData.image_url =
          storageInstance.getPublicUrl(originalFilePath).data.publicUrl;

        // 2. 새 썸네일 생성 및 업로드
        try {
          const { buffer: thumbBuffer, mimeType: thumbMimeType } =
            await createThumbnail(imageFile);
          const thumbFilePath = `${storageDivision}/${uuidv4()}-thumb.webp`;

          const { error: thumbUploadError } = await storageInstance.upload(
            thumbFilePath,
            thumbBuffer,
            { contentType: thumbMimeType }
          );

          if (thumbUploadError) {
            console.error("새 썸네일 업로드 실패:", thumbUploadError);
          } else {
            updateData.image_thumb_url =
              storageInstance.getPublicUrl(thumbFilePath).data.publicUrl;
          }
        } catch (imageProcessError) {
          console.error("새 이미지 처리(썸네일 생성) 실패:", imageProcessError);
        }
      } else if (removeImage) {
        // 이미지 삭제 요청 처리 (원본 및 썸네일 모두)
        if (existingOne.image_url) {
          const oldOriginalFilePath =
            existingOne.image_url.split("/images/")[1];
          const filesToDelete = [oldOriginalFilePath];
          if (existingOne.image_thumb_url) {
            // ✅ 썸네일 경로도 삭제 목록에 추가
            const oldThumbFilePath =
              existingOne.image_thumb_url.split("/images/")[1];
            filesToDelete.push(oldThumbFilePath);
          }
          await storageInstance.remove(filesToDelete);
        }
        updateData.image_url = null;
        updateData.image_thumb_url = null; // ✅ 썸네일 URL도 null로 설정
      } else if (
        imageFile.size === 0 &&
        !removeImage &&
        existingOne.image_url
      ) {
        // 이미지 파일이 없고, 삭제 요청도 없으면 기존 이미지 유지
        updateData.image_url = existingOne.image_url;
        updateData.image_thumb_url = existingOne.image_thumb_url;
      } else if (
        imageFile.size === 0 &&
        !removeImage &&
        !existingOne.image_url
      ) {
        // 이미지 파일이 없고, 삭제 요청도 없고, 기존 이미지도 없으면 null 유지
        updateData.image_url = null;
        updateData.image_thumb_url = null;
      }

      const { error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", productId)
        .eq("cafe_id", cafeId);

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, error: error.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      console.log(`products.U: cafe(${cafeId}), product(${productId})`);
      return new Response(JSON.stringify({ ok: true, action: actionType }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- D: 삭제 (Delete) ---
    if (actionType === "D") {
      const submission = schemaForDelete.safeParse(
        Object.fromEntries(formData)
      );
      if (!submission.success) {
        return new Response(
          JSON.stringify({ errors: submission.error.flatten().fieldErrors }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      const { id: productId } = submission.data;

      const { data: oneToDelete, error: selectError } = await supabase
        .from("products")
        .select("image_url, image_thumb_url, menus(id)") // 연결된 메뉴가 있는지 확인
        .eq("id", productId)
        .single();

      if (selectError || !oneToDelete) {
        return new Response(
          JSON.stringify({ ok: false, error: "Product not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // ✅ 관련 메뉴가 있으면 삭제 거부
      if (oneToDelete.menus && oneToDelete.menus.length > 0) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "이 상품에 연결된 메뉴가 있어 삭제할 수 없습니다.",
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (oneToDelete.image_url) {
        // ✅ 원본 이미지 경로
        const originalFilePath = oneToDelete.image_url.split("/images/")[1];
        const filesToDelete = [originalFilePath];

        if (oneToDelete.image_thumb_url) {
          // ✅ 썸네일 이미지 경로
          const thumbFilePath =
            oneToDelete.image_thumb_url.split("/images/")[1];
          filesToDelete.push(thumbFilePath);
        }
        await storageInstance.remove(filesToDelete); // 일괄 삭제
      }

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("cafe_id", cafeId);

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, error: error.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      console.log(`products.D: cafe(${cafeId}), product(${productId})`);
      return new Response(JSON.stringify({ ok: true, action: actionType }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (outerError: any) {
    // ✅ 모든 예외를 최종적으로 catch
    console.error("Unhandled error in action function:", outerError);
    return new Response(
      JSON.stringify({
        ok: false,
        error: "서버 내부 오류 발생. 콘솔을 확인하세요.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export default function ProductsPage() {
  // 모든 훅을 컴포넌트 최상단에 조건 없이 호출합니다.
  const { roleCode, isLoading } = useRoleStore();
  const navigation = useNavigation(); // ✅ 폼 제출 상태를 추적
  const navigate = useNavigate();

  // 상품 목록 조회
  const loaderData = useLoaderData() as Product[];
  const products = loaderData;

  // 상품 등록/수정/삭제 결과 조회
  const actionData = useActionData() as {
    action: "C" | "U" | "D";
    ok: boolean;
    message?: string;
    error?: string;
    errors?: { name?: string[]; description?: string[]; image?: string[] };
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRemoveImage, setIsRemoveImage] = useState(false);
  const [oneToDelete, setOneToDelete] = useState<Product | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);

  // 폼 제출이 완료되었는지 확인
  const isSubmitting = navigation.state === "submitting";

  // 이미지 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setIsRemoveImage(false); // 새 파일 선택 시 이미지 삭제 스위치 비활성화
    } else {
      setImagePreview(selectedProduct?.imageUrl || null); // 파일 선택 취소 시 기존 이미지로 돌아감
    }
  };

  // 이미지 삭제 스위치 핸들러
  const handleRemoveImageToggle = (checked: boolean) => {
    setIsRemoveImage(checked);
    if (checked) {
      setImagePreview(null); // 삭제 선택 시 미리보기 제거
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // 파일 인풋 초기화
      }
    } else {
      setImagePreview(selectedProduct?.imageUrl || null); // 삭제 해제 시 기존 이미지로 복원
    }
  };

  // 상품 등록
  const handleNewClick = () => {
    setSelectedProduct(null); // 새 상품 등록 시 기존 선택 상품 초기화
    setImagePreview(null); // 미리보기 초기화
    setIsNewDialogOpen(true);
  };

  // 상품 수정
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setImagePreview(product.imageUrl || null); // 기존 이미지 미리보기 설정
    setIsRemoveImage(false); // 수정 시 기본은 이미지 유지
    setIsEditDialogOpen(true);
  };

  // 상품 삭제
  const handleDeleteClick = (menu: Product) => {
    setOneToDelete(menu);
    setIsAlertOpen(true);
  };

  // 삭제 확인 버튼 클릭 시 폼을 수동으로 제출하는 핸들러
  const handleConfirmDelete = () => {
    if (deleteFormRef.current) {
      console.log("Attempting to manually submit delete form.");
      deleteFormRef.current.submit();
    }
  };

  // 폼 제출 핸들러 (디버깅용)
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submission started!");
    const formData = new FormData(event.currentTarget);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    // file input의 파일 정보도 확인
    const imageFile = formData.get("image") as File;
    if (imageFile) {
      console.log(
        "Image File:",
        imageFile.name,
        imageFile.size,
        imageFile.type
      );
    }
  };

  // ✅ actionData나 isSubmitting 상태가 변경될 때마다 실행
  useEffect(() => {
    if (actionData) {
      if (actionData.ok === false) {
        // ✅ 실패 메시지 표시
        toast.error("상품 관리", {
          description:
            actionData.error ||
            actionData.errors?.image?.[0] ||
            `상품 처리(${actionData.action}) 중 오류가 발생했습니다.`,
        });
      } else if (actionData.ok === true) {
        let successMessage = "상품이 성공적으로 처리되었습니다.";
        if (actionData.action === "C")
          successMessage = "상품이 성공적으로 등록되었습니다.";
        if (actionData.action === "U")
          successMessage = "상품이 성공적으로 수정되었습니다.";
        if (actionData.action === "D")
          successMessage = "상품이 성공적으로 삭제되었습니다.";

        // ✅ 성공 메시지 표시
        toast.success("상품 관리", {
          description: successMessage,
        });
      }
    }

    // 폼 제출이 끝났고(idle), 작업이 성공적으로 완료되었다면
    if (!isSubmitting && actionData?.ok) {
      // 모든 다이얼로그를 닫습니다.
      setIsNewDialogOpen(false);
      setIsEditDialogOpen(false);
      setIsAlertOpen(false);
      setImagePreview(null);
      setIsRemoveImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // 성공적으로 작업 완료 후, 페이지를 다시 로드하여 최신 데이터 반영
      navigate(".", { replace: true });
    }
  }, [actionData, isSubmitting, navigate]);

  // 페이지 접근 권한 확인
  useEffect(() => {
    // roleCode가 로딩 중이거나 (아직 확정되지 않았거나) null이면 아무것도 하지 않습니다.
    if (isLoading || roleCode === null) {
      return;
    }
    if (!["SA", "MA"].includes(roleCode)) {
      toast.error("접근 권한이 없습니다.");
      navigate("/dashboard");
    }
  }, [roleCode, isLoading, navigate]);

  // ✅ 모든 훅이 호출된 후에, 데이터 로딩 상태에 따른 조기 리턴(early return)을 실행합니다.
  // 로딩 중이거나 필수 데이터가 없으면 로딩 스피너나 null을 반환하는 것이 좋습니다.
  if (!loaderData || !roleCode) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-800">상품</h1>

        {["SA", "MA"].includes(roleCode) && (
          <button
            className="cursor-pointer bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 flex flex-row gap-2 items-center"
            onClick={handleNewClick}
          >
            <Plus className="h-4 w-4" />
            등록
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
            imageThumbUrl={product.imageThumbUrl}
            action={
              ["SA", "MA"].includes(roleCode) && (
                // 매니저일 경우: 수정/삭제 버튼
                <div className="flex items-center gap-2 ml-auto -mb-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="cursor-pointer flex items-center gap-1 text-sm text-amber-600 hover:text-white p-2 rounded-md hover:bg-amber-500 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="cursor-pointer flex items-center gap-1 text-sm text-red-600 hover:text-white p-2 rounded-md hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              )
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
          <Form
            method="post"
            encType="multipart/form-data"
            onSubmit={handleFormSubmit} // 디버깅용 코드 유지
          >
            <div className="grid gap-4 py-4">
              <input type="hidden" name="actionType" value="C" />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="상품 명"
                  className="col-span-3"
                  autoComplete="off"
                  defaultValue=""
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
                  className="col-span-3"
                  autoComplete="off"
                  defaultValue=""
                />
                {/* ✅ 설명 필드에 대한 에러 메시지 표시 (필요 시) */}
                {actionData?.errors?.description && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.description[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="image" className="text-right pt-2">
                  이미지
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    type="file"
                    id="image"
                    name="image"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className={cn(
                      "block w-full border-0 p-0 file:bg-green-600 file:text-white file:px-4 file:rounded-md file:border-0 hover:file:bg-green-700 file:cursor-pointer",
                      imagePreview ? "text-slate-500" : "text-transparent"
                    )}
                  />
                  {actionData?.errors?.image && (
                    <p className="text-sm text-red-500">
                      {actionData.errors.image[0]}
                    </p>
                  )}
                  {imagePreview && (
                    <div className="w-full h-32 overflow-hidden flex items-center justify-center border rounded-md bg-gray-50">
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        className="max-h-full max-w-full object-contain" /* ✅ 이미지 크기 조정 */
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer group flex items-center gap-1 hover:text-red-600 hover:border-red-600 transition-colors"
                onClick={() => setIsNewDialogOpen(false)}
              >
                <XCircle className="h-4 w-4" />
                취소
              </Button>
              {/* ✅ isSubmitting 상태를 사용해 버튼 비활성화 및 로딩 표시 */}
              <Button
                type="submit"
                className="cursor-pointer group flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white transition-colors"
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
          <Form
            method="post"
            encType="multipart/form-data"
            onSubmit={handleFormSubmit} // 디버깅용 코드 유지
          >
            <div className="grid gap-4 py-4">
              <input type="hidden" name="actionType" value="U" />
              <input type="hidden" name="id" value={selectedProduct?.id} />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="상품 명"
                  className="col-span-3"
                  autoComplete="off"
                  defaultValue={selectedProduct?.name || ""}
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
                  className="col-span-3"
                  autoComplete="off"
                  defaultValue={selectedProduct?.description || ""}
                />
                {/* ✅ 설명 필드에 대한 에러 메시지 표시 (필요 시) */}
                {actionData?.errors?.description && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.description[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="image" className="text-right pt-2">
                  이미지
                </Label>
                <div className="col-span-3 space-y-2">
                  {/* 이미지 관련 컨트롤들을 묶는 div */}
                  <Input
                    type="file"
                    id="image"
                    name="image"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={isRemoveImage}
                    className={cn(
                      "block w-full border-0 p-0 file:bg-green-600 file:text-white file:px-4 file:rounded-md file:border-0 hover:file:bg-green-700 file:cursor-pointer",
                      imagePreview ? "text-slate-500" : "text-transparent"
                    )}
                  />
                  {actionData?.errors?.image && (
                    <p className="text-sm text-red-500">
                      {actionData.errors.image[0]}
                    </p>
                  )}
                  {/* ✅ 이미지 미리보기 영역 */}
                  <div className="w-full h-32 overflow-hidden flex items-center justify-center border rounded-md bg-gray-50">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        className="max-h-full max-w-full object-contain" /* ✅ 이미지 크기 조정 */
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">이미지 없음</span>
                    )}
                  </div>
                  {/* ✅ 이미지 삭제 스위치 */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="removeImage"
                        name="removeImage"
                        checked={isRemoveImage}
                        onCheckedChange={handleRemoveImageToggle}
                      />
                      <Label
                        htmlFor="removeImage"
                        className="cursor-pointer text-sm font-normal"
                      >
                        {isRemoveImage ? (
                          <span className="text-red-500">이미지 삭제</span>
                        ) : (
                          <span className="text-gray-500">
                            이미지 유지 / 새 이미지 업로드
                          </span>
                        )}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer group flex items-center gap-1 hover:text-red-600 hover:border-red-600 transition-colors"
                onClick={() => setIsEditDialogOpen(false)}
              >
                <XCircle className="h-4 w-4" />
                취소
              </Button>
              {/* ✅ isSubmitting 상태를 사용해 버튼 비활성화 및 로딩 표시 */}
              <Button
                type="submit"
                className="cursor-pointer group flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white transition-colors"
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
              가능합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                variant="outline"
                className="cursor-pointer group flex items-center gap-1 hover:text-red-600 hover:border-red-600 transition-colors"
                onClick={() => setOneToDelete(null)}
              >
                <XCircle className="h-4 w-4 group-hover:text-red-600 transition-colors" />
                취소
              </Button>
            </AlertDialogCancel>
            <Form
              ref={deleteFormRef}
              method="post"
              onSubmit={handleFormSubmit} // 디버깅용 코드 유지
              style={{ display: "contents" }} // Flexbox/Grid 레이아웃에 영향을 주지 않도록
            >
              <input type="hidden" name="actionType" value="D" />
              <input type="hidden" name="id" value={oneToDelete?.id} />

              <AlertDialogAction asChild>
                <Button
                  onClick={handleConfirmDelete}
                  variant="destructive"
                  className="cursor-pointer group flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white transition-colors"
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4 group-hover:text-white transition-colors" />
                  {isSubmitting ? "처리 중..." : "삭제 확인"}
                </Button>
              </AlertDialogAction>
            </Form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
