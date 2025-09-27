import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import type { Route } from "./+types/item.page";
import { useRoleStore } from "~/stores/user.store";
import { inventoryData } from "~/data/inventory.data";

export const meta: Route.MetaFunction = () => [
  { title: "Items | Caferium" },
  { name: "description", content: "item list" },
];

export default function ItemPage() {
  const { roleCode } = useRoleStore();

  const [items, setItems] = useState(inventoryData);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0, unit: "" });

  // '새 품목 추가' 버튼 핸들러
  const handleAddNewItem = () => {
    setIsAdding(true);
  };

  // 새 품목 정보 입력 핸들러
  const handleNewItemChange = (
    field: keyof typeof newItem,
    value: string | number
  ) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  // 새 품목 저장 핸들러
  const handleSaveNewItem = () => {
    if (!newItem.name || !newItem.unit) {
      alert("품목명과 단위를 모두 입력해주세요.");
      return;
    }
    // 새 아이템 객체 생성 (실제 앱에서는 id를 서버에서 받아옴)
    const newRecord = { ...newItem, id: Date.now() };
    setItems([newRecord, ...items]);
    setIsAdding(false);
    setNewItem({ name: "", quantity: 0, unit: "" });
  };

  // 새 품목 추가 취소 핸들러
  const handleCancelAddItem = () => {
    setIsAdding(false);
    setNewItem({ name: "", quantity: 0, unit: "" });
  };

  // 인라인 폼에서 수량을 조절하는 함수
  const handleQuantityChange = (id: number, amount: number) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + amount) }
          : item
      )
    );
  };

  // '저장' 버튼 클릭 시 (실제로는 여기서 API 호출)
  const handleSave = (id: number) => {
    console.log(
      "Saving:",
      items.find((item) => item.id === id)
    );
    setEditingId(null); // 수정 모드 종료
  };

  // '취소' 버튼 클릭 시
  const handleCancel = () => {
    setItems(inventoryData); // 변경사항을 원래 데이터로 되돌림 (임시)
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">재고 상세</h1>
        {/* ✅ isAdding 상태가 아닐 때만 '새 품목 추가' 버튼이 보이도록 설정 */}
        {roleCode === "MA" && !isAdding && (
          <button
            onClick={handleAddNewItem}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 flex flex-row gap-2 items-center"
          >
            <Plus className="h-4 w-4" />
            등록
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full">
          <thead className="border-b-2">
            <tr className="text-left text-gray-600">
              <th className="p-3">품목명</th>
              <th className="p-3">수량</th>
              <th className="p-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr className="bg-blue-50">
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="품목명"
                    value={newItem.name}
                    onChange={(e) =>
                      handleNewItemChange("name", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="수량"
                      value={newItem.quantity}
                      onChange={(e) =>
                        handleNewItemChange(
                          "quantity",
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="w-20 p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="단위 (예: kg, 개)"
                      value={newItem.unit}
                      onChange={(e) =>
                        handleNewItemChange("unit", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </td>
                <td className="p-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      title="수정"
                      onClick={handleSaveNewItem}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Save size={20} />
                    </button>
                    {roleCode === "MA" && (
                      <button
                        title="삭제"
                        onClick={handleCancelAddItem}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold">{item.name}</td>
                {editingId === item.id ? (
                  // 수정 모드: 수량 조절 버튼 표시
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="font-bold bg-gray-200 rounded-full w-6 h-6"
                      >
                        -
                      </button>
                      <span>
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="font-bold bg-gray-200 rounded-full w-6 h-6"
                      >
                        +
                      </button>
                    </div>
                  </td>
                ) : (
                  // 일반 모드: 현재 수량 표시
                  <td className="p-3">
                    {item.quantity} {item.unit}
                  </td>
                )}

                <td className="p-3 text-center">
                  {editingId === item.id ? (
                    // 수정 모드: 저장/취소 버튼
                    <div className="space-x-1 flex flex-row flex-wrap justify-center">
                      <button
                        title="저장"
                        onClick={() => handleSave(item.id)}
                        className="text-sm bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      >
                        <Save size={20} />
                      </button>
                      <button
                        title="취소"
                        onClick={handleCancel}
                        className="text-sm bg-gray-200 p-2 rounded hover:bg-gray-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ) : (
                    // 일반 모드: 수정/삭제 버튼
                    <div className="space-x-1 flex flex-row justify-center">
                      <button
                        title="수정"
                        onClick={() => setEditingId(item.id)}
                        className="text-sm bg-gray-200 p-2 rounded hover:bg-gray-300"
                      >
                        <Save size={20} />
                      </button>
                      {roleCode === "MA" && (
                        <button
                          title="삭제"
                          className="text-sm bg-red-100 text-red-700 p-2 rounded hover:bg-red-200"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
