import OpenAI from "openai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

import createClient from "~/utils/supabase.client";
import { updateCafeMents } from "~/apis/cafe.mutation";
import type { Route } from "./+types/update-cafe-ments";

const openai = new OpenAI();

const MessageSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const ResponseSchema = z.object({
  potato: z.array(MessageSchema),
});

export const action = async ({ request }: Route.ActionArgs) => {
  // 보안: POST 메서드와 커스텀 헤더로 간단한 인증 처리
  if (request.method !== "POST") {
    return new Response(null, { status: 404 });
  }
  const header = request.headers.get("X-POTATO");
  if (!header || header !== "X-TOMATO") {
    return new Response(null, { status: 404 });
  }

  // 1. Zod 스키마를 JSON 스키마로 변환합니다.
  const schema = zodToJsonSchema(ResponseSchema, "ResponseSchema");

  // 2. OpenAI 'tools' 파라미터를 직접 만듭니다.
  const tools = [
    {
      type: "function" as const,
      function: {
        name: "show_suggestions", // 함수 이름은 자유롭게 지정 가능
        description: "Generated cafe advertising slogans",
        parameters: schema,
      },
    },
  ];

  // 3. create() 메서드로 API를 호출합니다.
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content:
          "카페를 소개하는 짧고 강력한 메시지가 필요한데, 홈페이지 방문 유저의 관심을 끌만한 광고 카피 형태로 만들어줘~",
      },
      {
        role: "user",
        content:
          "예: 복잡한 메뉴 관리와 재고 계산은 이제 그만. 똑똑한 카페 운영에만 집중하세요.",
      },
      {
        role: "user",
        content: "Give me 10 ideas.",
      },
    ],
    tools: tools, // 직접 만든 tools 전달
    tool_choice: { type: "function", function: { name: "show_suggestions" } }, // 항상 이 함수를 사용하도록 강제
  });
  console.log("completion", completion);

  // 4. tool_calls에서 결과 추출
  const choice = completion.choices[0];
  const toolCalls = choice.message.tool_calls;
  if (!toolCalls) {
    return Response.json({ error: "No tool calls from API" }, { status: 400 });
  }

  // 5. JSON 문자열을 객체로 파싱하고 Zod 스키마로 검증
  const toolCall = toolCalls[0];
  if (toolCall.type !== "function") {
    return Response.json(
      { error: "Expected a function call" },
      { status: 400 }
    );
  }

  // 이제 toolCall.function 접근이 안전하다고 타입스크립트가 인지합니다.
  const jsonOutput = toolCall.function.arguments;
  const structuredResponse = ResponseSchema.parse(JSON.parse(jsonOutput));
  const descriptions = structuredResponse.potato.map((i) => i.description);
  if (!descriptions || descriptions.length === 0) {
    return Response.json({ error: "No ideas generated" }, { status: 400 });
  }

  // TBD: retrieve your own cafe ID from session or store
  const cafeId = "a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0";
  await updateCafeMents(createClient, cafeId, descriptions);

  return Response.json({
    ok: true,
  });
};
