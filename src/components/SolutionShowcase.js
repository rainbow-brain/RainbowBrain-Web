/**
 * SolutionShowcase — 솔루션 페이지 본문. 제품 하나당 한 판씩 좌우 교대 배치.
 *
 * 홈의 ProductBand는 유레카 GenAI 하나만 다루므로 고정 배치로 충분했다.
 * 여기서는 제품이 여럿이라 같은 배치를 반복하면 스크롤 내내 같은 화면이
 * 지나간다. 홀수/짝수 판의 좌우를 뒤집어 리듬을 만들고, 첫 판만
 * `is-lead`로 크게 잡아 대표 제품이 먼저 읽히게 했다.
 *
 * 리소스: 'solutions.list' -> [{
 *   id, eyebrow?, name, tagline?, description?,
 *   features?: [{ name, note? }],
 *   specs?:    [{ label, value }],
 *   badges?:   string[],
 *   image?: Image, actions?: Action[]
 * }]
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl, mediaFrame } from '../core/dom.js';

export class SolutionShowcase extends Component {
  static tag = 'section';
  static root = 'band band--light band--pad solutions';

  template(state) {
    const p = this.props;
    const head = `
      <header class="head-left" data-reveal="up">
        ${p.eyebrow ? html`<p class="head-left__eyebrow">${p.eyebrow}</p>`.trim() : ''}
        <h2 class="head-left__title">${esc(p.title || '')}</h2>
        ${p.subtitle ? html`<p class="t-body-md head-left__sub">${p.subtitle}</p>`.trim() : ''}
      </header>`;

    if (state.status === 'loading') {
      return `<div class="container">${head}
        ${`<div class="skeleton" style="height:320px;margin-bottom:32px;border-radius:var(--radius-xl)"></div>`.repeat(2)}</div>`;
    }

    const items = Array.isArray(state.data) ? state.data : [];
    if (!items.length) {
      return `<div class="container">${head}
        <div class="empty-state t-body-md">등록된 솔루션이 없습니다.</div></div>`;
    }

    const blocks = items.map((s, i) => {
      const flipped = i % 2 === 1;
      const features = (s.features || []).map(f => `
        <li class="solution__feature">
          <span class="solution__feature-name">${esc(f.name)}</span>
          ${f.note ? html`<span class="solution__feature-note">${f.note}</span>`.trim() : ''}
        </li>`).join('');
      const specs = (s.specs || []).map(sp => `
        <div class="solution__spec">
          <dt class="solution__spec-label">${esc(sp.label)}</dt>
          <dd class="solution__spec-value">${esc(sp.value)}</dd>
        </div>`).join('');
      const badges = (s.badges || []).map(b => `<span class="chip chip--alt">${esc(b)}</span>`).join('');
      const actions = (s.actions || []).map(a => html`
        <a class="btn ${a.variant === 'secondary' ? 'btn--secondary' : 'btn--primary'}"
           href="${escUrl(a.href) || '#'}">${a.label}</a>`).join('');

      return `
        <article class="solution ${flipped ? 'is-flipped' : ''} ${i === 0 ? 'is-lead' : ''}"
                 id="${esc(s.id || `solution-${i + 1}`)}">
          <div class="solution__body" data-reveal="${flipped ? 'right' : 'left'}">
            ${s.eyebrow ? html`<p class="solution__eyebrow">${s.eyebrow}</p>`.trim() : ''}
            <h3 class="solution__name">${esc(s.name)}</h3>
            ${s.tagline ? html`<p class="solution__tagline">${s.tagline}</p>`.trim() : ''}
            ${s.description ? html`<p class="solution__desc">${s.description}</p>`.trim() : ''}
            ${badges ? `<div class="solution__badges">${badges}</div>` : ''}
            ${features ? `<ul class="solution__features">${features}</ul>` : ''}
            ${specs ? `<dl class="solution__specs">${specs}</dl>` : ''}
            ${actions ? `<div class="solution__actions">${actions}</div>` : ''}
          </div>
          <div class="solution__media" data-reveal="${flipped ? 'left' : 'right'}" data-reveal-delay="120">
            ${mediaFrame(s.image, { ratio: '4x3' }).value}
          </div>
        </article>`;
    }).join('');

    return `<div class="container">${head}<div class="solutions__list">${blocks}</div></div>`;
  }
}
