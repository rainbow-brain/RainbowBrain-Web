/**
 * reveal.js — 스크롤 진입 애니메이션.
 *
 * 모션은 두 가지뿐이다 — 아래에서 올라오며 나타나거나(기본), 자리 이동 없이
 * 밝아지거나(`="in"`). 어느 쪽인지는 CSS가 정하고 이 파일은 관여하지 않는다.
 * 방향별 리빌을 없앤 이유는 base.css의 스크롤 등장 주석에 적어 두었다.
 *
 * 템플릿 사용법:
 *   <div data-reveal="up">…</div>                        ← 올라오며 나타남
 *   <div data-reveal="in" data-reveal-delay="120">…</div> ← 밝아지기만
 *   <ul data-reveal-stagger="90"> <li data-reveal="up">…   ← 자동 지연
 *
 * 문서 전체를 하나의 IntersectionObserver가 관찰한다. 컴포넌트는 렌더 후
 * `observeIn(root)`을 호출해 새로 주입된 DB 콘텐츠도 애니메이션되게 한다.
 * 한 번 노출된 엘리먼트는 관찰 대상에서 제외된다.
 *
 * ── 안전장치 ────────────────────────────────────────────────────────────────
 * "노출 전까지 숨김"은 위험한 기본값이다. 옵저버가 동작하지 않는 상황
 * (IntersectionObserver 미지원, 백그라운드 탭, 프리렌더, 확장 프로그램 등)에서
 * 페이지 전체가 opacity 0으로 남을 수 있다. 3중 방어:
 *   1. 기능 감지     — IO 미지원이면 전부 즉시 노출
 *   2. 동기 1차 검사 — 이미 화면에 보이는 요소는 옵저버를 기다리지 않고 바로 노출
 *   3. 워치독        — WATCHDOG_MS 후에도 옵저버가 한 번도 안 걸렸으면 전부 노출
 * 콘텐츠 표시 여부가 애니메이션 성공에 의존하지 않도록 한다.
 */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SUPPORTED = typeof window.IntersectionObserver === 'function';
const WATCHDOG_MS = 3000;

let observer = null;
let observerHasFired = false;
let watchdogTimer = null;

function reveal(node) {
  node.classList.add('is-revealed');
}

function ensureObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observerHasFired = true;
      reveal(entry.target);
      observer.unobserve(entry.target);
    }
  }, {
    // 요소가 완전히 보이기 직전에 발동시켜, 사용자가 도달했을 때
    // 모션이 시작되는 게 아니라 끝나 있도록 한다.
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.08,
  });
  return observer;
}

/** 방어 3: 교차 이벤트가 한 번도 없었다면 페이지 숨김을 해제한다. */
function armWatchdog() {
  if (watchdogTimer !== null) return;
  watchdogTimer = setTimeout(() => {
    if (!observerHasFired) {
      console.warn('[reveal] IntersectionObserver never fired — revealing all content.');
      revealAll();
    }
  }, WATCHDOG_MS);
}

/**
 * 방어 4: 백그라운드 탭에서 로드된 페이지는 `visibilityState: hidden`이다.
 * 숨은 탭에서는 IntersectionObserver도 타이머도 제대로 돌지 않아 위의 방어들이
 * 탭 전환 전까지 멈춰 있다. 페이지가 보이는 순간 뷰포트 검사를 다시 돌린다.
 */
if (SUPPORTED && !REDUCED) {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((node) => {
      if (inViewport(node)) reveal(node);
    });
    armWatchdog();
  });
}

/** 현재 요소가 뷰포트와 겹쳐 있으면 true. */
function inViewport(node) {
  const r = node.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const vw = window.innerWidth || document.documentElement.clientWidth;
  return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
}

/**
 * `root` 내부(자신 포함)의 모든 [data-reveal]을 관찰 대상에 등록한다.
 * 여러 번 호출해도 안전 — 이미 노출된 노드는 건너뛴다.
 */
export function observeIn(root = document) {
  const nodes = [];
  if (root.matches?.('[data-reveal]')) nodes.push(root);
  nodes.push(...(root.querySelectorAll?.('[data-reveal]') || []));

  // 스태거 처리: [data-reveal-stagger]의 자식들에 순차 지연값을 부여.
  root.querySelectorAll?.('[data-reveal-stagger]').forEach((parent) => {
    const step = Number(parent.dataset.revealStagger) || 80;
    parent.querySelectorAll(':scope > [data-reveal]').forEach((child, i) => {
      if (!child.dataset.revealDelay) child.dataset.revealDelay = String(i * step);
    });
  });

  for (const node of nodes) {
    if (node.classList.contains('is-revealed')) continue;

    const delay = node.dataset.revealDelay;
    if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);

    // 방어 1 — 모션을 원치 않거나 옵저버를 쓸 수 없는 경우.
    if (REDUCED || !SUPPORTED) { reveal(node); continue; }

    // 방어 2 — 이미 화면에 보이면 기다리지 말고 즉시 노출.
    if (inViewport(node)) { reveal(node); continue; }

    ensureObserver().observe(node);
  }

  if (!REDUCED && SUPPORTED) armWatchdog();
}

/** 전체를 즉시 노출 (안전장치, 인쇄, 테스트용). */
export function revealAll(root = document) {
  root.querySelectorAll('[data-reveal]').forEach(reveal);
}
