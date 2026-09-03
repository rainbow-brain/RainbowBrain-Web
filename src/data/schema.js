/**
 * schema.js — DB와 UI 사이의 계약.
 *
 * 이 파일은 문서이자 개발용 검증기다. 나중에 어떤 백엔드를 붙이든 JSON은
 * 아래 형태를 지켜야 한다. MockAdapter -> RestAdapter로 바꿔도 나머지 코드는
 * 수정할 필요가 없다.
 *
 * ── 리소스 목록 ─────────────────────────────────────────────────────────────
 *
 * 'nav.menu'          -> { items: NavItem[], actions: Action[] }
 * 'hero.slides'       -> Slide[]                (캐러셀 — 유일)
 * 'news.list'         -> Article[]              (정렬 불필요 —
 *                                                UI가 publishedAt 기준 정렬)
 * 'promotions.list'   -> Promotion[]            (세로로 쌓이는 피처 배너)
 * 'cases.list'        -> Article[]              (구축사례 — news와 동일 구조)
 * 'capabilities.list' -> CapabilityGroup[]
 * 'challenges.list'   -> Challenge[]
 * 'partners.list'     -> { headline, note, items: Partner[] }
 * 'stats.list'        -> { headline, note, items: StatCard[] }
 * 'cta.report'        -> ReportCta | null
 * 'cta.closing'       -> ClosingCta | null
 * 'footer.info'       -> FooterInfo
 * 'rail.items'        -> RailItem[]
 *
 * ── 하위 페이지 전용 ────────────────────────────────────────────────────────
 * 'about.intro'       -> AboutIntro            (회사소개 — 미션)
 * 'about.values'      -> Challenge[]           (회사소개 — 일하는 방식.
 *                                               challenges.list와 같은 모양이라
 *                                               ChallengeGrid를 그대로 쓴다)
 * 'about.history'     -> HistoryGroup[]        (회사소개 — 연혁)
 * 'about.location'    -> LocationInfo          (회사소개 — 오시는 길)
 * 'services.list'     -> Service[]             (서비스)
 * 'services.process'  -> ProcessStep[]         (서비스 — 진행 단계)
 * 'solutions.list'    -> Solution[]            (솔루션)
 * 'solutions.rollout' -> ProcessStep[]         (솔루션 — 도입 절차)
 *
 * ── 데이터 구조 ─────────────────────────────────────────────────────────────
 *
 * Image        { url: string, alt: string }
 * Frame        { url: string, title?: string }
 * Action       { label: string, href: string, variant?: 'primary'|'secondary'|'ghost-dark'|'invert' }
 * NavItem      { label: string, href: string, current?: boolean,
 *                children?: { label, href, note? }[] }
 *   참고: `children`이 있으면 헤더에 메가 메뉴 패널이 열린다(hover/focus).
 *         비어 있거나 없으면 패널 없이 링크로만 동작한다.
 *         `note`는 하위 항목 아래 붙는 한 줄 설명 — 선택.
 *
 * Slide        { id, introEyebrow?, statement?, eyebrow?, title, description?, image?: Image, frame?: Frame, actions?: Action[] }
 *
 * Strip        { text: string, action?: Action }
 *
 * Article      { id, title, excerpt?, category?, publishedAt: ISO-8601 문자열,
 *                image?: Image, href?: string, source?: string }
 *   참고: `publishedAt`이 대표 기사 슬롯을 결정한다. 가장 최근 글이
 *         자동으로 큰 대표 위치에 배치된다.
 *
 * Promotion    { id, eyebrow?, title, description?, action?: Action,
 *                accent?: 'blue'|'violet' }
 *   참고: `title`은 heading-1/800, `description`은 body-sm으로 렌더링된다.
 *
 * CapabilityGroup { id, title, items: string[] }
 * Challenge       { id, title, description, icon?: string, accent?: 'blue'|'violet' }
 * Partner         { id, name, note?, logo?: Image, href? }
 * StatCard        { id, label, icon?, figures: Figure[], description?, source? }
 * Figure          { value: string, caption?: string }
 * ReportCta       { eyebrow?, title, description?, image?: Image, actions?: Action[] }
 * ClosingCta      { title, description?, action?: Action }
 * FooterInfo   { logo, tagline?, directories: { title, links: NavItem[] }[],
 *                legal: { label, value }[], policyHref?, copyright? }
 * RailItem     { id, label, href, accent?: boolean, collapsible?: boolean }
 *
 * AboutIntro   { eyebrow?, title, body: string[],
 *                points?: [{ label, value, note? }], image?: Image }
 * HistoryGroup { id, year: string, note?: string,
 *                entries: [{ month?: string, title, description? }] }
 *   참고: 배열 순서가 곧 화면 순서다. 최신 연도를 위에 두려면 그 순서로 준다.
 * LocationInfo { name?, address, addressDetail?, mapHref?, mapEmbed?,
 *                image?: Image,
 *                contacts?: [{ label, value, href? }],
 *                transit?:  [{ label, description }] }
 *   참고: `mapEmbed`(iframe URL)가 있으면 지도가 그 자리에 들어가고,
 *         없으면 `image`가 대신 놓인다. 지도 SDK 키는 운영에서 채운다.
 * Service      { id, code?, title, summary?, description?,
 *                deliverables?: string[], outcomes?: [{ value, caption }],
 *                tags?: string[], href? }
 *   참고: `id`는 앵커로도 쓰인다 — `#/services` 안에서 `id="rag"` 같은 식.
 * ProcessStep  { id, title, description?, duration? }
 *   참고: 번호는 배열 순서로 자동 생성된다. 데이터에 넣지 않는다.
 * Solution     { id, eyebrow?, name, tagline?, description?,
 *                features?: [{ name, note? }], specs?: [{ label, value }],
 *                badges?: string[], image?: Image, actions?: Action[] }
 *
 * ── 링크 표기 ───────────────────────────────────────────────────────────────
 * 내부 링크는 전부 해시 경로(`#/about`, `#/cases?cat=금융`)로 적는다.
 * 이 사이트는 서버 설정 없이 정적 파일로 서빙되고 배포처가 하위 경로이므로,
 * `/about` 같은 절대경로는 새로고침·직접 링크에서 깨진다. (src/core/router.js)
 */

/** 리소스에 데이터가 아직 없을 때 반환할 빈 값. */
export const EMPTY = {
  "nav.menu": { items: [], actions: [] },
  "hero.slides": [],
  "news.list": [],
  "promotions.list": [],
  "cases.list": [],
  "capabilities.list": [],
  "challenges.list": [],
  "partners.list": { headline: "", note: "", items: [] },
  "stats.list": { headline: "", note: "", items: [] },
  "cta.report": null,
  "cta.closing": null,
  "footer.info": { logo: "", directories: [], legal: [] },
  "rail.items": [],

  /* 하위 페이지 */
  "about.intro": null,
  "about.values": [],
  "about.history": [],
  "about.location": null,
  "services.list": [],
  "services.process": [],
  "solutions.list": [],
  "solutions.rollout": [],
};

/**
 * 기사를 최신순으로 정렬한다. UI가 이 함수를 호출해, 별도 표시 없이도
 * 가장 최근에 발행된 글이 항상 대표 슬롯에 오도록 한다.
 */
export function sortByNewest(articles = []) {
  return [...articles].sort((a, b) => {
    const ta = new Date(a?.publishedAt || 0).getTime();
    const tb = new Date(b?.publishedAt || 0).getTime();
    return tb - ta;
  });
}

/** 개발용 구조 검사. 로그만 남기고 예외는 던지지 않는다 (한 행 오류로 페이지가 비면 안 되므로). */
export function validate(resource, payload) {
  const required = {
    "hero.slides": ["title"],
    "news.list": ["title", "publishedAt"],
    "cases.list": ["title", "publishedAt"],
    "promotions.list": ["title"],
    "challenges.list": ["title"],
    "about.values": ["title"],
    "about.history": ["year"],
    "services.list": ["title"],
    "services.process": ["title"],
    "solutions.list": ["name"],
    "solutions.rollout": ["title"],
  }[resource];
  if (!required || !Array.isArray(payload)) return payload;

  payload.forEach((row, i) => {
    const missing = required.filter(
      (k) => row?.[k] === undefined || row?.[k] === null,
    );
    if (missing.length) {
      console.warn(
        `[schema] ${resource}[${i}] missing: ${missing.join(", ")}`,
        row,
      );
    }
  });
  return payload;
}
