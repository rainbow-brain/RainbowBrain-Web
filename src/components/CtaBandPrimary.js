/**
 * CtaBandPrimary — 페이지에 단 하나뿐인 전체 폭 블루 밴드.
 * DESIGN.md > Band Hierarchy: 페이지당 최대 1개, 바이올렛 `hero-band`와는
 * 같은 페이지에 두지 않는다. 드물게 쓰기 때문에 CTA로 읽힌다.
 * 블루 위 블루는 묻히므로 버튼은 흰 배경 + 파란 글자로 반전한다.
 *
 * props.align === 'right'이면 좌우 2단을 접고 내용을 오른쪽 560px 열에만
 * 모은다. 앞뒤 밴드가 전부 좌측 정렬이라 축이 하나로 이어지는데, 한 곳에서
 * 축을 반대편으로 옮기면 그 밴드만 페이지 흐름에서 떨어져 나와 "여기서
 * 무언가 달라진다"고 읽힌다. 페이지에 한 번만 쓴다.
 *
 * 리소스: 'cta.report' -> ReportCta | null
 * props: { align: 'right' }
 */
import { Component } from '../core/component.js';
import { html, join, esc, escUrl } from '../core/dom.js';

export class CtaBandPrimary extends Component {
  static tag = 'section';
  static root = 'band band--primary band--pad-sm cta-report';

  get aside() { return this.props.align === 'right'; }

  afterRender() {
    this.el.classList.toggle('cta-report--aside', this.aside);
  }

  template(state) {
    if (state.status === 'loading') {
      return `<div class="container"><div class="cta-primary__inner">
        <div class="skeleton" style="aspect-ratio:16/10;border-radius:var(--radius-lg);background:rgba(255,255,255,.16)"></div>
        <div class="stack"><div class="skeleton" style="height:36px;width:70%;background:rgba(255,255,255,.16)"></div>
        <div class="skeleton" style="height:18px;background:rgba(255,255,255,.16)"></div></div>
      </div></div>`;
    }

    const d = state.data;
    if (!d || !d.title) { this.el?.classList.add('is-hidden'); return ''; }
    this.el?.classList.remove('is-hidden');

    const actions = (d.actions || []).map(a => html`
      <a class="btn ${a.variant === 'ghost' ? 'btn--ghost-dark' : 'btn--invert'}" href="${escUrl(a.href) || '#'}">${a.label}</a>`);

    /* escUrl은 data:/javascript: 스킴을 빈 문자열로 돌려보낸다. 그 값을 그대로
       src에 넣으면 빈 src가 되어 브라우저가 깨진 이미지 아이콘을 그리고,
       일부 브라우저는 현재 문서를 이미지로 다시 받아 온다. 걸러진 경우에는
       <img> 자체를 만들지 않는다. */
    const cover = escUrl(d.image?.url);
    const media = cover
      ? `<div class="cta-primary__media" data-reveal="in">
           <img src="${cover}" alt="${esc(d.image.alt || '')}" loading="lazy" decoding="async">
         </div>`
      : '';

    const body = `
      <div class="cta-primary__body" data-reveal="up" data-reveal-delay="120">
        ${d.eyebrow ? html`<p class="t-eyebrow">${d.eyebrow}</p>`.trim() : ''}
        <h2 class="t-heading-1">${esc(d.title)}</h2>
        ${d.description ? html`<p class="t-body-sm cta-primary__desc">${d.description}</p>`.trim() : ''}
        ${actions.length ? `<div class="cta-primary__actions">${join(actions).value}</div>` : ''}
      </div>`;

    // 우측 정렬 변형에서는 표지가 제목 위 작은 판으로 올라간다. 2단을 접었으니
    // 표지가 차지하던 왼쪽 절반이 없어졌고, 그 자리에 그대로 두면 560px 열
    // 전체를 표지가 먹는다.
    return `
      <div class="container">
        <div class="cta-primary__inner">${this.aside ? `${media}${body}` : `${media || '<div class="cta-primary__media"></div>'}${body}`}</div>
      </div>`;
  }
}
