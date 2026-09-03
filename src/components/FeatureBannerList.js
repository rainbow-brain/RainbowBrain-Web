/**
 * FeatureBannerList — 기존 3슬라이드 캐러셀을 대체한 프로모 배너.
 *
 * 요청에 따라 가로 슬라이더가 아니라 세로로 쌓는다.
 * 각 배너는 바이올렛/블루 방사형 강조가 들어간 네이비 블록이다
 * (블록 안의 강조일 뿐 색상 밴드가 아니므로 DESIGN.md > Band Hierarchy의
 * 밴드 개수 제한에는 영향이 없다).
 *
 * 타이포 보정 (요청 사항): 제목 — 예: "필수가 된 AI 기술 LLM" — 은
 * heading-1 / weight 800으로, 그 아래 보조 문장은 body-sm으로 낮춘다.
 * 기존 배너는 두 줄의 무게가 같아서 메시지가 전달되지 않았다.
 *
 * 리소스: 'promotions.list' -> Promotion[]
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl } from '../core/dom.js';

export class FeatureBannerList extends Component {
  static tag = 'section';
  static root = 'band band--light band--pad-sm';

  template(state) {
    const p = this.props;
    const head = p.title ? `
      <header class="section-head">
        <h2 class="t-heading-1 section-head__title" data-reveal="up">${esc(p.title)}</h2>
        ${p.subtitle ? html`<p class="t-body-md section-head__sub" data-reveal="up" data-reveal-delay="80">${p.subtitle}</p>`.trim() : ''}
      </header>` : '';

    if (state.status === 'loading') {
      return `<div class="container">${head}<div class="feature-list">
        ${`<div class="skeleton" style="height:180px;border-radius:var(--radius-xl)"></div>`.repeat(2)}
      </div></div>`;
    }

    const items = Array.isArray(state.data) ? state.data : [];
    if (!items.length) return '';

    const banners = items.map((item, i) => {
      // 강조 색과 텍스트 위치를 번갈아 배치해, 세로로 쌓아도 리듬이 생기고
      // 어느 것도 색상 밴드처럼 보이지 않도록 한다.
      const accent = item.accent === 'violet' ? 'violet'
                   : item.accent === 'blue' ? 'blue'
                   : (i % 2 ? 'violet' : 'blue');
      const reverse = i % 2 === 1;
      const dir = reverse ? 'right' : 'left';

      return `
        <article class="feature-banner feature-banner--${accent} ${reverse ? 'feature-banner--reverse' : ''}"
                 data-reveal="${dir}">
          <div class="feature-banner__body">
            ${item.eyebrow ? html`<p class="t-eyebrow feature-banner__eyebrow">${item.eyebrow}</p>`.trim() : ''}
            <h3 class="t-heading-1 feature-banner__title">${esc(item.title)}</h3>
            ${item.description ? html`<p class="t-body-sm feature-banner__desc">${item.description}</p>`.trim() : ''}
          </div>
          ${item.action ? `
            <div class="feature-banner__action">
              <a class="btn btn--invert" href="${escUrl(item.action.href) || '#'}">${esc(item.action.label)}</a>
            </div>` : ''}
        </article>`;
    }).join('');

    return `<div class="container">${head}<div class="feature-list">${banners}</div></div>`;
  }
}
