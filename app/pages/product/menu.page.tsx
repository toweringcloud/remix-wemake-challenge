import { Loader, Pencil, Plus, Save, Trash2, XCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "react-router-dom";
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
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

import type { Route } from "./+types/menu.page";
import { MenuCard } from "~/components/menu-card";
import { getCookieSession } from "~/lib/cookie.server";
import { createThumbnail } from "~/lib/image.server";
import { createClient } from "~/lib/supabase.server";
import { cn } from "~/lib/utils";
import { useRoleStore } from "~/stores/user.store";

export const meta: Route.MetaFunction = () => [
  { title: "Menus | Caferium" },
  { name: "description", content: "menu list" },
];

// 상품 타입 정의
type Product = {
  id: number;
  name: string;
};

// 메뉴 타입 정의
interface Menu {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isHot?: boolean;
  price: number;
  status: string;
  category: string;
  productId: number;
  [key: string]: any;
}

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const session = getCookieSession(request.headers.get("Cookie"));
  if (!session) throw new Response("Unauthorized", { status: 401 });
  if (!session?.cafeId) return redirect("/login");
  const cafeId = session.cafeId;

  const { productId } = params;
  if (!productId) throw new Response("Not Found", { status: 404 });
  console.log("menus.productId", cafeId, productId);

  const { supabase } = createClient(request);
  const { data: productData } = await supabase
    .from("products")
    .select()
    .eq("cafe_id", cafeId)
    .order("name");

  const products: Product[] = productData!.map((item: any) => ({
    id: item.id,
    name: item.name,
  }));
  const comboProducts = [{ id: 0, name: "전체" }, ...products];
  // console.log("menus.R0", comboProducts);

  const { data } = await supabase
    .from("menus")
    .select("*, products(id, name)")
    .eq("cafe_id", cafeId)
    .order("name");

  if (data) {
    const menus: Menu[] = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.image_thumb_url,
      isHot: item.is_hot,
      price: item.price,
      status: item.status,
      category: item.products.name,
      productId: item.products.id,
      updatedAt: item.updated_at,
    }));
    // console.log("menus.R", menus);
    return [comboProducts, menus];
  } else return [];
};

// CUD 작업 시 발생하는 필드 에러들을 클라이언트에게 반환할 때 사용할 에러 타입
type FieldErrors = {
  productId?: string[];
  name?: string[];
  description?: string[];
  temperature?: string[];
  price?: string[];
  image?: string[];
};

// ✅ zod를 사용하여 유효성 검사 스키마를 정의합니다.
const schemaForInsert = z.object({
  productId: z.preprocess(
    (a) => parseInt(z.string().parse(a)), // 문자열을 숫자로 변환
    z.number().min(1, { message: "상품 카테고리를 선택해주세요." }) // ✅ 1 이상이어야 함 (0은 '전체'이므로)
  ),
  name: z.string().min(1, { message: "메뉴 이름은 필수입니다." }),
  description: z.string().optional(),
  temperature: z.enum(["hot", "ice", "none"], {
    errorMap: () => ({ message: "유효하지 않은 온도 선택입니다." }),
  }),
  price: z
    .preprocess(
      (a) => parseFloat(z.string().parse(a)), // 문자열을 숫자로 변환 시도
      z.number().min(0, { message: "가격은 0 이상이어야 합니다." }).optional()
    )
    .pipe(z.number().int({ message: "가격은 정수여야 합니다." })), // ✅ 가격은 정수여야 함
});

const schemaForUpdate = z.object({
  productId: z.preprocess(
    (a) => parseInt(z.string().parse(a)), // 문자열을 숫자로 변환
    z.number().min(1, { message: "상품 카테고리를 선택해주세요." }) // ✅ 1 이상이어야 함
  ),
  id: z.string().min(1, { message: "메뉴 아이디는 필수입니다." }),
  name: z.string().min(1, { message: "메뉴 이름은 필수입니다." }),
  description: z.string().optional(),
  temperature: z.enum(["hot", "ice", "none"], {
    errorMap: () => ({ message: "유효하지 않은 온도 선택입니다." }),
  }),
  price: z
    .preprocess(
      (a) => parseFloat(z.string().parse(a)),
      z.number().min(0, { message: "가격은 0 이상이어야 합니다." }).optional()
    )
    .pipe(z.number().int({ message: "가격은 정수여야 합니다." })), // ✅ 가격은 정수여야 함
});

const schemaForDelete = z.object({
  id: z.string().min(1, { message: "메뉴 아이디는 필수입니다." }),
});

export const action: ActionFunction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  try {
    const session = getCookieSession(request.headers.get("Cookie"));
    if (!session) throw new Response("Unauthorized", { status: 401 });
    if (!session?.cafeId) return redirect("/login");
    const cafeId = session.cafeId;

    const { productId } = params;
    if (!productId) throw new Response("Not Found", { status: 404 });
    console.log("menus.productId", cafeId, productId);

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
    const storageDivision = `${cafeId}/menu`; // 메뉴 이미지용 버킷 카테고리

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
      const {
        productId: selectedProductId,
        name,
        description,
        temperature,
        price,
      } = submission.data;
      console.log("menus.C", submission.data);

      // temperature 값을 boolean으로 변환 (supabase 컬럼 타입에 맞춤)
      const isHotBoolean =
        temperature === "hot" ? true : temperature === "ice" ? false : null;

      let imageUrl: string | null = null;
      let imageThumbUrl: string | null = null;
      const imageFile = formData.get("image") as File;

      if (imageFile && imageFile.size > 0) {
        // ✅ 파일 확장자를 소문자로 변환합니다.
        const originalName = imageFile.name;
        const extension = originalName.split(".").pop()?.toLowerCase();
        const baseName = originalName.split(".").slice(0, -1).join(".");
        console.log("menus.C.imageFile", imageFile);

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

      // 1. 메뉴 등록 후에 방금 생성한 메뉴 데이터를 가져옵니다.
      const { data: newMenu, error } = await supabase
        .from("menus")
        .insert({
          name,
          description,
          is_hot: isHotBoolean,
          price,
          image_url: imageUrl,
          image_thumb_url: imageThumbUrl,
          product_id: selectedProductId,
          cafe_id: cafeId,
        })
        .select()
        .single();

      // 메뉴 등록 중 에러 처리
      if (error) {
        return new Response(
          JSON.stringify({ ok: false, error: error.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // 2. 성공적으로 생성된 메뉴의 정보를 사용하여 레시피를 등록합니다.
      const { error: recipeError } = await supabase.from("recipes").insert({
        name: newMenu.name, // 메뉴 이름과 동일하게 설정
        steps: [], // 자바스크립트의 빈 배열은 Supabase가 '{}'::text[]로 처리합니다.
        menu_id: newMenu.id, // 위에서 반환받은 새 메뉴의 ID
        cafe_id: newMenu.cafe_id,
      });

      // 레시피 등록 중 에러 처리
      if (recipeError) {
        // 참고: 여기서는 메뉴는 생성되었지만 레시피 생성은 실패한 상태입니다.
        // 필요하다면 이미 생성된 메뉴를 삭제하는 등의 추가적인 예외 처리를 할 수 있습니다.
        return new Response(
          JSON.stringify({
            ok: false,
            error: `레시피 생성 실패: ${recipeError.message}`,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // 모든 과정이 성공했을 때의 응답
      console.log(`menus.C: cafe(${cafeId}), menu(${newMenu.id})`);
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
      const {
        productId: selectedProductId,
        id: menuId,
        name,
        description,
        temperature,
        price,
      } = submission.data;
      console.log("menus.U", submission.data);

      // temperature 값을 boolean으로 변환 (supabase 컬럼 타입에 맞춤)
      const isHotBoolean =
        temperature === "hot" ? true : temperature === "ice" ? false : null;

      const updateData: {
        product_id: number;
        name?: string;
        description?: string;
        is_hot?: boolean | null;
        price?: number;
        image_url?: string | null;
        image_thumb_url?: string | null;
      } = {
        product_id: selectedProductId,
        name,
        description,
        is_hot: isHotBoolean,
        price,
      };

      const imageFile = formData.get("image") as File;
      const removeImage = formData.get("removeImage") === "true"; // 이미지 삭제 스위치 값

      // 기존 이미지 URL 조회 (삭제를 위해)
      const { data: existingOne, error: fetchError } = await supabase
        .from("menus")
        .select("image_url, image_thumb_url")
        .eq("id", menuId)
        .single();

      if (fetchError || !existingOne) {
        return new Response(
          JSON.stringify({ ok: false, error: "Menu not found" }),
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
        console.log("menus.U.imageFile", imageFile);

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
        console.log("menus.C.imageFile.c1", originalFilePath);
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
          console.log("menus.C.imageFile.c2", thumbFilePath);
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
        .from("menus")
        .update(updateData)
        .eq("id", menuId)
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
      console.log(
        `menus.U: cafe(${cafeId}), product(${productId}), menu(${menuId})`
      );
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
      const { id: menuId } = submission.data;
      console.log("menus.D", submission.data);

      const { data: oneToDelete, error: selectError } = await supabase
        .from("menus")
        .select("image_url, image_thumb_url") // 연결된 레시피가 있는지 확인
        .eq("id", menuId)
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

      // ✅ 매출이 발생한 이력이 있을 경우, 해당 메뉴와 레시피 삭제 불가 (TBD)

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
        .from("menus")
        .delete()
        .eq("id", menuId)
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
      console.log(
        `menus.D: cafe(${cafeId}), product(${productId}), menu(${menuId})`
      );
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

export default function MenusPage() {
  // 모든 훅을 컴포넌트 최상단에 조건 없이 호출합니다.
  const { roleCode, isLoading } = useRoleStore();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const navigation = useNavigation();

  // 메뉴 목록 로더 데이터
  const loaderData = useLoaderData() as [Product[], Menu[], string];

  // 메뉴 등록/수정/삭제 결과 조회
  const actionData = useActionData() as {
    action?: "C" | "U" | "D";
    ok?: boolean;
    errors?: FieldErrors;
    error?: string;
  };

  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRemoveImage, setIsRemoveImage] = useState(false);
  const [editProductSelection, setEditProductSelection] = useState<string>("");
  const [oneToDelete, setOneToDelete] = useState<Menu | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);

  // 폼 제출이 완료되었는지 확인
  const isSubmitting = navigation.state === "submitting";

  // 상품 + 메뉴 목록 조회
  // loaderData에서 필요한 값을 꺼내기 전에 null/undefined 체크를 합니다.
  // 이 부분은 훅이 아니므로 조건문 안에서 처리해도 안전합니다.
  const products = loaderData?.[0];
  const menus = loaderData?.[1];
  const currentProductIdFromLoader = loaderData?.[2];

  // 메뉴 선택 콤보
  const [selectedProductId, setSelectedProductId] = useState(
    currentProductIdFromLoader || productId
  );
  const handleMainSelectChange = (value: string) => {
    setSelectedProductId(value); // UI 상태 업데이트
    navigate(`/dashboard/products/${value}/menus`); // URL 경로 변경
  };

  // 선택된 상품에 해당하는 메뉴만 필터링
  const filteredMenus =
    selectedProductId === "0"
      ? menus
      : menus.filter(
          (menu: Menu) => menu.productId === parseInt(selectedProductId!)
        );

  // 이미지 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setIsRemoveImage(false);
    } else {
      setImagePreview(selectedMenu?.imageUrl || null);
    }
  };

  // 이미지 삭제 스위치 핸들러
  const handleRemoveImageToggle = (checked: boolean) => {
    setIsRemoveImage(checked);
    if (checked) {
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setImagePreview(selectedMenu?.imageUrl || null);
    }
  };

  // 메뉴 등록
  const handleNewClick = () => {
    setSelectedMenu(null);
    setImagePreview(null);
    setIsNewDialogOpen(true);
  };

  // 메뉴 수정
  const handleEditClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setImagePreview(menu.imageUrl || null);
    setIsRemoveImage(false);
    setIsEditDialogOpen(true);
    setEditProductSelection(menu.productId.toString());
  };

  // 메뉴 삭제
  const handleDeleteClick = (menu: Menu) => {
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
        toast.error("메뉴 관리", {
          description:
            actionData.error ||
            actionData.errors?.image?.[0] ||
            `메뉴 처리(${actionData.action}) 중 오류가 발생했습니다.`,
        });
      } else if (actionData.ok === true) {
        let successMessage = "메뉴가 성공적으로 처리되었습니다.";
        if (actionData.action === "C")
          successMessage = "메뉴가 성공적으로 등록되었습니다.";
        if (actionData.action === "U")
          successMessage = "메뉴가 성공적으로 수정되었습니다.";
        if (actionData.action === "D")
          successMessage = "메뉴가 성공적으로 삭제되었습니다.";

        // ✅ 성공 메시지 표시
        toast.success("메뉴 관리", {
          description: successMessage,
        });
      }
    }

    // 폼 제출이 끝났고(idle), 작업이 성공적으로 완료되었다면
    if (!isSubmitting && actionData?.ok) {
      setIsNewDialogOpen(false);
      setIsEditDialogOpen(false);
      setIsAlertOpen(false);
      setImagePreview(null);
      setIsRemoveImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [actionData]);

  // 페이지 접근 권한 확인
  useEffect(() => {
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
  if (!loaderData || !productId || !roleCode || !products || !menus) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-row gap-4">
          <h1 className="text-3xl font-bold text-amber-800">메뉴</h1>
          {/* 상품 선택 콤보 */}
          <Select
            value={selectedProductId}
            onValueChange={handleMainSelectChange}
          >
            <SelectTrigger className="w-[120px] bg-white">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md border border-stone-200">
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {["SA", "MA"].includes(roleCode) && (
          <button
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 flex flex-row gap-2 items-center"
            onClick={() => handleNewClick()}
          >
            <Plus className="h-4 w-4" /> 등록
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMenus.map((menu) => (
          <MenuCard
            key={menu.id}
            id={menu.id.toString()}
            name={menu.name}
            description={menu.description}
            imageUrl={menu.imageUrl}
            isHot={menu.isHot}
            price={menu.price}
            status={menu.status}
            category={menu.category}
            action={
              ["SA", "MA"].includes(roleCode) && (
                <div className="flex items-center gap-2 ml-auto -mb-2">
                  <button
                    onClick={() => handleEditClick(menu)}
                    className="flex items-center gap-1 text-sm text-amber-600 hover:text-white p-2 rounded-md hover:bg-amber-500 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteClick(menu)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-white p-2 rounded-md hover:bg-red-500 transition-colors"
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

      {/* ✅ 메뉴 등록 팝업 */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>메뉴 등록</DialogTitle>
            <DialogDescription>
              메뉴의 이름, 설명, 가격, 이미지를 등록합니다.
            </DialogDescription>
          </DialogHeader>
          <Form
            method="post"
            encType="multipart/form-data"
            onSubmit={handleFormSubmit}
          >
            <div className="grid gap-4 pt-2 pb-8">
              <input type="hidden" name="actionType" value="C" />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productId" className="text-right">
                  카테고리
                </Label>
                <Select
                  name="productId"
                  defaultValue={selectedProductId}
                  onValueChange={setEditProductSelection}
                >
                  <SelectTrigger className="w-[120px] col-span-3 bg-white">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-md border border-stone-200">
                    {products
                      .filter((p) => p.id !== 0)
                      .map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {actionData?.errors?.productId && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.productId[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="메뉴 명"
                  className="col-span-3"
                  autoComplete="off"
                  defaultValue=""
                />
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
                  placeholder="메뉴 설명"
                  className="col-span-3"
                  autoComplete="off"
                  defaultValue=""
                />
                {actionData?.errors?.description && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.description[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="temperature" className="text-right">
                  온도
                </Label>
                <RadioGroup
                  id="temperature"
                  name="temperature"
                  className="col-span-3 flex items-center space-x-4"
                  defaultValue="none"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hot" id="r-hot" />
                    <Label htmlFor="r-hot">핫(Hot)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ice" id="r-ice" />
                    <Label htmlFor="r-ice">아이스(Ice)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="r-none" />
                    <Label htmlFor="r-none">해당없음</Label>
                  </div>
                </RadioGroup>
                {actionData?.errors?.temperature && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.temperature[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  가격
                </Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="원 단위"
                  className="col-span-3"
                  autoComplete="off"
                  defaultValue="0"
                />
                {actionData?.errors?.price && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.price[0]}
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
                    placeholder="메뉴 이미지"
                    accept="image/png, image/jpg, image/jpeg"
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
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">AI 옵션</Label>
                <div className="col-start-2 col-span-3 flex items-center space-x-2">
                  <Checkbox id="generate-image" name="generateImage" />
                  <Label
                    htmlFor="generate-image"
                    className="text-sm font-medium leading-none"
                  >
                    이미지 자동 생성
                  </Label>
                  <Checkbox id="generate-recipe" name="generateRecipe" />
                  <Label
                    htmlFor="generate-recipe"
                    className="text-sm font-medium leading-none"
                  >
                    레시피 자동 생성
                  </Label>
                </div>
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
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ✅ 메뉴 수정 팝업 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>"{selectedMenu?.name}" 메뉴 수정</DialogTitle>
            <DialogDescription>
              메뉴의 카테고리, 이름, 설명, 가격, 이미지를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <Form
            method="post"
            encType="multipart/form-data"
            onSubmit={handleFormSubmit}
          >
            <div className="grid gap-4 pt-2 pb-8">
              <input type="hidden" name="actionType" value="U" />
              <input type="hidden" name="id" value={selectedMenu?.id} />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productId" className="text-right">
                  카테고리
                </Label>
                <Select
                  name="productId"
                  defaultValue={
                    editProductSelection ||
                    selectedMenu?.productId.toString() ||
                    ""
                  }
                  onValueChange={setEditProductSelection}
                >
                  <SelectTrigger className="w-[120px] col-span-3 bg-white">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-md border border-stone-200">
                    {products
                      .filter((p) => p.id !== 0)
                      .map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {actionData?.errors?.productId && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.productId[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="메뉴 명"
                  className="col-span-3"
                  autoComplete="off"
                  defaultValue={selectedMenu?.name || ""}
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
                  placeholder="메뉴 설명"
                  className="col-span-3"
                  autoComplete="off"
                  defaultValue={selectedMenu?.description || ""}
                />
                {/* ✅ 설명 필드에 대한 에러 메시지 표시 (필요 시) */}
                {actionData?.errors?.description && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.description[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="temperature" className="text-right">
                  온도
                </Label>
                <RadioGroup
                  id="temperature"
                  name="temperature"
                  className="col-span-3 flex items-center space-x-4"
                  defaultValue={
                    selectedMenu?.isHot === undefined
                      ? "none"
                      : selectedMenu?.isHot === true
                        ? "hot"
                        : "ice"
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hot" id="r-hot" />
                    <Label htmlFor="r-hot">핫(Hot)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ice" id="r-ice" />
                    <Label htmlFor="r-ice">아이스(Ice)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="r-none" />
                    <Label htmlFor="r-none">해당없음</Label>
                  </div>
                </RadioGroup>
                {actionData?.errors?.temperature && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.temperature[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  가격
                </Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="원 단위"
                  className="col-span-3"
                  autoComplete="off"
                  defaultValue={selectedMenu?.price || 0}
                />
                {actionData?.errors?.price && (
                  <p className="col-start-2 col-span-3 text-sm text-red-500">
                    {actionData.errors.price[0]}
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
                        className="max-h-full max-w-full object-contain"
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
                className="group flex items-center gap-1 hover:text-red-600 hover:border-red-600 transition-colors"
                onClick={() => setIsEditDialogOpen(false)}
              >
                <XCircle className="h-4 w-4" />
                취소
              </Button>
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

      {/* ✅ 메뉴 삭제 팝업 */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              "{oneToDelete?.name}" 메뉴 내에 등록된 레시피도 함께 삭제합니다.
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
            <Form
              ref={deleteFormRef}
              method="post"
              onSubmit={handleFormSubmit}
              style={{ display: "contents" }}
            >
              <input type="hidden" name="actionType" value="D" />
              <input type="hidden" name="id" value={oneToDelete?.id} />

              <AlertDialogAction asChild>
                <Button
                  onClick={handleConfirmDelete}
                  variant="destructive"
                  className="group flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white transition-colors"
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
