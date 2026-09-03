/**
 * FeatureBanner — 좌우 끝까지 배경을 채우는 제품 배너.
 *
 * ProductBand(컨테이너 안 2단: 글 | 이미지)를 대체한다. 예전 배치는 오른쪽
 * 절반이 제품 화면 캡처 자리였는데 그 캡처가 아직 없어 스켈레톤이 그대로
 * 나갔다. 빈 상자를 절반이나 두느니 배경을 판 전체로 넓히고 글만 한쪽에
 * 모으는 편이 낫다 — 캡처가 준비되면 `image`를 채워 오른쪽에 되돌린다.
 *
 * 배경은 브랜드 그라데이션 위에 워드마크를 크게 눕힌 것이다. 이미지가 아니라
 * 글자라서 폭이 바뀌어도 잘리지 않고, 색은 토큰을 그대로 받는다.
 *
 * 리소스 없음 — 내용은 props로 받는다.
 * props: { eyebrow, title, description, watermark,
 *          features:[{name,note}], actions:[{label,href,variant}], image }
 */
import { Component } from "../core/component.js";
import { html, esc, escUrl } from "../core/dom.js";

export class FeatureBanner extends Component {
  static tag = "section";
  static root = "band feature-banner";

  isEmpty() {
    return false;
  }

  template() {
    const p = this.props;

    const features = (p.features || [])
      .map(
        (f) => `
      <li class="fb__chip">
        <span class="fb__chip-name">${esc(f.name)}</span>
        ${f.note ? html`<span class="fb__chip-note">${f.note}</span>`.trim() : ""}
      </li>`,
      )
      .join("");

    const actions = (p.actions || [])
      .map(
        (a) => html`
          <a
            class="btn ${a.variant === "secondary"
              ? "btn--ghost-dark"
              : "btn--invert"}"
            href="${escUrl(a.href) || "#"}"
            >${a.label}</a
          >`,
      )
      .join("");

    /* 워드마크는 장식이므로 aria-hidden. 스크린리더에는 제목 한 번만 읽힌다. */
    const watermark = p.watermark
      ? `<span class="fb__watermark" aria-hidden="true">${esc(p.watermark)}</span>`
      : "";

    const media = p.image?.url
      ? `<div class="fb__media" data-reveal="in" data-reveal-delay="160">
           <img src="${escUrl(p.image.url)}" alt="${esc(p.image.alt || "")}"
                loading="lazy" decoding="async">
         </div>`
      : "";

    return `
      ${watermark}
      <div class="container fb__inner ${media ? "fb__inner--split" : ""}">
        <div class="fb__body">
          ${p.eyebrow ? html`<p class="fb__eyebrow" data-reveal="up">${p.eyebrow}</p>`.trim() : ""}
          <h2 class="fb__title" data-reveal="up" data-reveal-delay="80">${esc(p.title || "")}</h2>
          ${p.description ? html`<p class="fb__desc" data-reveal="up" data-reveal-delay="140">${p.description}</p>`.trim() : ""}
          ${features ? `<ul class="fb__chips" data-reveal="in" data-reveal-delay="200">${features}</ul>` : ""}
          ${actions ? `<div class="fb__actions" data-reveal="up" data-reveal-delay="260">${actions}</div>` : ""}
        </div>
        ${media}
      </div>`;
  }
}
