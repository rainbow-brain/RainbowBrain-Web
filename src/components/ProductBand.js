/**
 * ProductBand — 자사 제품(유레카 GenAI) 전용 밴드. 테마 1에서 새로 생겼다.
 *
 * 기존 홈에는 자사 제품을 설명하는 자리가 프로모 배너 한 칸뿐이었다.
 * 이 밴드는 히어로 다음 두 번째 화면에 제품을 놓아, 회사의 기술이 무엇으로
 * 팔리는지 먼저 보이게 한다.
 *
 * 리소스 없음 — 내용은 props로 받는다(운영에서 CMS 연결 시
 * resource: 'product.eureka'로 바꾸고 setData만 붙이면 된다).
 * props: { eyebrow, title, description, features:[{name,note}],
 *          actions:[{label,href,variant}], image:{url,alt} }
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl, mediaFrame } from '../core/dom.js';

export class ProductBand extends Component {
  static tag = 'section';
  static root = 'band band--light band--pad product';

  isEmpty() { return false; } // props로만 그리므로 빈 데이터도 정상 상태다.

  template() {
    const p = this.props;

    const features = (p.features || []).map(f => `
      <li class="product__feature">
        <span class="product__feature-name">${esc(f.name)}</span>
        ${f.note ? html`<span class="product__feature-note">${f.note}</span>`.trim() : ''}
      </li>`).join('');

    const actions = (p.actions || []).map(a => html`
      <a class="btn ${a.variant === 'secondary' ? 'btn--secondary' : 'btn--primary'}"
         href="${escUrl(a.href) || '#'}">${a.label}</a>`).join('');

    return `
      <div class="container">
        <div class="product__body" data-reveal="left">
          ${p.eyebrow ? html`<p class="product__eyebrow">${p.eyebrow}</p>`.trim() : ''}
          <h2 class="product__title">${esc(p.title || '')}</h2>
          ${p.description ? html`<p class="t-body-md product__desc">${p.description}</p>`.trim() : ''}
          ${features ? `<ul class="product__features">${features}</ul>` : ''}
          ${actions ? `<div class="product__actions">${actions}</div>` : ''}
        </div>
        <div data-reveal="right" data-reveal-delay="120">
          ${mediaFrame(p.image, { ratio: '4x3', className: 'product__media' }).value}
        </div>
      </div>`;
  }
}
