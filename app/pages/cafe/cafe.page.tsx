import React, { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router-dom";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

import type { Route } from "./+types/cafe.page";
import { useRoleStore } from "~/stores/user.store";

export const meta: Route.MetaFunction = () => [
  { title: "Lounge | Caferium" },
  { name: "description", content: "cafe lounge" },
];

export default function CafeEditPage() {
  const navigate = useNavigate();
  const { roleCode } = useRoleStore();

  // ✅ 폼 데이터를 위한 state
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");

  // ✅ 운영자 권한 확인
  useEffect(() => {
    if (roleCode !== "SA") {
      alert("접근 권한이 없습니다.");
      navigate("/dashboard");
    } else {
      // 실제 앱에서는 여기서 API를 호출하여 카페 정보를 가져옵니다.
      // 지금은 샘플 데이터로 초기화합니다.
      setName("카페리움");
      setHeadline("최고급 원두로 내린 스페셜티 커피");
      setDescription(
        "매일 아침 직접 로스팅한 신선한 원두를 사용하며, 도심 속에서 편안한 휴식을 제공하는 현대적인 커피 공간입니다."
      );
    }
  }, [roleCode, navigate]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 앱에서는 여기서 수정 API를 호출합니다.
    const formData = { name, headline, description };
    console.log("저장할 데이터:", formData);
    alert("카페 정보가 저장되었습니다.");
  };

  if (roleCode !== "SA" && roleCode !== "MA") {
    return null; // 권한이 없으면 렌더링하지 않음
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-amber-800 mb-6">매장 정보 관리</h1>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>
            고객에게 보여질 매장의 이름과 소개 문구를 수정할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-lg font-semibold text-amber-800"
              >
                매장 이름
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="headline"
                className="text-lg font-semibold text-amber-800"
              >
                헤드라인 (한 줄 소개)
              </Label>
              <Input
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-lg font-semibold text-amber-800"
              >
                매장 상세 설명
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="text-base"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-amber-600 hover:bg-amber-700"
              >
                저장하기
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
