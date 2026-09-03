/**
 * home.js — 메인 페이지를 데이터로 표현한 것. (테마 1 "Deep Field")
 *
 * 밴드 구성은 NOBASE CLASS(nobase-class.codextyle.com)의 홈 골격을 옮긴
 * 것이다. 내용·색·데이터는 그대로 두고 "무엇을 어떤 모양으로 언제 보여
 * 주는가"만 그쪽 순서로 맞췄다. 옮겨 온 것은 다섯 가지다:
 *
 *   1. 지표를 히어로 안으로   — 첫 화면에서 "무엇을 하는가" 다음 줄이
 *                              바로 "얼마나 했는가"가 된다.
 *   2. 면 사이 사선 전환      — 명도 차가 가장 큰 경계를 직각으로 두지 않는다.
 *   3. 제목을 밴드로 분리     — 제목과 내용 사이 간격을 한 곳이 정한다.
 *   4. 계단식 4열 카드        — 대등한 넷을 동시에, 어긋나게 세운다.
 *   5. 마무리에 연락 창구 3열 — 어디로 문의하는지가 푸터 각주에 있지 않다.
 *
 * 색 사용:
 *   다크 스파인(네이비) — 헤더 · 히어로 · 푸터
 *   화이트 본문         — 파트너 · 제목 · 역량 · 사례 · 마무리
 *   그레이              — 도전과제 1곳
 *   블루(primary) 밴드  — 리포트 CTA 1곳 (유일, 우측 정렬)
 *   그라데이션 배너     — 제품 1곳
 *   바이올렛 밴드는 쓰지 않는다(칩 강조에만 남긴다).
 *
 * 모션:
 *   등장은 fadeInUp(글) / fadeIn(목록·그리드) 두 가지뿐이다. 근거는
 *   assets/css/base.css의 "스크롤 등장" 주석에 있다. 그 위에 히어로 판의
 *   마우스 패럴랙스 하나만 더한다.
 *
 * 헤더 · 푸터 · 플로팅 레일은 여기에 없다. 라우터가 `main`만 갈아 끼우고
 * 그 셋은 `src/pages/shell.js`가 부팅 때 한 번 그린 뒤 유지한다.
 */
import { HeroSpine } from "../components/HeroSpine.js";
import { BandDivider } from "../components/BandDivider.js";
import { PartnerWall } from "../components/PartnerWall.js";
import { SectionIntro } from "../components/SectionIntro.js";
import { CategoryStack } from "../components/CategoryStack.js";
import { FeatureBanner } from "../components/FeatureBanner.js";
import { ShowcaseRow } from "../components/ShowcaseRow.js";
import { TabPanels } from "../components/TabPanels.js";
import { CtaBandPrimary } from "../components/CtaBandPrimary.js";
import { ContactColumns } from "../components/ContactColumns.js";

export const homePage = {
  id: "home",
  sections: [
    /* ── 1. 히어로 — 자동 전환 슬라이드 + 성과 지표 4개 ────────────────── */
    {
      component: HeroSpine,
      resource: "hero.slides",
      params: { limit: 3 },
      // 지표는 별도 밴드가 아니라 판 안에 들어간다. 리소스는 하나만 걸 수
      // 있으므로 보조 리소스는 extra로 받는다(core/page.js).
      extra: { stats: "stats.list" },
      props: {
        eyebrow: "GENERATIVE AI · RAG · AUTOMATION",
        statement: "생성형 AI를 현장에서 작동하게",
        lede: "사내 문서를 그대로 학습해 업무 전문가 수준의 답변을 제공합니다. 진단부터 구축·운영까지 한 팀이 책임집니다.",
        actions: [
          { label: "유레카 GenAI 체험 신청", href: "#/trial" },
          { label: "기술백서 받기", href: "#/resources", variant: "secondary" },
        ],
        statMax: 4,
      },
      optional: true,
    },

    /* ── 2. 파트너 — 흰 면 위 워드마크 마퀴 ─────────────────────────────
       NOBASE는 히어로 바로 뒤에 사선 전환 판을 둔다. 여기는 두지 않았다 —
       이 사이트의 히어로는 밴드 아래쪽이 흰색으로 녹아내리며 스스로 전환을
       끝낸다. 그 위에 사선을 하나 더 얹으면, 이미 흰 면이 된 자리에 남색
       삼각형이 다시 나타나 두 면을 잇는 게 아니라 그 위에 얹힌 도형으로
       보인다. 사선은 아래 8번, 평면색 둘이 실제로 맞닿는 자리에 있다. */
    {
      component: PartnerWall,
      resource: "partners.list",
      props: { title: " " },
      optional: true,
    },

    /* ── 3. 역량 제목 — 밴드로 떼어 낸 헤딩 ────────────────────────────── */
    {
      component: SectionIntro,
      props: {
        eyebrow: "CAPABILITIES",
        title: "우리가 하는 일",
        subtitle: "네 개의 축이 하나의 아키텍처로 연결됩니다.",
        tone: "light",
      },
    },

    /* ── 4. 역량 — 계단식 4열 카드 ─────────────────────────────────────── */
    {
      component: CategoryStack,
      resource: "capabilities.list",
      props: { moreLabel: "더 알아보기", moreHref: "#/services" },
      optional: true,
    },

    /* ── 5. 자사 제품 — 좌우 끝까지 채우는 배너 ────────────────────────── */
    {
      component: FeatureBanner,
      props: {
        eyebrow: "EUREKA GenAI",
        title: "필수가 된 AI 기술, 기업 안에서 쓰이게",
        description:
          "기업 특화 AI 업무 지원 솔루션 유레카GenAI를 경험해 보세요. 사내 문서를 그대로 학습해 업무 전문가 수준의 답변을 제공합니다.",
        watermark: "EUREKA",
        features: [
          { name: "폐쇄망 설치", note: "데이터 외부 유출 없음" },
          { name: "문서 근거 인용", note: "출처와 함께 답변" },
          { name: "권한별 검색", note: "조직 체계 그대로" },
          { name: "모델 선택", note: "국내외 LLM 교체 가능" },
        ],
        actions: [
          { label: "체험 신청하기", href: "#/trial" },
          {
            label: "자세히 보기",
            href: "#/solutions?to=eureka-genai",
            variant: "secondary",
          },
        ],
        // TODO(운영): 실제 제품 화면 캡처로 교체. 비우면 글만 있는 배너가 된다.
        image: null,
      },
    },

    /* ── 6. 구축사례 — 같은 크기 카드 3장 ──────────────────────────────── */
    {
      component: ShowcaseRow,
      resource: "cases.list",
      params: { limit: 7 },
      props: {
        id: "cases",
        eyebrow: "CASE STUDIES",
        title: "구축 사례",
        count: 3,
        moreHref: "#/cases",
        moreLabel: "전체 보기",
      },
      optional: true,
    },

    /* ── 7. 도전과제 — 탭 하나에 본문 하나 (그레이 밴드 1곳) ───────────── */
    {
      component: TabPanels,
      resource: "challenges.list",
      props: {
        id: "stalls",
        eyebrow: "WHY IT STALLS",
        title: "도입이 멈추는 네 가지 이유",
      },
      optional: true,
    },

    /* ── 8. 사선 전환 — 그레이에서 남색으로 ─────────────────────────────
       페이지에서 가장 큰 명도 차가 나는 경계다(#f0f0f0 -> #001c88). 직각으로
       맞닿으면 그 선이 페이지를 두 동강 내는데, 사선이면 위 면이 아래로
       흘러내린다. from/to는 앞뒤 밴드가 실제로 쓰는 면 색과 같아야 한다. */
    {
      component: BandDivider,
      props: { from: "soft", to: "primary" },
    },

    /* ── 9. 유일한 블루 밴드 — 우측 정렬 ──────────────────────────────── */
    {
      component: CtaBandPrimary,
      resource: "cta.report",
      props: { align: "right" },
      optional: true,
    },

    /* ── 10. 마무리 — 흰 밴드에 연락 창구 3열 ──────────────────────────
       면을 다크로 두면 위(남색)와 1.28:1, 아래(네이비 푸터)와는 같은 색이
       되어 셋이 한 덩어리가 된다. 흰 면이 그 사이를 벌린다. */
    {
      component: ContactColumns,
      resource: "cta.closing",
      // 연락처는 회사소개의 "오시는 길"이 이미 들고 있다. 같은 값을 두 곳에
      // 적어 두면 한쪽만 고쳐지므로 여기서 그대로 빌려 쓴다.
      extra: { place: "about.location" },
      props: { eyebrow: "CONTACT US" },
      optional: true,
    },
  ],
};
