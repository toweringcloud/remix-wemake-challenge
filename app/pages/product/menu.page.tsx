import React, { useState } from "react";
import {
  Form,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "react-router-dom";
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
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

import type { Route } from "./+types/menu.page";
import { MenuCard } from "~/components/menu-card";
import { useRoleStore } from "~/stores/user.store";
import { getCookieSession } from "~/utils/cookie.server";
import { createClient } from "~/utils/supabase.server";
import { DialogDescription } from "@radix-ui/react-dialog";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Checkbox } from "~/components/ui/checkbox";

export const meta: Route.MetaFunction = () => [
  { title: "Menus | Caferium" },
  { name: "description", content: "menu list" },
];

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const session = getCookieSession(request.headers.get("Cookie"));
  if (!session) throw new Response("Unauthorized", { status: 401 });
  if (!session?.cafeId) return { cafe: null };
  const cafeId = session.cafeId;
  console.log("menus.cafeId", cafeId);

  const { productId } = params;
  if (!productId) throw new Response("Not Found", { status: 404 });
  console.log("menus.productId", cafeId);

  const { supabase } = createClient(request);
  const { data } = await supabase
    .from("menus")
    .select("*, products(name)")
    .eq("cafe_id", cafeId)
    .eq("product_id", productId);

  if (data) {
    const menus: Menu[] = data.map((item: any) => ({
      id: item.id,
      category: item.products.name,
      name: item.name,
      description: item.description,
      isHot: item.is_hot,
      price: item.price,
      stock: item.stock,
      isActive: item.is_active,
      imageUrl: item.image_url,
      updatedAt: item.updated_at,
    }));
    console.log("menus.R", menus);
    return menus;
  } else return [];
};

// 메뉴 타입 정의
type Menu = {
  id: number;
  category: string;
  name: string;
  description: string;
  isHot: boolean;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string;
  [key: string]: any;
};

export default function MenusPage({ loaderData }: Route.ComponentProps) {
  const { roleCode } = useRoleStore();

  const [menus] = useState<Menu[]>(loaderData || []);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [tempOption, setTempOption] = useState<"none" | "hot" | "ice">("none");
  const [shouldGenerateRecipe, setShouldGenerateRecipe] = useState(false);

  // 폼 입력 값 업데이트
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (selectedMenu) {
      setSelectedMenu({
        ...selectedMenu,
        [id]: value,
      });
    }
  };
  const handleSwitchChange = (id: "isHot" | "isActive", checked: boolean) => {
    // ...
  };

  // 메뉴 등록
  const handleNewClick = () => {
    setIsNewDialogOpen(true);
  };
  const handleSaveNew = () => {
    console.log("menus.saveNew:", selectedMenu);
    setIsNewDialogOpen(false);
  };

  // 메뉴 수정
  const handleEditClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsEditDialogOpen(true);
  };
  const handleSaveEdit = () => {
    console.log("products.saveEdit:", selectedMenu);
    setIsEditDialogOpen(false);
  };

  // 메뉴 삭제
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const handleDeleteClick = (menu: Menu) => {
    setMenuToDelete(menu); // 어떤 메뉴를 삭제할지 state에 저장
    setIsAlertOpen(true); // Dialog를 엽니다.
  };
  const confirmDelete = () => {
    if (!menuToDelete) return;
    // 실제 앱에서는 여기서 삭제 API를 호출합니다. (isActive: false로 업데이트)
    console.log(
      `'${menuToDelete.name}' 메뉴의 판매 상태를 '판매 안함'으로 변경합니다.`
    );
    setIsAlertOpen(false);
    setMenuToDelete(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-800">
          메뉴 ({menus[0].category})
        </h1>

        {roleCode === "MA" && (
          <button
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 flex flex-row gap-2 items-center"
            onClick={() => handleNewClick()}
          >
            <Plus className="h-4 w-4" /> 등록
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menus.map((menu) => (
          <MenuCard
            key={menu.id}
            id={menu.id.toString()}
            name={menu.name}
            description={`[${menu.isActive ? "판매중" : "판매중지"}] 가격: ${menu.price}원, 재고: ${menu.stock}EA`}
            category={menu.category}
            isHot={menu.isHot}
            imageUrl={menu.imageUrl}
            action={
              roleCode === "MA" && (
                // 매니저일 경우: 수정/삭제 버튼
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>메뉴 등록</DialogTitle>
            <DialogDescription>
              메뉴의 이름, 가격, 이미지를 등록합니다.
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
                  placeholder="메뉴 명"
                  onChange={handleInputChange}
                  className="col-span-3"
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">온도</Label>
                <RadioGroup
                  defaultValue="none"
                  onValueChange={(value: "hot" | "ice" | "none") =>
                    setTempOption(value)
                  }
                  className="col-span-3 flex items-center space-x-4"
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
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  가격
                </Label>
                <Input
                  type="number"
                  id="price"
                  placeholder="가격"
                  onChange={handleInputChange}
                  className="col-span-3"
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  재고
                </Label>
                <Input
                  type="number"
                  id="stock"
                  placeholder="재고"
                  value={selectedMenu?.stock || 0}
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
              <div className="col-start-2 col-span-3 flex items-center space-x-2 mt-2">
                <Checkbox
                  id="generate-recipe"
                  checked={shouldGenerateRecipe}
                  onCheckedChange={(checked: boolean) =>
                    setShouldGenerateRecipe(checked)
                  }
                />
                <Label
                  htmlFor="generate-recipe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  AI로 레시피 자동 생성
                </Label>
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

      {/* ✅ 메뉴 수정 팝업 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>"{selectedMenu?.name}" 메뉴 수정</DialogTitle>
            <DialogDescription>
              메뉴의 이름, 가격, 이미지를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                메뉴명
              </Label>
              <Input
                id="name"
                placeholder="메뉴 명"
                value={selectedMenu?.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                가격
              </Label>
              <Input
                type="number"
                id="price"
                placeholder="가격"
                value={selectedMenu?.price || 0}
                onChange={handleInputChange}
                className="col-span-3"
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                재고
              </Label>
              <Input
                type="number"
                id="stock"
                placeholder="재고"
                value={selectedMenu?.stock || 0}
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
                  checked={selectedMenu?.is_active}
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
            <Button type="submit" onClick={handleSaveEdit}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ 메뉴 삭제 팝업 */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              "{menuToDelete?.name}" 메뉴의 레시피가 등록되어 있을 경우, 판매
              상태가 '판매중지'로 변경됩니다. 이 작업은 되돌릴 수 있지만, 다시
              활성화할 수 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMenuToDelete(null)}>
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
