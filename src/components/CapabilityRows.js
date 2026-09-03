/**
 * CapabilityRows — 테마 1의 역량 밴드. CapabilityBand(2x2 카드)를 대체한다.
 *
 * 왼쪽 라벨이 스티키로 고정되고, 오른쪽 번호 행이 스크롤에 따라 하나씩
 * 열린다. 활성 행만 항목을 2열로 펼치고 나머지는 한 줄 요약으로 접힌다.
 * 카드 테두리를 지우고 규칙선만 남겨 색을 더 줄인 형태다.
 *
 * 밴드 전체를 네이비로 칠하던 것을 흰 본문 위의 네이비 카드(.caps__panel)
 * 한 장으로 바꿨다. 네이비 면은 히어로 판에서 이미 한 번 썼기 때문에,
 * 여기서 또 전체 폭을 칠하면 페이지가 같은 무게의 다크 덩어리 둘로 갈린다.
 * 밴드 바닥에서 흰색으로 녹아내리던 그라데이션은 히어로 아래로 옮겨졌다.
 *
 * 리소스: 'capabilities.list' -> CapabilityGroup[]
 * props: { eyebrow, title, subtitle, hint }
 */
import { Component } from '../core/component.js';
import { html, esc } from '../core/dom.js';

export class CapabilityRows extends Component {
  static tag = 'section';
  static root = 'band band--light band--pad caps';

  constructor(props) {
    super(props);
    this.active = 0;
    this.io = null;
  }

  template(state) {
    const p = this.props;
    const groups = Array.isArray(state.data) ? state.data : [];

    const aside = `
      <div class="caps__aside">
        ${p.eyebrow ? html`<p class="caps__eyebrow">${p.eyebrow}</p>`.trim() : ''}
        <h2 class="t-heading-1">${esc(p.title || '')}</h2>
        ${p.subtitle ? html`<p class="t-body-md caps__sub">${p.subtitle}</p>`.trim() : ''}
        <div class="caps__ticks" data-ticks>
          ${groups.map((_, i) => `<span class="caps__tick ${i === 0 ? 'is-active' : ''}"></span>`).join('')}
        </div>
        ${p.hint ? html`<p class="caps__hint">${p.hint}</p>`.trim() : ''}
      </div>`;

    if (state.status === 'loading') {
      return `<div class="container"><div class="caps__panel">${aside}<div class="caps__rows">
        ${`<div class="skeleton" style="height:120px;margin-block:var(--space-lg)"></div>`.repeat(4)}
      </div></div></div>`;
    }
    if (!groups.length) {
      return `<div class="container"><div class="caps__panel">${aside}<div class="empty-state t-body-md">등록된 서비스가 없습니다.</div></div></div>`;
    }

    const rows = groups.map((g, i) => {
      const items = g.items || [];
      return `
        <div class="caps__row ${i === 0 ? 'is-active' : ''}" data-row="${i}">
          <div class="caps__row-head">
            <span class="caps__row-no">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="caps__row-title">${esc(g.title)}</h3>
          </div>
          <div>
            <ul class="caps__items">
              ${items.map(it => `<li class="caps__item">${esc(it)}</li>`).join('')}
            </ul>
            <p class="t-body-md caps__summary">${items.map(esc).join(' · ')}</p>
          </div>
        </div>`;
    }).join('');

    return `<div class="container"><div class="caps__panel">${aside}<div class="caps__rows">${rows}</div></div></div>`;
  }

  /** 화면 중앙에 가장 가까운 행을 활성으로 만든다. */
  afterRender() {
    this.io?.disconnect();
    const rows = Array.from(this.el.querySelectorAll('[data-row]'));
    if (!rows.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof window.IntersectionObserver !== 'function') {
      rows.forEach(r => r.classList.add('is-active'));
      return;
    }

    this.io = new IntersectionObserver((entries) => {
      // 뷰포트 중앙 밴드(-40%/-40%)에 들어온 행이 활성이 된다.
      const hit = entries.find(e => e.isIntersecting);
      if (!hit) return;
      this.setActive(Number(hit.target.dataset.row));
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    rows.forEach(r => this.io.observe(r));
    this.cleanup(() => this.io?.disconnect());
  }

  setActive(i) {
    if (i === this.active) return;
    this.active = i;
    this.el.querySelectorAll('[data-row]').forEach((r, n) => r.classList.toggle('is-active', n === i));
    this.el.querySelectorAll('[data-ticks] > span').forEach((t, n) => t.classList.toggle('is-active', n === i));
  }

  onDestroy() {
    this.io?.disconnect();
  }
}
