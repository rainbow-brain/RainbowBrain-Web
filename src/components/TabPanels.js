/**
 * TabPanels — 탭 줄 하나와 그 아래 패널 한 장.
 *
 * ChallengeGrid(4열 동시 노출)를 홈에서 대체한다. 넷을 나란히 깔면 문단
 * 넷이 한 화면에 놓여 어느 것도 읽히지 않는다 — 실제로는 "우리 얘기다"
 * 싶은 하나만 읽는 자리다. 탭으로 바꾸면 제목 넷은 여전히 한눈에 들어오고,
 * 본문은 고른 하나만 큰 활자로 읽힌다.
 *
 * 전환은 패널을 갈아 끼우지 않고 미리 그려 둔 패널의 표시만 바꾼다. 매번
 * 새로 그리면 탭을 누를 때마다 리빌 애니메이션이 다시 돌아 글이 깜빡인다.
 *
 * 키보드: 좌우 화살표로 탭을 옮기고 Home/End로 양 끝으로 간다(WAI-ARIA
 * 탭 패턴). 활성 탭만 tabindex 0을 갖는 로빙 방식이라, 탭 키 한 번으로
 * 줄 전체를 건너뛸 수 있다.
 *
 * 리소스: Challenge[] (또는 { id, title, description }[] 형태면 무엇이든)
 * props: { eyebrow, title, tone: 'light'|'soft' }
 */
import { Component } from "../core/component.js";
import { html, esc } from "../core/dom.js";

export class TabPanels extends Component {
  static tag = "section";
  static root = "band band--soft band--pad tabs";

  constructor(props) {
    super(props);
    this.active = 0;
  }

  template(state) {
    const p = this.props;
    const head = `
      <header class="tabs__head">
        ${p.eyebrow ? html`<p class="tabs__eyebrow" data-reveal="up">${p.eyebrow}</p>`.trim() : ""}
        <h2 class="tabs__title" data-reveal="up" data-reveal-delay="80">${esc(p.title || "")}</h2>
      </header>`;

    if (state.status === "loading") {
      return `<div class="container">${head}
        <div class="skeleton" style="height:52px;width:min(560px,100%)"></div>
        <div class="skeleton" style="height:180px;margin-top:var(--space-xxl)"></div></div>`;
    }

    const items = Array.isArray(state.data) ? state.data : [];
    if (!items.length) {
      return `<div class="container">${head}<div class="empty-state t-body-md">등록된 항목이 없습니다.</div></div>`;
    }
    // 데이터가 줄었을 때 활성 인덱스가 범위를 벗어난 채 남지 않게 한다.
    if (this.active >= items.length) this.active = 0;

    const id = (n, kind) => `tabs-${this.props.id || "x"}-${kind}-${n}`;

    const tablist = items
      .map(
        (c, i) => `
      <button type="button" role="tab" class="tabs__tab ${i === this.active ? "is-active" : ""}"
              id="${id(i, "tab")}" aria-controls="${id(i, "panel")}"
              aria-selected="${i === this.active}" tabindex="${i === this.active ? "0" : "-1"}"
              data-tab="${i}">
        <span class="tabs__tab-no">${String(i + 1).padStart(2, "0")}</span>
        <span class="tabs__tab-label">${esc(c.title)}</span>
      </button>`,
      )
      .join("");

    const panels = items
      .map(
        (c, i) => `
      <div role="tabpanel" class="tabs__panel ${i === this.active ? "is-active" : ""}"
           id="${id(i, "panel")}" aria-labelledby="${id(i, "tab")}"
           ${i === this.active ? "" : "hidden"} tabindex="0">
        <p class="tabs__panel-text">${esc(c.description || "")}</p>
      </div>`,
      )
      .join("");

    return `
      <div class="container">
        ${head}
        <div class="tabs__strip" role="tablist" aria-label="${esc(this.props.title || "")}"
             data-reveal="in" data-reveal-delay="120">${tablist}</div>
        <div class="tabs__panels" data-reveal="in" data-reveal-delay="200">${panels}</div>
      </div>`;
  }

  bind() {
    this.on("click", "[data-tab]", (_e, btn) =>
      this.select(Number(btn.dataset.tab)),
    );
    this.on("keydown", "[role=tablist]", (ev) => this.onKey(ev));
  }

  onKey(ev) {
    const tabs = Array.from(this.el.querySelectorAll("[data-tab]"));
    if (!tabs.length) return;
    const last = tabs.length - 1;
    const map = {
      ArrowRight: this.active === last ? 0 : this.active + 1,
      ArrowLeft: this.active === 0 ? last : this.active - 1,
      Home: 0,
      End: last,
    };
    const next = map[ev.key];
    if (next === undefined) return;
    ev.preventDefault();
    this.select(next);
    // 화살표로 옮긴 탭에는 초점도 따라가야 다음 화살표가 이어서 먹는다.
    this.el.querySelector(`[data-tab="${next}"]`)?.focus();
  }

  select(next) {
    if (next === this.active || Number.isNaN(next)) return;
    this.active = next;
    this.el.querySelectorAll("[data-tab]").forEach((t, i) => {
      const on = i === next;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    this.el.querySelectorAll(".tabs__panel").forEach((pnl, i) => {
      const on = i === next;
      pnl.classList.toggle("is-active", on);
      pnl.hidden = !on;
    });
  }
}
