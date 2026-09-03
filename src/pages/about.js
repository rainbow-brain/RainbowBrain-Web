/**
 * about.js — 회사소개 페이지 매니페스트.
 *
 * 순서의 근거: 방문자가 회사소개에서 확인하려는 것은 대개 셋이다 —
 * "무엇을 하는 회사인가 / 믿을 만한가 / 어떻게 연락하나". 그래서
 * 선언(미션) → 증거(지표 · 일하는 방식 · 연혁 · 파트너) → 접점(오시는 길)
 * 순으로 쌓았다. 연혁을 맨 위에 두는 회사소개가 많지만, 연혁은 신뢰의
 * 근거이지 소개의 첫 문장은 아니다.
 *
 * 색 배치는 홈과 같은 규칙을 따른다. 다크 스파인은 머리 밴드와 연혁 둘뿐이고,
 * 나머지는 흰 본문 위에서 진행한다.
 */
import { PageHero } from "../components/PageHero.js";
import { MissionBand } from "../components/MissionBand.js";
import { StatCounters } from "../components/StatCounters.js";
import { ChallengeGrid } from "../components/ChallengeGrid.js";
import { HistoryTimeline } from "../components/HistoryTimeline.js";
import { PartnerWall } from "../components/PartnerWall.js";
import { LocationBand } from "../components/LocationBand.js";
import { CtaBandLight } from "../components/CtaBandLight.js";

export const aboutPage = {
  id: "about",
  sections: [
    {
      component: PageHero,
      props: {
        breadcrumb: [
          { label: "홈", href: "#/" },
          { label: "회사소개" },
        ],
        eyebrow: "ABOUT RAINBOW BRAIN",
        title: "기술을 현장에서 작동하게 만드는 팀",
        lede: "레인보우브레인은 생성형 AI · RAG · RPA를 기업의 실제 업무에 연결합니다. 진단부터 구축, 운영과 내재화까지 한 팀이 끝까지 맡습니다.",
        // 페이지 안 이동은 `?to=<id>`로 건다. 이유는 src/core/router.js 참고.
        index: [
          { label: "회사 개요", href: "#/about?to=overview" },
          { label: "일하는 방식", href: "#/about?to=values" },
          { label: "연혁", href: "#/about?to=history" },
          { label: "오시는 길", href: "#/about?to=location" },
        ],
      },
    },

    /* ── 1. 미션 — 회사가 무엇을 하는 곳인지 한 화면에서 끝낸다 ──────────── */
    {
      component: MissionBand,
      resource: "about.intro",
      props: { id: "overview", eyebrow: "WHO WE ARE" },
      optional: true,
    },

    /* ── 2. 지표 — 홈과 같은 리소스. 소개의 근거로 다시 쓴다 ─────────────── */
    {
      component: StatCounters,
      resource: "stats.list",
      props: {
        eyebrow: "RESULTS, PROVEN BY NUMBERS",
        title: "숫자로 확인하는 도입 성과",
        note: "2016–2026 누적 실적",
        max: 4,
      },
      optional: true,
    },

    /* ── 3. 일하는 방식 — ChallengeGrid를 그대로 재사용한다.
           (제목 + 설명 4개라는 구조가 같아 새 컴포넌트가 필요 없다) ──────── */
    {
      component: ChallengeGrid,
      resource: "about.values",
      props: {
        id: "values",
        eyebrow: "HOW WE WORK",
        title: "일하는 방식 네 가지",
        subtitle: "도구를 파는 대신, 고객이 스스로 운영할 수 있는 상태까지 만듭니다.",
      },
      optional: true,
    },

    /* ── 4. 연혁 ──────────────────────────────────────────────────────────── */
    {
      component: HistoryTimeline,
      resource: "about.history",
      props: {
        id: "history",
        eyebrow: "HISTORY",
        title: "2016년부터의 기록",
        subtitle: "RPA로 시작해 생성형 AI까지, 자동화의 축이 바뀌는 과정을 함께 지나왔습니다.",
      },
      optional: true,
    },

    /* ── 5. 파트너 ────────────────────────────────────────────────────────── */
    {
      component: PartnerWall,
      resource: "partners.list",
      props: { title: " " },
      optional: true,
    },

    /* ── 6. 오시는 길 ─────────────────────────────────────────────────────── */
    {
      component: LocationBand,
      resource: "about.location",
      props: { id: "location", eyebrow: "LOCATION", title: "오시는 길" },
      optional: true,
    },

    /* ── 7. 마무리 ────────────────────────────────────────────────────────── */
    {
      component: CtaBandLight,
      resource: "cta.closing",
      optional: true,
    },
  ],
};
