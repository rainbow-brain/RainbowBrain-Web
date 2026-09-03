/**
 * router.js — 해시 라우터.
 *
 * 왜 해시(`#/about`)인가:
 *   이 사이트는 빌드 도구도 서버 로직도 없는 정적 파일 묶음이고, 배포처는
 *   GitHub Pages의 하위 경로(`/RainbowBrain-Web/`)다. `/about` 같은 실제
 *   경로를 쓰려면 서버마다 SPA 폴백 설정이 필요하고, 하위 경로 배포에서는
 *   루트 절대경로가 아예 다른 사이트를 가리킨다. 해시는 어떤 정적 호스트에서도
 *   설정 없이 동작하고, 새로고침·뒤로가기·직접 링크가 전부 그대로 된다.
 *
 * 구조:
 *   셸(헤더 · 푸터 · 레일)은 부팅 때 한 번만 그린다. 라우터는 `main` 안의
 *   페이지만 갈아 끼운다. 그래서 페이지를 옮겨도 헤더가 깜빡이지 않는다.
 *
 * 라우트 표는 `src/pages/routes.js`에 있다. 항목 하나가 페이지 하나다:
 *   { path: '/about', title: '회사소개', manifest: aboutPage }
 *
 * 쿼리도 해시 안에 넣는다 — `#/cases?cat=금융`.
 * 파싱한 값은 각 섹션에 `props.route = { path, query }`로 주입된다.
 *
 * 페이지 안 특정 섹션으로 보내는 링크는 `#/about?to=history` 형태를 쓴다.
 * 보통 쓰는 `#history` 앵커는 여기서 쓸 수 없다 — 해시 전체가 라우터 몫이라
 * `#/about#history`는 경로 `/about#history`로 읽혀 매칭에 실패한다. 대신
 * 라우터가 렌더를 마친 뒤 `to`에 해당하는 id로 직접 스크롤한다. 섹션이
 * 데이터를 받아 높이가 확정된 다음에 움직이므로 위치도 정확하다.
 */
import { Page } from './page.js';

/**
 * 라우트 형식의 해시인지 판별한다 — `#/`로 시작하거나 비어 있으면 라우트다.
 *
 * `#main`(본문 건너뛰기 링크)이나 `#`(데이터에 href가 없을 때의 자리표시)
 * 같은 평범한 앵커까지 라우터가 가로채면, 건너뛰기 링크 한 번에 페이지가
 * "준비 중"으로 바뀐다. 그런 해시는 브라우저의 기본 동작에 그대로 맡긴다.
 */
export function isRouteHash(hash = window.location.hash) {
  const raw = String(hash || '').replace(/^#/, '');
  return raw === '' || raw.startsWith('/');
}

/** `#/cases?cat=금융` -> { path: '/cases', query: { cat: '금융' } } */
export function parseHash(hash = window.location.hash) {
  const raw = String(hash || '').replace(/^#/, '');
  const [pathPart, queryPart] = raw.split('?');
  let path = pathPart || '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1) path = path.replace(/\/+$/, '');   // 끝 슬래시 제거
  const query = Object.fromEntries(new URLSearchParams(queryPart || ''));
  return { path: path || '/', query };
}

export class Router {
  /**
   * @param {object}     options
   * @param {object[]}   options.routes    [{ path, title, description?, manifest }]
   * @param {DataClient} options.client
   * @param {object}     options.targets   이름 -> DOM 엘리먼트
   * @param {object}     [options.fallback] 매칭 실패 시 쓸 라우트
   * @param {Function}   [options.onRoute]  (route, ctx) => void — 렌더 후 호출
   */
  constructor({ routes, client, targets, fallback, onRoute }) {
    this.routes = routes;
    this.client = client;
    this.targets = targets;
    this.fallback = fallback;
    this.onRoute = onRoute;
    this.page = null;
    this.current = null;
    this._onHashChange = () => this.handle();
  }

  start() {
    window.addEventListener('hashchange', this._onHashChange);
    return this.handle({ initial: true });
  }

  stop() {
    window.removeEventListener('hashchange', this._onHashChange);
  }

  match(path) {
    return this.routes.find(r => r.path === path) || null;
  }

  /** 현재 해시를 읽어 해당 페이지를 그린다. */
  async handle({ initial = false } = {}) {
    // 라우트가 아닌 앵커(#main 등)는 건드리지 않는다. 첫 진입이라면 그래도
    // 페이지 하나는 그려야 하므로 홈으로 본다.
    if (!isRouteHash()) {
      if (!initial) return this.page;
      return this._render(this.match('/') || this.fallback, { path: '/', query: {} }, true);
    }

    const ctx = parseHash();
    const route = this.match(ctx.path) || this.fallback;
    if (!route) return null;

    // 같은 경로에서 쿼리만 바뀐 경우(사례 필터 등)는 다시 그리지 않는다.
    // 컴포넌트가 스스로 필터를 처리한다.
    const sameRoute = this.current && this.current.route === route;
    const sameQuery = sameRoute &&
      JSON.stringify(this.current.ctx.query) === JSON.stringify(ctx.query);
    if (sameRoute && sameQuery && !initial) return this.page;

    if (sameRoute && !initial) {
      // 경로는 그대로, 쿼리만 변경 — 섹션에 알리고 끝낸다.
      this.current = { route, ctx };
      this.page?.sections.forEach(({ instance }) => {
        instance.props.route = ctx;
        instance.onRouteChange?.(ctx);
      });
      this.onRoute?.(route, ctx);
      this.scrollToTarget(ctx);
      return this.page;
    }

    return this._render(route, ctx, initial);
  }

  /** 이전 페이지를 걷어내고 새 매니페스트를 `main`에 그린다. */
  async _render(route, ctx, initial) {
    if (!route) return null;

    this.page?.destroy();
    this.targets.main.innerHTML = '';

    document.title = route.title
      ? `${route.title} | 레인보우브레인`
      : '레인보우브레인 | 생성형 AI · RAG · RPA 기반 지능형 업무 자동화';
    if (route.description) {
      document.querySelector('meta[name="description"]')
        ?.setAttribute('content', route.description);
    }

    this.current = { route, ctx };
    this.page = new Page(route.manifest, this.client, this.targets, { route: ctx });
    const rendered = this.page.render();

    // 페이지를 바꿀 때는 항상 맨 위에서 시작한다. 스크롤 위치가 남아 있으면
    // 새 페이지의 중간부터 보이는 것처럼 읽힌다.
    if (!initial) window.scrollTo({ top: 0, behavior: 'auto' });

    this.onRoute?.(route, ctx);
    await rendered;
    // 섹션이 데이터를 받아 높이가 확정된 뒤에 움직인다.
    this.scrollToTarget(ctx);
    return this.page;
  }

  /**
   * `?to=history` -> id가 history인 요소로 스크롤.
   * 상단 고정 헤더 높이만큼 빼지 않으면 제목이 바 뒤에 숨는다.
   */
  scrollToTarget(ctx) {
    const id = ctx.query?.to;
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const header = getComputedStyle(document.documentElement)
      .getPropertyValue('--header-height').trim();
    const offset = (parseInt(header, 10) || 60) + 12;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
  }

  /** 코드에서 이동할 때 사용. 링크는 그냥 href="#/about"을 쓰면 된다. */
  go(path) {
    window.location.hash = path.startsWith('#') ? path : `#${path}`;
  }
}
