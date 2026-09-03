/**
 * FloatRail — 우측에 고정되는 유틸리티 레일 + 맨 위로 버튼.
 * 네이비·블루·화이트 밴드 위를 모두 지나가므로, 배경에 그대로 얹지 않고
 * 자체 흰색 칩을 두른다 (DESIGN.md > float-rail).
 * 태블릿 이하에서는 강조 버튼과 맨 위로 버튼만 남긴다.
 *
 * 리소스: 'rail.items' -> RailItem[]
 */
import { Component } from '../core/component.js';
import { esc, escUrl } from '../core/dom.js';

const ICON_TOP = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 19V6M5 12l7-7 7 7"/></svg>`;

export class FloatRail extends Component {
  static tag = 'aside';
  static root = 'float-rail';

  isEmpty() { return false; }

  template(state) {
    const items = Array.isArray(state.data) ? state.data : [];

    const links = items.map(i => `
      <a class="float-rail__btn ${i.accent ? 'float-rail__btn--accent' : ''} ${i.collapsible !== false ? 'float-rail__btn--collapsible' : ''}"
         href="${escUrl(i.href) || '#'}" title="${esc(i.label)}">${esc(i.label)}</a>`).join('');

    return `
      ${links}
      <button class="float-rail__btn" type="button" data-action="top" aria-label="맨 위로">${ICON_TOP}</button>`;
  }

  bind() {
    this.on('click', '[data-action="top"]', () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    // 히어로 영역을 벗어나기 전까지는 레일을 숨긴다.
    const onScroll = () => {
      if (!this.el) return;
      const past = window.scrollY > window.innerHeight * 0.5;
      this.el.style.opacity = past ? '1' : '0';
      this.el.style.pointerEvents = past ? 'auto' : 'none';
    };
    this.el.style.transition = 'opacity var(--dur-base) var(--ease-out)';
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    this.cleanup(() => window.removeEventListener('scroll', onScroll));
  }

  afterRender() { this.el?.style.setProperty('transition', 'opacity var(--dur-base) var(--ease-out)'); }
}
