import { Resend } from "resend";
import {
  WelcomeEmail,
  type WelcomeEmailProps,
} from "react-email-starter/emails/welcome-to-caferium";
import type { Route } from "./+types/send-welcome-mail";

const client = new Resend(process.env.RESEND_API_KEY);

const welcomeMents: WelcomeEmailProps = {
  headlines: [
    "카페리움과 함께하게 되신 것을 진심으로 환영합니다!",
    "안녕하세요, 사장님! 카페의 스마트한 운영 파트너, 카페리움입니다.",
    "복잡한 관리는 저희에게 맡기고, 가장 중요한 손님과 커피에만 집중해 보세요. 아래의 간단한 3단계를 따라 지금 바로 시작해보세요!",
  ],
  steps: [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>매장 정보 설정하기</strong> 고객에게 보여질 매장의 이름과
          따뜻한 소개 문구를 입력하여 나만의 공간을 꾸며보세요.{" "}
          <a href="/dashboard/cafe">매장 정보 바로가기</a>
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>첫 상품(메뉴 그룹) 등록하기</strong> 메뉴를 체계적으로 관리할
          수 있도록 '커피', '라떼', '디저트' 같은 상품 그룹을 만들어보세요.{" "}
          <a href="/dashboard/products">상품 관리 페이지로 이동</a>
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={3}>
          <strong>첫 메뉴 등록하기</strong> 매장의 대표 메뉴인 '아메리카노'나
          새로운 시즌 음료를 방금 만든 상품 그룹에 추가해보세요.{" "}
          <a href="/dashboard/products/1/menus">메뉴 추가하기</a>{" "}
        </li>
      ),
    },
  ],
  links: [
    {
      title: "사용 가이드 보기",
      href: "https://caferium.toweirngcloud.dev/guide",
    },
    {
      title: "자주 묻는 질문 (FAQ)",
      href: "https://caferium.toweirngcloud.dev/faq",
    },
    {
      title: "문의하기",
      href: "mailto:caferium@mail.toweirngcloud.dev",
    },
  ],
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { data, error } = await client.emails.send({
    from: "Caferium <caferium@mail.toweringcloud.dev>",
    to: ["toweringcloud@gmail.com"],
    subject: "Welcome to Caferium!",
    react: <WelcomeEmail data={welcomeMents} />,
  });
  return Response.json({ data, error });
};
