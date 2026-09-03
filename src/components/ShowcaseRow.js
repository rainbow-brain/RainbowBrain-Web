/**
 * ShowcaseRow — 사례 세 건을 같은 크기 카드로 세운 줄.
 *
 * InsightsSection의 'feature' 변형(대표 1 + 텍스트 목록 5)을 홈에서 대체한다.
 * 대표-목록 구조는 "이 하나가 가장 중요하고 나머지는 덤"이라고 말하는데,
 * 홈에서 사례는 업종을 훑어보라고 놓는 자리다. 셋을 같은 크기로 세우면
 * 무엇을 먼저 볼지 읽는 사람이 고른다. 나머지는 "전체 보기"가 받는다.
 *
 * 카드 아래 라벨 띠는 흰 본문 위에서 카드 세 장을 하나의 줄로 묶는 장치다.
 * 이미지가 저마다 다른 색이어도 띠가 같은 색이면 셋이 한 벌로 읽힌다.
 *
 * 리소스: 'cases.list' -> Article[]
 * props: { eyebrow, title, count, moreHref, moreLabel }
 */
import { Component } from "../core/component.js";
import { html, esc, escUrl, mediaFrame, formatDate } from "../core/dom.js";
import { sortByNewest } from "../data/schema.js";

export class ShowcaseRow extends Component {
  static tag = "section";
  static root = "band band--light band--pad showcase";

  template(state) {
    const p = this.props;

    const head = `
      <header class="showcase__head">
        <div>
          ${p.eyebrow ? html`<p class="showcase__eyebrow" data-reveal="up">${p.eyebrow}</p>`.trim() : ""}
          <h2 class="showcase__title" data-reveal="up" data-reveal-delay="80">${esc(p.title || "")}</h2>
        </div>
        ${
          p.moreHref
            ? `<a class="showcase__more" href="${escUrl(p.moreHref)}" data-reveal="up" data-reveal-delay="140">${esc(p.moreLabel || "전체 보기")} →</a>`
            : ""
        }
      </header>`;

    if (state.status === "loading") {
      return `<div class="container">${head}<div class="showcase__grid">
        ${`<div class="skeleton" style="height:420px;border-radius:var(--radius-lg)"></div>`.repeat(3)}
      </div></div>`;
    }

    const items = sortByNewest(
      Array.isArray(state.data) ? state.data : [],
    ).slice(0, p.count || 3);

    if (!items.length) {
      return `<div class="container">${head}<div class="empty-state t-body-md">등록된 사례가 없습니다.</div></div>`;
    }

    const cards = items
      .map(
        (a, i) => `
      <a class="case-card" href="${escUrl(a.href) || "#"}"
         data-reveal="in" data-reveal-delay="${i * 90}">
        <div class="case-card__media">
          ${mediaFrame(a.image, { ratio: "4x3" }).value}
          ${a.category ? `<span class="case-card__cat">${esc(a.category)}</span>` : ""}
        </div>
        <span class="case-card__bar">${esc(a.title)}</span>
        ${a.excerpt ? html`<span class="case-card__excerpt">${a.excerpt}</span>`.trim() : ""}
        ${a.publishedAt ? `<span class="case-card__date">${formatDate(a.publishedAt)}</span>` : ""}
      </a>`,
      )
      .join("");

    return `<div class="container">${head}<div class="showcase__grid">${cards}</div></div>`;
  }
}
