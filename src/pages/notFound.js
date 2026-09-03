/**
 * notFound.js — 아직 만들어지지 않았거나 잘못된 해시로 들어온 경우.
 *
 * 빈 화면 대신 이 판을 띄운다. 라우터가 매칭에 실패했을 때만 쓰인다.
 * 헤더·푸터는 셸이 계속 들고 있으므로 여기서는 본문만 채우면 된다.
 */
import { PageHero } from "../components/PageHero.js";
import { CtaBandLight } from "../components/CtaBandLight.js";

export const notFoundPage = {
  id: "not-found",
  sections: [
    {
      component: PageHero,
      props: {
        breadcrumb: [{ label: "홈", href: "#/" }, { label: "준비 중" }],
        eyebrow: "COMING SOON",
        title: "아직 준비 중인 페이지입니다",
        lede: "요청하신 페이지를 찾을 수 없습니다. 준비되는 대로 공개하겠습니다. 급한 문의는 아래 연락처로 남겨주세요.",
        actions: [
          { label: "홈으로 돌아가기", href: "#/" },
          { label: "도입 문의", href: "#/contact", variant: "secondary" },
        ],
      },
    },
    { component: CtaBandLight, resource: "cta.closing", optional: true },
  ],
};
