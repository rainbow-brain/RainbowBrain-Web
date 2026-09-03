/**
 * services.js — 서비스 페이지 매니페스트.
 *
 * 홈의 역량 밴드(CapabilityRows)가 "네 개의 축이 있다"까지 말한다면,
 * 이 페이지는 그 다음을 맡는다 — 축마다 무엇을 산출물로 받는지, 얼마나
 * 걸리는지, 왜 멈추는지.
 *
 * 도전과제(홈과 같은 리소스)를 서비스 목록 뒤에 둔 이유: 앞에 두면
 * "안 되는 이유"부터 읽히고, 뒤에 두면 앞서 읽은 서비스가 그 답으로 읽힌다.
 */
import { PageHero } from "../components/PageHero.js";
import { ServiceList } from "../components/ServiceList.js";
import { ProcessSteps } from "../components/ProcessSteps.js";
import { ChallengeGrid } from "../components/ChallengeGrid.js";
import { CapabilityRows } from "../components/CapabilityRows.js";
import { CtaBandPrimary } from "../components/CtaBandPrimary.js";
import { CtaBandLight } from "../components/CtaBandLight.js";

export const servicesPage = {
  id: "services",
  sections: [
    {
      component: PageHero,
      props: {
        breadcrumb: [
          { label: "홈", href: "#/" },
          { label: "서비스" },
        ],
        eyebrow: "SERVICES",
        title: "진단부터 내재화까지, 끊기지 않는 한 줄",
        lede: "AI · 데이터 · 자동화 · 거버넌스를 따로 팔지 않습니다. 하나의 아키텍처로 묶어 설계하고, 운영까지 같은 팀이 맡습니다.",
        index: [
          { label: "생성형 AI", href: "#/services?to=genai" },
          { label: "RAG", href: "#/services?to=rag" },
          { label: "RPA", href: "#/services?to=rpa" },
          { label: "데이터", href: "#/services?to=data" },
          { label: "지능형 문서처리", href: "#/services?to=idp" },
          { label: "AI 거버넌스", href: "#/services?to=governance" },
        ],
        meta: [
          { value: "6", label: "서비스 영역" },
          { value: "2,000+", label: "누적 자동화 과제" },
          { value: "2주", label: "무상 진단 기간" },
        ],
        actions: [
          { label: "무상 진단 신청", href: "#/contact" },
          { label: "기술백서 받기", href: "#/resources", variant: "secondary" },
        ],
      },
    },

    /* ── 1. 서비스 목록 — 이 페이지의 본문 ──────────────────────────────── */
    {
      component: ServiceList,
      resource: "services.list",
      props: {
        eyebrow: "WHAT WE DO",
        title: "여섯 개의 서비스 영역",
        subtitle: "각 항목은 독립적으로도, 하나의 로드맵으로 묶어서도 진행할 수 있습니다.",
      },
      optional: true,
    },

    /* ── 2. 역량 지도 — 홈과 같은 리소스로 축 관계를 한 번 더 정리 ───────── */
    {
      component: CapabilityRows,
      resource: "capabilities.list",
      props: {
        eyebrow: "CAPABILITY MAP",
        title: "네 개의 축이 하나의 아키텍처로",
        subtitle: "서비스는 나뉘어 있지만 설계는 한 장에서 시작합니다.",
        hint: "스크롤에 따라 카드가 순차로 열립니다",
      },
      optional: true,
    },

    /* ── 3. 진행 프로세스 ──────────────────────────────────────────────── */
    {
      component: ProcessSteps,
      resource: "services.process",
      props: {
        eyebrow: "HOW IT RUNS",
        title: "프로젝트 진행 단계",
        subtitle: "각 단계의 산출물과 소요 기간을 계약 전에 먼저 합의합니다.",
      },
      optional: true,
    },

    /* ── 4. 도전과제 ──────────────────────────────────────────────────── */
    {
      component: ChallengeGrid,
      resource: "challenges.list",
      props: {
        eyebrow: "WHY IT STALLS",
        title: "도입이 멈추는 네 가지 이유",
      },
      optional: true,
    },

    { component: CtaBandPrimary, resource: "cta.report", optional: true },
    { component: CtaBandLight, resource: "cta.closing", optional: true },
  ],
};
