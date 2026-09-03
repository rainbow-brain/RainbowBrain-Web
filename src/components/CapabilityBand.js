/**
 * CapabilityBand — 화면 전체 폭의 네이비 서비스 밴드.
 * 배경은 좌우 끝까지 채우고, 내용은 컨테이너 안에 유지한다.
 * 네이비 위에서는 그림자가 통하지 않아 카드는 투명 배경 + 반투명 흰 테두리로
 * 처리한다 (DESIGN.md > Elevation & Depth).
 *
 * 리소스: 'capabilities.list' -> CapabilityGroup[]
 */
import { Component } from '../core/component.js';
import { html, esc } from '../core/dom.js';

export class CapabilityBand extends Component {
  static tag = 'section';
  static root = 'band band--dark band--pad';

  template(state) {
    const p = this.props;
    const head = `
      <header class="section-head">
        <h2 class="t-heading-1 section-head__title t-on-dark" data-reveal="up">${esc(p.title || '')}</h2>
        ${p.subtitle ? html`<p class="t-body-md section-head__sub" data-reveal="up" data-reveal-delay="80">${p.subtitle}</p>`.trim() : ''}
      </header>`;

    if (state.status === 'loading') {
      return `<div class="container">${head}<div class="grid grid--2">
        ${`<div class="skeleton" style="height:200px;border-radius:var(--radius-lg)"></div>`.repeat(4)}
      </div></div>`;
    }

    const groups = Array.isArray(state.data) ? state.data : [];
    if (!groups.length) {
      return `<div class="container">${head}<div class="empty-state t-body-md">등록된 서비스가 없습니다.</div></div>`;
    }

    const cards = groups.map((g, i) => `
      <article class="dark-card" data-reveal="${i % 2 ? 'right' : 'left'}">
        <h3 class="t-heading-3 dark-card__title">${esc(g.title)}</h3>
        <ul class="dark-card__list">
          ${(g.items || []).map(item => `<li class="dark-card__item">${esc(item)}</li>`).join('')}
        </ul>
      </article>`).join('');

    return `<div class="container">${head}<div class="grid grid--2" data-reveal-stagger="90">${cards}</div></div>`;
  }
}
