/**
 * main.js — 유일한 배선(wiring) 파일.
 *
 * ┌── 실제 DB로 전환하는 방법 ─────────────────────────────────────────────┐
 * │  1. import { RestAdapter } from './data/adapters/rest.js';             │
 * │  2. const adapter = new RestAdapter({ baseUrl: '/api' });              │
 * │  나머지 코드는 손댈 필요 없음.                                          │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * 구조: 셸(헤더 · 푸터 · 레일)을 한 번 그리고, 라우터가 `main` 안의 페이지만
 * 갈아 끼운다. 경로 표는 `src/pages/routes.js`에 있다.
 */
import { DataClient } from './data/client.js';
import { MockAdapter } from './data/adapters/mock.js';
// import { RestAdapter } from './data/adapters/rest.js';
import { Page } from './core/page.js';
import { Router } from './core/router.js';
import { shellPage } from './pages/shell.js';
import { routes, notFoundRoute } from './pages/routes.js';

/* --- 1. 데이터 소스 선택 -------------------------------------------------- */
// 기본은 빈 구조. URL에 ?preview=1 을 붙이면 샘플 데이터를 불러와
// 내용이 채워진 상태로 레이아웃을 확인할 수 있다.
const usePreview = new URLSearchParams(location.search).has('preview');

const adapter = usePreview
  ? new MockAdapter({ seed: (await import('./data/sample.js')).sample, latency: 350 })
  : new MockAdapter({ latency: 250 });

// DB 연동 시:
// const adapter = new RestAdapter({ baseUrl: '/api' });

const client = new DataClient(adapter);

/* --- 2. 마운트 대상 ------------------------------------------------------- */
const targets = {
  header: document.getElementById('header-root'),
  main:   document.getElementById('main'),
  footer: document.getElementById('footer-root'),
  rail:   document.getElementById('rail-root'),
};

/* --- 3. 셸: 페이지가 바뀌어도 다시 그리지 않는다 -------------------------- */
const shell = new Page(shellPage, client, targets);
const shellReady = shell.render();

/* --- 4. 라우팅 ------------------------------------------------------------ */
/**
 * 헤더의 현재 메뉴 표시.
 * 헤더는 데이터로 그려지므로 매니페스트에 `current`를 박아둘 수 없다
 * (같은 nav.menu를 모든 페이지가 공유한다). 대신 이동할 때마다 링크의
 * href를 현재 경로와 대조해 붙인다. `#/cases?cat=금융`처럼 쿼리가 붙어도
 * 경로 부분만 비교한다.
 */
function markCurrentNav(route) {
  const links = document.querySelectorAll('.site-header__link, .drawer__link');
  links.forEach((a) => {
    const path = (a.getAttribute('href') || '').replace(/^#/, '').split('?')[0];
    const on = path === route.path && route.path !== '*';
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

const router = new Router({
  routes,
  client,
  targets,
  fallback: notFoundRoute,
  onRoute: markCurrentNav,
});

// 해시가 없이 들어온 경우 `#/`로 맞춰 둔다. 이후 링크·뒤로가기가
// 전부 같은 형식이 되어 라우터가 한 가지 경우만 다루면 된다.
if (!location.hash) history.replaceState(null, '', `${location.pathname}${location.search}#/`);

await router.start();
// 헤더가 데이터로 채워진 뒤 한 번 더 표시한다 — 첫 렌더 시점에는
// nav.menu가 아직 도착하지 않아 링크 자체가 없다.
shellReady.then(() => markCurrentNav(router.current?.route || routes[0]));

/* --- 5. 디버깅 / 운영용 전역 노출 ----------------------------------------- */
// 예: 글 발행 후 app.refresh('news.list') 호출.
window.app = {
  router,
  shell,
  client,
  get page() { return router.page; },
  refresh: (res) => Promise.all([shell.refresh(res), router.page?.refresh(res)]),
  go: (path) => router.go(path),
};
