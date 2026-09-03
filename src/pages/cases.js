/**
 * cases.js — 구축사례 목록 페이지 매니페스트.
 *
 * 홈의 사례 섹션은 최신 몇 건만 보여주는 미리보기이고, 이 페이지가 전체
 * 목록이다. 필터는 CaseGrid가 URL(`#/cases?cat=금융`)로 관리하므로
 * 매니페스트에서는 아무것도 하지 않는다.
 */
import { PageHero } from "../components/PageHero.js";
import { CaseGrid } from "../components/CaseGrid.js";
import { StatCounters } from "../components/StatCounters.js";
import { CtaBandLight } from "../components/CtaBandLight.js";

export const casesPage = {
  id: "cases",
  sections: [
    {
      component: PageHero,
      props: {
        breadcrumb: [
          { label: "홈", href: "#/" },
          { label: "구축사례" },
        ],
        eyebrow: "CASE STUDIES",
        title: "현장에서 끝까지 간 프로젝트들",
        lede: "금융 · 제조 · 공공 · 서비스에서 진행한 구축 사례입니다. 도입 배경과 실제로 바뀐 숫자를 함께 정리했습니다.",
        meta: [
          { value: "100+", label: "고객사" },
          { value: "2,000+", label: "자동화 과제" },
          { value: "10년", label: "구축 경험" },
        ],
      },
    },

    {
      component: CaseGrid,
      // limit 없이 전체를 받는다. 홈의 미리보기와 같은 리소스지만
      // 이쪽은 목록이 목적이므로 자르지 않는다.
      resource: "cases.list",
      props: {
        id: "cases",
        eyebrow: "ALL CASES",
        title: "구축사례 전체",
        subtitle: "산업을 선택하면 해당 분야의 사례만 모아 봅니다.",
        basePath: "/cases",
        queryKey: "cat",
      },
      optional: true,
    },

    {
      component: StatCounters,
      resource: "stats.list",
      props: {
        eyebrow: "OUTCOMES",
        title: "사례에서 확인된 성과",
        note: "2016–2026 누적 실적",
        max: 3,
      },
      optional: true,
    },

    { component: CtaBandLight, resource: "cta.closing", optional: true },
  ],
};
