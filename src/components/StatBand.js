/**
 * StatBand — 그레이 구획 밴드 위의 성과 지표.
 * 카드들이 나란히 정렬되도록 숫자는 고정폭 서체를 쓰고, 모든 카드에
 * 출처를 함께 표기한다 (DESIGN.md > stat-card).
 *
 * 리소스: 'stats.list' -> { headline, note, items: StatCard[] }
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl } from '../core/dom.js';

export class StatBand extends Component {
  static tag = 'section';
  static root = 'band band--soft band--pad';

  isEmpty(data) { return !data || !(data.items || []).length; }

  template(state) {
    const p = this.props;
    const d = state.data || {};
    const head = `
      <header class="section-head">
        <h2 class="t-heading-1 section-head__title" data-reveal="up">${esc(d.headline || p.title || '')}</h2>
        ${(d.note || p.subtitle) ? html`<p class="t-body-md section-head__sub" data-reveal="up" data-reveal-delay="80">${d.note || p.subtitle}</p>`.trim() : ''}
      </header>`;

    if (state.status === 'loading') {
      return `<div class="container">${head}<div class="grid grid--3">
        ${`<div class="skeleton" style="height:230px;border-radius:var(--radius-lg)"></div>`.repeat(3)}
      </div></div>`;
    }
    if (state.status === 'empty') {
      return `<div class="container">${head}<div class="empty-state t-body-md">등록된 성과 지표가 없습니다.</div></div>`;
    }

    const cards = (d.items || []).map((s, i) => `
      <article class="stat-card" data-reveal="up">
        <p class="t-body-sm stat-card__label">${esc(s.label || '')}</p>
        <div class="stat-card__figures">
          ${(s.figures || []).map(f => `
            <div class="stat-card__figure">
              <span class="t-stat stat-card__value">${esc(f.value)}</span>
              ${f.caption ? `<span class="t-caption stat-card__caption">${esc(f.caption)}</span>` : ''}
            </div>`).join('')}
        </div>
        ${s.description ? html`<p class="stat-card__desc">${s.description}</p>`.trim() : ''}
        ${s.source ? html`<p class="t-caption stat-card__source">출처 · ${s.source}</p>`.trim() : ''}
      </article>`).join('');

    const more = p.moreHref
      ? `<div class="insight-section__foot" data-reveal="up">
           <a class="btn btn--secondary" href="${escUrl(p.moreHref)}">${esc(p.moreLabel || '더 보기')}</a>
         </div>`
      : '';

    return `<div class="container">${head}<div class="grid grid--3" data-reveal-stagger="120">${cards}</div>${more}</div>`;
  }
}
