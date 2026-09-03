/**
 * solutions.js — 솔루션(자사 제품) 페이지 매니페스트.
 *
 * 서비스 페이지가 "무엇을 해주는가"라면 이쪽은 "무엇을 파는가"다. 그래서
 * 제품 판이 페이지의 대부분을 차지하고, 그 뒤에 도입 형태(구축 · 구독 ·
 * 폐쇄망) 비교와 성과 지표를 붙였다.
 */
import { PageHero } from "../components/PageHero.js";
import { SolutionShowcase } from "../components/SolutionShowcase.js";
import { ProcessSteps } from "../components/ProcessSteps.js";
import { StatCounters } from "../components/StatCounters.js";
import { CtaBandPrimary } from "../components/CtaBandPrimary.js";
import { CtaBandLight } from "../components/CtaBandLight.js";

export const solutionsPage = {
  id: "solutions",
  sections: [
    {
      component: PageHero,
      props: {
        breadcrumb: [
          { label: "홈", href: "#/" },
          { label: "솔루션" },
        ],
        eyebrow: "SOLUTIONS",
        title: "바로 도입할 수 있는 형태로 만들어 둔 것들",
        lede: "구축형 프로젝트로만 풀던 문제를 제품으로 옮겼습니다. 폐쇄망 설치, 문서 근거 인용, 권한별 검색은 옵션이 아니라 기본값입니다.",
        index: [
          { label: "유레카 GenAI", href: "#/solutions?to=eureka-genai" },
          { label: "유레카 BOX", href: "#/solutions?to=eureka-box" },
          { label: "RPA 플랫폼", href: "#/solutions?to=rpa-platform" },
        ],
        meta: [
          { value: "3", label: "자사 솔루션" },
          { value: "온프레미스", label: "폐쇄망 설치 지원" },
          { value: "2주", label: "PoC 착수까지" },
        ],
        actions: [
          { label: "체험 신청하기", href: "#/trial" },
          { label: "도입 문의", href: "#/contact", variant: "secondary" },
        ],
      },
    },

    {
      component: SolutionShowcase,
      resource: "solutions.list",
      props: {
        eyebrow: "PRODUCT LINEUP",
        title: "레인보우브레인 솔루션",
        subtitle: "모든 제품은 폐쇄망 설치와 권한 체계 연동을 전제로 설계했습니다.",
      },
      optional: true,
    },

    {
      component: ProcessSteps,
      resource: "solutions.rollout",
      props: {
        eyebrow: "ROLLOUT",
        title: "도입 절차",
        subtitle: "체험 신청부터 운영 이관까지, 표준 일정은 이렇게 잡힙니다.",
      },
      optional: true,
    },

    {
      component: StatCounters,
      resource: "stats.list",
      props: {
        eyebrow: "IN PRODUCTION",
        title: "실제 운영에서 나온 숫자",
        note: "2016–2026 누적 실적",
        max: 3,
      },
      optional: true,
    },

    { component: CtaBandPrimary, resource: "cta.report", optional: true },
    { component: CtaBandLight, resource: "cta.closing", optional: true },
  ],
};
