/**
 * HeroSpine — 테마 1의 히어로. HeroBanner를 대체한다.
 *
 * hero.slides 3개가 일정 주기로 자동으로 넘어간다. 넘어갈 때 배경 영상과
 * 함께 eyebrow/statement/lede 문장이 그 슬라이드의 내용으로 교체된다.
 * 구분 바 3개는 글자 없이 CTA 바로 아래에 놓고, 눌러서 직접 고를 수도 있다.
 * 바는 "셋 중 몇 번째"만 말한다 — 남은 시간이 차오르던 눈금은 걷어냈다.
 * 주기는 CSS의 --spine-auto-dur 하나가 정한다.
 *
 * ── 무대 위의 두 판 ─────────────────────────────────────────────────────
 * 무대(.spine__stage) 안에는 성격이 다른 판 둘이 위아래로 놓인다.
 *
 *   .spine__frame — 배너. 슬라이드마다 통째로 바뀐다(문장 · 영상 · 구분 바).
 *   .spine__quick — 성과 지표. 슬라이드가 몇 번을 넘어가도 그대로다.
 *
 * 지표는 원래 배너 왼쪽 본문 안에 있다가, 배너 밑변에 붙인 선반이 됐다가,
 * 지금은 아예 배너 밖으로 나와 자기 테두리를 가진 별개의 판이 됐다. 배너는
 * 계속 넘어가고 지표는 고정이라, 한 상자 안에 있으면 어느 자리에 두든
 * "이 슬라이드의 숫자"로 읽힌다. 상자를 갈라야 그 오해가 끝난다.
 *
 * 카드 마크업은 HeroQuickStats.js에 있다. 독립 섹션이 아니라 무대 안에
 * 두는 이유도 그 파일에 적어 두었다(요약: 활주로 뒤로 밀려나기 때문).
 *
 * 배너는 라운드 판(.spine__frame) 한 장이고, 그 판은 화면에 붙는
 * 무대(.spine__stage, position:sticky) 안에 들어간다. 섹션 높이는
 * "화면 한 장 + 활주로"라, 활주로를 소진하는 동안 배너는 제자리에
 * 머물고 흰 면만 그 위로 올라온다 — 배너가 스크롤과 함께 밀려
 * 올라가면 아무리 속도를 조절해도 "화면을 올린 것"과 구분되지 않는다.
 *
 * 지표는 예전에 다섯 번째 밴드에 따로 있었다. 첫 화면에서 "무엇을 하는가"를
 * 읽은 직후에 "얼마나 했는가"가 이어져야 문장이 완성된다 — 다섯 화면 아래에
 * 있으면 그때는 이미 다른 이야기다.
 *
 * 리소스: 'hero.slides' -> Slide[]  (챕터 스트립용, 최대 3개 사용)
 * extra:  { stats: 'stats.list' } -> { headline, note, items: StatCard[] }
 * props: { statement, eyebrow, lede, actions:[{label,href,variant}], statMax }
 */
import { Component } from "../core/component.js";
import { html, esc, escUrl } from "../core/dom.js";
import { heroQuickStats } from "./HeroQuickStats.js";

/* 마우스를 따라 배경이 밀리는 최대 거리(px). 이보다 크면 배경이 "움직이는
   요소"가 되어 글을 읽는 동안 시선을 끈다. 있는 줄 모르고 지나가되 커서를
   움직이면 판에 깊이가 생기는 정도가 이 값이다. */
const PARALLAX_MAX = 14;

// iframe을 이 주소로 덮으면 이전 문서가 내려가면서 rAF와 타이머가 함께 멈춘다.
const BLANK = "about:blank";

// --spine-auto-dur를 못 읽었을 때만 쓰는 값. 정상 경로에서는 CSS가 정한다.
const AUTO_FALLBACK_MS = 5000;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * smoothstep — 0과 1 지점의 기울기가 0인 S자 곡선.
 *
 * 선형 진행도는 시작하는 순간 속도가 0에서 최고속으로 튀고, 끝나는 순간
 * 다시 0으로 뚝 떨어진다. 그 두 점이 "스위치가 켜졌다/꺼졌다"로 읽힌다.
 * 양 끝을 눕히면 이음매가 사라지고, 대신 중간 기울기가 1.5배가 되어
 * 한창 진행 중일 때는 오히려 더 빠르다.
 */
function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

export class HeroSpine extends Component {
  static tag = "section";
  static root = "spine";

  constructor(props) {
    super(props);
    this.index = 0;
    this.toneRaf = null;
    this.onToneScroll = null;
    this.autoTimer = null;
    this.autoMs = AUTO_FALLBACK_MS;
    // 남은 시간을 알아야 마우스를 뗐을 때 이어서 갈 수 있다.
    this.autoDeadline = 0;
    this.autoRemaining = 0;
    this.autoPaused = false;
    /* 자동 전환을 세워 둘 이유들. 하나라도 참이면 멈춘다.
       셋을 한 덩어리(autoPaused)로 뭉뚱그리면 서로를 덮어쓴다 — 예전에는
       마우스가 올라와 있는데 focusout이 오면 그대로 다시 굴러갔다. */
    this.autoHold = { hover: false, focus: false, hidden: false };
  }

  isEmpty() {
    return false;
  } // 문장은 props에서 오므로 슬라이드가 없어도 렌더한다.

  template(state) {
    const p = this.props;
    const slides = (Array.isArray(state.data) ? state.data : []).slice(0, 3);
    const copy = this.copyFor(slides[this.index]);

    const actions = (p.actions || [])
      .map(
        (a) =>
          html` <a
            class="btn ${a.variant === "secondary"
              ? "btn--ghost-dark"
              : "btn--invert"}"
            href="${escUrl(a.href) || "#"}"
            >${a.label}</a
          >`,
      )
      .join("");

    const media = slides.length
      ? `<div class="spine__media">${slides
          .map((s, i) => this.mediaFor(s, i))
          .join("")}</div>`
      : `<div class="spine__media"></div>`;

    // 바에는 글자가 없다. 눈으로 읽히던 제목이 사라진 만큼 aria-label로
    // 넘겨야 스크린리더에서 "몇 번째 슬라이드인지"가 남는다.
    const chapters =
      slides.length > 1
        ? `
      <div class="spine__chapters" role="group" aria-label="배너 슬라이드">
        ${slides
          .map(
            (s, i) => `
          <button type="button" class="spine__chapter ${i === 0 ? "is-active" : ""}"
                  data-chapter="${i}" aria-pressed="${i === 0}"
                  aria-label="${esc(`슬라이드 ${i + 1}/${slides.length}${s.title ? ` — ${s.title}` : ""}`)}">
            <span class="spine__chapter-bar"></span>
          </button>`,
          )
          .join("")}
      </div>`
        : "";

    // 무대(.spine__stage)가 화면에 붙어 있고, 그 안에 판이 들어간다.
    // 섹션 자체는 무대 한 장 + 활주로 높이라, 활주로를 소진하는 동안
    // 무대는 제자리에 머문다. 흰 면은 그 위에서만 움직인다.
    return `
      <div class="spine__stage">
        <div class="container">
          <div class="spine__frame">
            <div class="spine__grid">
              <div class="spine__body">
                ${copy.eyebrow ? html`<p class="spine__eyebrow" data-eyebrow>${copy.eyebrow}</p>`.trim() : ""}
                <h1 class="spine__title" data-statement>${esc(copy.statement)}</h1>
                ${copy.lede ? html`<p class="t-body-md spine__desc" data-lede>${copy.lede}</p>`.trim() : ""}
                ${actions ? `<div class="spine__actions">${actions}</div>` : ""}
                ${chapters}
              </div>
              ${media}
            </div>
          </div>
          ${heroQuickStats(this.props.stats, this.props.statMax || 4)}
        </div>
      </div>`;
  }

  bind() {
    this.on("click", "[data-chapter]", (_e, btn) =>
      this.go(Number(btn.dataset.chapter)),
    );
    this.bindParallax();

    /* 탭이 뒤로 넘어가면 세운다. 넘어갈 때마다 iframe을 다시 로드하므로,
       보이지도 않는 탭에서 주기마다 데모를 새로 띄울 이유가 없다. */
    this.onVisibility = () => this.setAutoHold("hidden", document.hidden);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  copyFor(slide) {
    return {
      eyebrow: slide?.introEyebrow || this.props.eyebrow || "",
      statement: slide?.statement || this.props.statement || "",
      lede: slide?.description || this.props.lede || "",
    };
  }

  mediaFor(slide, index) {
    const active = index === 0 ? "is-active" : "";
    if (slide?.frame?.url) {
      // src는 비워두고 URL은 data-src에만 담는다. 실제 로드는 activateMedia()가
      // 활성 챕터에만 걸어준다. 보이지 않는 챕터의 데모가 백그라운드에서
      // 계속 돌지 않게 하고, 다시 열 때 처음부터 재생시키기 위함이다.
      return `<iframe
        class="${active}"
        data-media="${index}"
        data-src="${escUrl(slide.frame.url)}"
        title="${esc(slide.frame.title || slide.image?.alt || slide.title || "Hero demo")}"
        aria-hidden="${index === 0 ? "false" : "true"}"></iframe>`;
    }
    if (!slide?.image?.url) return "";
    return `<img src="${escUrl(slide.image.url)}" alt="${esc(slide.image.alt || "")}"
      class="${active}" data-media="${index}"
      ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  }

  /** 슬라이드 전환 — 배경 영상과 히어로 문장을 해당 슬라이드 내용으로 바꾼다. */
  go(next) {
    const slides = Array.isArray(this.state.data) ? this.state.data : [];
    if (!slides[next]) return;
    // 사람이 직접 고르든 타이머가 넘기든, 넘어간 순간부터 주기를 다시 센다.
    // 안 그러면 마지막 1초에 누른 슬라이드가 곧바로 지나가 버린다.
    this.restartAuto();
    // 이미 열려 있는 슬라이드를 다시 눌러도 영상은 처음부터 다시 재생한다.
    if (next === this.index) return this.activateMedia(next);
    this.index = next;
    const copy = this.copyFor(slides[next]);

    this.el.querySelectorAll("[data-chapter]").forEach((b, i) => {
      const active = i === next;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    this.el.querySelectorAll("[data-media]").forEach((media, i) => {
      const active = i === next;
      media.classList.toggle("is-active", active);
      media.setAttribute("aria-hidden", String(!active));
    });
    const eyebrow = this.el.querySelector("[data-eyebrow]");
    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    const statement = this.el.querySelector("[data-statement]");
    if (statement) statement.textContent = copy.statement;
    const lede = this.el.querySelector("[data-lede]");
    if (lede) lede.textContent = copy.lede;

    this.activateMedia(next);
  }

  /** CSS의 --spine-auto-dur를 밀리초로 읽는다. 주기의 단일 출처다. */
  readAutoMs() {
    const raw = getComputedStyle(this.el)
      .getPropertyValue("--spine-auto-dur")
      .trim();
    const n = parseFloat(raw);
    if (!Number.isFinite(n) || n <= 0) return AUTO_FALLBACK_MS;
    return raw.endsWith("ms") ? n : n * 1000;
  }

  /** 다음 슬라이드까지 ms를 세고 넘긴다. */
  scheduleAuto(ms) {
    clearTimeout(this.autoTimer);
    this.autoDeadline = Date.now() + ms;
    this.autoTimer = setTimeout(() => {
      const slides = Array.isArray(this.state.data) ? this.state.data : [];
      if (slides.length > 1) this.go((this.index + 1) % slides.length);
    }, ms);
  }

  /**
   * 자동 전환을 시작한다. 슬라이드가 2개 미만이면 넘길 곳이 없고,
   * 모션을 끈 사용자에게는 아예 걸지 않는다 — 이 경우 CSS가 활성 바를
   * 가득 찬 상태로 세워 두므로 현재 위치는 그대로 읽힌다.
   */
  /** 정지 사유 하나를 켜고 끈 뒤 실제 상태에 반영한다. */
  setAutoHold(key, on) {
    if (this.autoHold[key] === on) return;
    this.autoHold[key] = on;
    this.syncAuto();
  }

  /** 사유가 하나라도 남아 있으면 세우고, 다 없으면 이어서 간다. */
  syncAuto() {
    const held =
      this.autoHold.hover || this.autoHold.focus || this.autoHold.hidden;
    if (held) this.pauseAuto();
    else this.resumeAuto();
  }

  restartAuto() {
    const slides = Array.isArray(this.state.data) ? this.state.data : [];
    clearTimeout(this.autoTimer);
    this.autoTimer = null;
    this.autoPaused = false;
    if (slides.length < 2 || prefersReducedMotion()) return;
    this.autoMs = this.readAutoMs();
    this.scheduleAuto(this.autoMs);
    /* 뒤쪽 탭에서 열린 경우를 여기서 잡는다. visibilitychange는 말 그대로
       "바뀔 때"만 오므로, 처음부터 숨어 있던 문서에서는 한 번도 오지 않는다.
       바 위에 커서를 둔 채 슬라이드를 고른 경우도 함께 걸린다 — 다시
       굴리기 전에 남아 있는 사유를 반드시 확인해야 한다. */
    this.autoHold.hidden = document.hidden;
    this.syncAuto();
  }

  /* 세우고 이어 가는 것은 타이머뿐이다. 예전에는 여기서 바 줄에 .is-paused를
     붙여 차오르던 막대도 함께 세웠는데, 바에 더는 진행 애니메이션이 없어
     멈춰 보일 것도 없다. 정지 상태는 this.autoPaused 하나가 든다. */

  /** 남은 시간을 붙잡아 두고 세운다. */
  pauseAuto() {
    if (this.autoPaused || this.autoTimer === null) return;
    this.autoPaused = true;
    this.autoRemaining = Math.max(0, this.autoDeadline - Date.now());
    clearTimeout(this.autoTimer);
  }

  /** 멈춘 지점부터 이어서 간다. 처음부터 다시 세지 않는다. */
  resumeAuto() {
    if (!this.autoPaused) return;
    this.autoPaused = false;
    this.scheduleAuto(this.autoRemaining || this.autoMs);
  }

  stopAuto() {
    clearTimeout(this.autoTimer);
    this.autoTimer = null;
    this.autoPaused = false;
  }

  /**
   * 활성 챕터의 iframe에만 src를 걸어 재생하고, 나머지는 about:blank로 덮어
   * 문서를 통째로 내린다. 내려간 문서는 rAF와 타이머가 함께 멈추므로
   * 보이지 않는 데모가 백그라운드에서 도는 일이 없다.
   *
   * 활성 챕터도 항상 blank를 거쳐 다시 로드한다. 그래서 같은 챕터를 다시
   * 눌러도 이어보기가 아니라 처음부터 재생된다.
   */
  activateMedia(next) {
    const frames = this.el?.querySelectorAll("iframe[data-media]") || [];
    frames.forEach((frame, i) => {
      const url = frame.dataset.src;
      if (!url) return;

      // 아직 한 번도 로드하지 않았으면 src가 비어 있다.
      const loaded = frame.src && frame.src !== BLANK;

      if (i !== next) {
        if (loaded) frame.src = BLANK;
        return;
      }
      // 처음 여는 챕터는 곧바로 로드한다. 타이머를 거치지 않으므로
      // 백그라운드 탭에서 렌더돼도 재생이 누락되지 않는다.
      if (!loaded) {
        frame.src = url;
        return;
      }
      // 이미 그 데모가 올라가 있으면 blank를 한 번 거쳐야 문서가 새로
      // 로드되면서 처음부터 재생된다.
      frame.src = BLANK;
      setTimeout(() => {
        if (frame.isConnected) frame.src = url;
      }, 0);
    });
  }

  afterRender() {
    this.index = 0;
    this.activateMedia(0);
    this.bindToneScroll();
    this.bindAutoHold();
    this.restartAuto();
  }

  /**
   * 자동 전환을 멈추는 자리를 바 줄(.spine__chapters)에만 건다.
   *
   * 예전에는 .spine 섹션 전체에 걸어 뒀는데, 그 섹션은 "화면 한 장 +
   * 활주로"라 1920x950 화면에서 1905x1670 — 화면 높이의 176%다. 배너
   * 위 어디든 마우스가 놓이면 멈추니, 커서를 치워 두지 않는 한 사실상
   * 항상 멈춰 있었다. 바가 중간까지 차다가 서 버리는 게 그 때문이다.
   *
   * 멈출 자리는 "넘어가는 걸 붙잡고 직접 고르려는 곳"이면 된다. 바 줄이
   * 곧 그 조작부다. 키보드로 탭해 들어와도 같은 이유로 멈춰야 한다.
   *
   * 매 렌더마다 바 줄이 새로 만들어지므로 여기서 다시 건다. 예전 요소는
   * 통째로 버려지니 리스너를 따로 뗄 필요가 없다.
   */
  bindAutoHold() {
    const strap = this.el?.querySelector(".spine__chapters");
    this.autoHold.hover = false;
    this.autoHold.focus = false;
    if (!strap) return;
    strap.addEventListener("mouseenter", () => this.setAutoHold("hover", true));
    strap.addEventListener("mouseleave", () =>
      this.setAutoHold("hover", false),
    );
    strap.addEventListener("focusin", () => this.setAutoHold("focus", true));
    strap.addEventListener("focusout", () => this.setAutoHold("focus", false));
  }

  /**
   * 커서를 따라 판의 배경층이 아주 조금 밀린다.
   *
   * 판 안에는 글과 데모 화면만 있고 배경은 격자 한 겹뿐이라, 정지 화면일
   * 때 판이 종이처럼 평평하다. 배경만 커서 반대쪽으로 밀면 글과 배경이
   * 다른 거리에 있는 것처럼 읽혀 판에 두께가 생긴다.
   *
   * 좌표는 CSS 변수로만 넘기고 무엇을 움직일지는 CSS가 정한다 — 격자는
   * 조금, 글로우는 더 많이 미는 식으로 층마다 계수를 달리 줄 수 있다.
   *
   * 걸지 않는 경우:
   *   - 모션을 끈 사용자.
   *   - 마우스가 없는 기기. 터치에서는 hover가 한 번 붙었다가 그대로
   *     남아, 손을 뗀 자리에 배경이 밀린 채 굳는다.
   */
  bindParallax() {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const stage = this.el;
    let raf = null;
    let pending = null;

    const apply = () => {
      raf = null;
      if (!pending || !this.el) return;
      const frame = this.el.querySelector(".spine__frame");
      if (!frame) return;
      const r = frame.getBoundingClientRect();
      if (!r.width || !r.height) return;
      // 판 중심을 원점으로 한 -1..1. 판 밖에서도 값이 이어지도록 자르지 않고,
      // 대신 아래에서 범위를 묶는다.
      const nx = Math.max(
        -1,
        Math.min(1, (pending.x - (r.left + r.width / 2)) / (r.width / 2)),
      );
      const ny = Math.max(
        -1,
        Math.min(1, (pending.y - (r.top + r.height / 2)) / (r.height / 2)),
      );
      // 배경은 커서 반대쪽으로 민다. 같은 방향이면 배경이 커서에 붙어
      // 따라오는 것처럼 보여, 깊이가 아니라 지연으로 읽힌다.
      frame.style.setProperty("--spine-par-x", `${(-nx * PARALLAX_MAX).toFixed(1)}px`);
      frame.style.setProperty("--spine-par-y", `${(-ny * PARALLAX_MAX).toFixed(1)}px`);
    };

    const onMove = (ev) => {
      pending = { x: ev.clientX, y: ev.clientY };
      if (raf === null) raf = requestAnimationFrame(apply);
    };

    /* 판을 벗어나면 원위치로 돌린다. 마지막 좌표 그대로 두면 배너가
       비뚤어진 채 굳고, 다음에 들어올 때 그 자리에서 튄다. */
    const onLeave = () => {
      const frame = this.el?.querySelector(".spine__frame");
      if (!frame) return;
      frame.style.setProperty("--spine-par-x", "0px");
      frame.style.setProperty("--spine-par-y", "0px");
    };

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    this.cleanup(() => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    });
  }

  /**
   * 흰색 전환의 진행도(0 -> 1)를 스크롤 위치로 계산해 CSS 변수에 넘긴다.
   *
   * 무대가 화면에 붙어 있는 동안 소진되는 스크롤 거리(활주로)를 기준으로
   * 삼는다. 화면 크기와 무관하게 "활주로를 얼마나 썼는가" 하나로 정해지고,
   * 배너가 움직이지 않으므로 되먹임도 없다.
   */
  bindToneScroll() {
    if (this.onToneScroll) {
      window.removeEventListener("scroll", this.onToneScroll);
      window.removeEventListener("resize", this.onToneScroll);
    }

    const update = () => {
      this.toneRaf = null;
      if (!this.el) return;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const y = window.scrollY || window.pageYOffset || 0;

      /*
       * 진행도 = 활주로 소진율.
       *
       * 섹션 높이는 "무대 한 장(100svh) + 활주로"이고 무대는 sticky로
       * 붙어 있다. 그래서 섹션 상단이 화면 꼭대기에 닿은 뒤부터
       * (섹션 높이 - 화면 높이)만큼은 무대가 제자리에 머문다.
       * 그 거리를 얼마나 썼는지가 그대로 진행도다.
       *
       * 예전처럼 "배너 밑변이 화면 어디까지 올라왔나"로 재지 않는 이유:
       * 이제 배너는 아예 움직이지 않는다. 기준으로 삼을 이동이 없다.
       */
      const rect = this.el.getBoundingClientRect();
      const sectionTop = rect.top + y;
      const runway = Math.max(1, this.el.offsetHeight - vh);
      const consumed = (y - sectionTop) / runway;

      /*
       * 앞부분은 남색으로 붙잡아 둔다. 스크롤을 시작하자마자 밝아지면
       * 배너를 읽을 틈이 없다. 활주로의 앞 28%는 아무 일도 일어나지 않고,
       * 남은 72%에서 전환이 끝난다.
       */
      const hold = 0.35;
      const raw = Math.max(0, Math.min(1, (consumed - hold) / (1 - hold)));
      // 양 끝의 속도 불연속을 없앤다. 이동량 총합은 그대로다.
      const progress = smoothstep(raw);
      this.el.style.setProperty("--spine-light-rise", progress.toFixed(3));
    };

    this.onToneScroll = () => {
      if (this.toneRaf !== null) return;
      this.toneRaf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", this.onToneScroll, { passive: true });
    window.addEventListener("resize", this.onToneScroll);
    this.cleanup(() => {
      window.removeEventListener("scroll", this.onToneScroll);
      window.removeEventListener("resize", this.onToneScroll);
      if (this.toneRaf !== null) cancelAnimationFrame(this.toneRaf);
      this.toneRaf = null;
    });
  }

  onDestroy() {
    this.stopAuto();
    if (this.onVisibility) {
      document.removeEventListener("visibilitychange", this.onVisibility);
    }
    if (this.onToneScroll) {
      window.removeEventListener("scroll", this.onToneScroll);
      window.removeEventListener("resize", this.onToneScroll);
    }
    if (this.toneRaf !== null) cancelAnimationFrame(this.toneRaf);
  }
}
