/**
 * CtaBandLight — 푸터 바로 위에 오는 마무리 흰 밴드.
 * 앞의 블루 `cta-report` 밴드와 뒤의 네이비 푸터 사이를 흰 면으로 벌려,
 * 남색과 네이비가 맞닿을 때 생기는 1.28:1 대비 문제를 피한다.
 * (근거: layout.css > 밴드 섹션 주석)
 *
 * 리소스: 'cta.closing' -> ClosingCta | null
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl } from '../core/dom.js';

export class CtaBandLight extends Component {
  static tag = 'section';
  static root = 'band band--light band--pad cta-closing';

  template(state) {
    if (state.status === 'loading') {
      return `<div class="container"><div class="cta-closing__inner">
        <div class="skeleton" style="height:40px;width:min(560px,80%)"></div>
        <div class="skeleton" style="height:44px;width:180px;border-radius:var(--radius-full)"></div>
      </div></div>`;
    }

    const d = state.data;
    // 데이터가 없으면 섹션 자체를 감춘다. 껍데기만 남으면 130px 상하 여백이
    // 그대로 남아 페이지 세로 리듬이 끊긴다.
    if (!d || !d.title) { this.el?.classList.add('is-hidden'); return ''; }
    this.el?.classList.remove('is-hidden');

    return `
      <div class="container">
        <div class="cta-closing__inner">
          <h2 class="t-heading-1 cta-closing__title" data-reveal="up">${esc(d.title)}</h2>
          ${d.description ? html`<p class="t-body-md cta-closing__desc" data-reveal="up" data-reveal-delay="80">${d.description}</p>`.trim() : ''}
          ${d.action ? `<a class="btn btn--primary btn--lg" data-reveal="up" data-reveal-delay="160"
              href="${escUrl(d.action.href) || '#'}">${esc(d.action.label)}</a>` : ''}
        </div>
      </div>`;
  }
}
