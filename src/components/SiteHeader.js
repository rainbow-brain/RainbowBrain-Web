/**
 * SiteHeader — 상단 고정 네이비 바 (데스크톱 60px / 모바일 56px) + 메가 메뉴.
 * 현재 rbrain.co.kr 헤더보다 의도적으로 얇게 잡았다.
 *
 * ── 메가 메뉴 ───────────────────────────────────────────────────────────────
 * 주 메뉴에 마우스를 올리면 바가 네이비에서 흰색으로 뒤집히고, 바 아래로
 * 그 메뉴의 하위 항목 패널이 열린다. 패널도 같은 흰 면이라 바와 패널이
 * 한 덩어리로 읽힌다.
 *
 * 열림 상태는 `:hover`가 아니라 JS가 붙이는 `.is-active`로 관리한다.
 * CSS :hover만으로는 마우스가 바에서 패널로 내려가는 순간 하이라이트가
 * 꺼진다 — 패널을 훑는 동안에도 어느 메뉴를 보고 있는지 남아 있어야 한다.
 *
 * 하위 항목이 없는 메뉴는 패널을 열지 않는다. 빈 흰 판이 떨어지면
 * 무언가 실패한 것처럼 보인다.
 *
 * 리소스: 'nav.menu' -> { items: NavItem[], actions: Action[] }
 *   NavItem { label, href, current?, children?: { label, href, note? }[] }
 */
import { Component } from '../core/component.js';
import { html, raw, join, esc, escUrl } from '../core/dom.js';

const ICON_SEARCH = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
const ICON_MENU   = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`;
const ICON_CLOSE  = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`;

export class SiteHeader extends Component {
  static tag = 'header';
  static root = 'site-header';

  constructor(props) {
    super(props);
    this.open = -1;   // 열려 있는 메뉴의 인덱스. -1이면 닫힘.
  }

  isEmpty() { return false; } // 데이터 유무와 관계없이 바는 항상 렌더링

  template(state) {
    const { items = [], actions = [] } = state.data || {};
    const brand = this.props.brand || 'RAINBOW BRAIN';

    const nav = items.map((item, i) => {
      const kids = item.children || [];
      return html`
      <a class="site-header__link" href="${escUrl(item.href) || '#'}"
         data-menu="${String(i)}"
         ${raw(kids.length ? 'aria-haspopup="true" aria-expanded="false"' : '')}
         ${raw(item.current ? 'aria-current="page"' : '')}>${item.label}</a>
    `;
    });

    const ctas = actions.map(a => html`
      <a class="btn btn--sm ${raw(a.variant === 'primary' ? 'btn--invert' : 'btn--ghost-dark')}"
         href="${escUrl(a.href) || '#'}">${a.label}</a>
    `);

    // 하위 항목이 있는 메뉴만 패널을 만든다. 인덱스는 주 메뉴와 맞춘다.
    const panels = items.map((item, i) => {
      const kids = item.children || [];
      if (!kids.length) return '';
      return `
        <div class="site-header__sub" data-sub="${i}" aria-label="${esc(item.label)} 하위 메뉴">
          <p class="site-header__sub-title">${esc(item.label)}</p>
          <ul class="site-header__sub-grid">
            ${kids.map(k => `
              <li>
                <a class="site-header__sub-link" href="${escUrl(k.href) || '#'}">
                  <span class="site-header__sub-label">${esc(k.label)}</span>
                  ${k.note ? html`<span class="site-header__sub-note">${k.note}</span>`.trim() : ''}
                </a>
              </li>`).join('')}
          </ul>
        </div>`;
    }).join('');

    const drawerNav = items.map(item => {
      const kids = item.children || [];
      return `
        <div class="drawer__group">
          <a class="drawer__link" href="${escUrl(item.href) || '#'}">${esc(item.label)}</a>
          ${kids.length ? `<ul class="drawer__sub">
            ${kids.map(k => `<li><a class="drawer__sub-link" href="${escUrl(k.href) || '#'}">${esc(k.label)}</a></li>`).join('')}
          </ul>` : ''}
        </div>`;
    }).join('');

    const drawerCtas = actions.map(a => html`
      <a class="btn ${raw(a.variant === 'primary' ? 'btn--invert' : 'btn--ghost-dark')}" href="${escUrl(a.href) || '#'}">${a.label}</a>
    `);

    return `
      <div class="container site-header__inner">
        <a class="site-header__logo" href="#/">${esc(brand)}</a>

        <nav class="site-header__nav" aria-label="주 메뉴">${join(nav).value}</nav>

        <div class="site-header__actions">
          <button class="site-header__icon-btn" type="button" data-action="search" aria-label="검색">${ICON_SEARCH}</button>
          ${join(ctas).value}
          <button class="site-header__icon-btn site-header__burger" type="button"
                  data-action="open-drawer" aria-label="메뉴 열기" aria-expanded="false">${ICON_MENU}</button>
        </div>
      </div>

      ${panels ? `<div class="site-header__mega" data-mega hidden>
        <div class="container">${panels}</div>
      </div>` : ''}

      <div class="drawer" data-drawer hidden>
        <div class="container">
          <div class="drawer__head">
            <span class="site-header__logo">${esc(brand)}</span>
            <button class="site-header__icon-btn" type="button" data-action="close-drawer" aria-label="메뉴 닫기">${ICON_CLOSE}</button>
          </div>
          <nav class="drawer__nav" aria-label="모바일 메뉴">${drawerNav}</nav>
          <div class="drawer__actions">${join(drawerCtas).value}</div>
        </div>
      </div>
    `;
  }

  bind() {
    this.on('click', '[data-action="open-drawer"]', () => this.toggleDrawer(true));
    this.on('click', '[data-action="close-drawer"]', () => this.toggleDrawer(false));
    this.on('click', '.drawer__link, .drawer__sub-link', () => this.toggleDrawer(false));

    // mouseenter는 버블링하지 않으므로 위임에는 mouseover를 쓴다.
    this.on('mouseover', '[data-menu]', (_e, el) => this.openMenu(Number(el.dataset.menu)));
    // 키보드로 탭 이동할 때도 같은 패널이 열려야 한다.
    this.on('focusin', '[data-menu]', (_e, el) => this.openMenu(Number(el.dataset.menu)));

    // 바 바깥으로 나가면 닫는다. mouseleave는 버블링하지 않지만
    // 루트에 직접 걸므로 상관없다. 루트는 재렌더에도 유지된다.
    const onLeave = () => this.closeMenu();
    this.el.addEventListener('mouseleave', onLeave);
    this.cleanup(() => this.el?.removeEventListener('mouseleave', onLeave));

    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      this.toggleDrawer(false);
      this.closeMenu();
    };
    document.addEventListener('keydown', onKey);
    this.cleanup(() => document.removeEventListener('keydown', onKey));

    // 헤더 밖으로 포커스가 나가면 함께 닫는다.
    const onFocusOut = (e) => {
      if (!this.el?.contains(e.target)) this.closeMenu();
    };
    document.addEventListener('focusin', onFocusOut);
    this.cleanup(() => document.removeEventListener('focusin', onFocusOut));
  }

  /** 하위 항목이 있는 메뉴만 연다. 없으면 열려 있던 패널을 닫는다. */
  openMenu(index) {
    const mega = this.el?.querySelector('[data-mega]');
    const panel = mega?.querySelector(`[data-sub="${index}"]`);
    if (!panel) return this.closeMenu();
    if (index === this.open) return;
    this.open = index;

    this.el.classList.add('is-open');
    mega.hidden = false;
    mega.querySelectorAll('[data-sub]').forEach(p =>
      p.classList.toggle('is-active', p === panel));
    this.el.querySelectorAll('[data-menu]').forEach((a, i) => {
      const on = i === index;
      a.classList.toggle('is-active', on);
      if (a.hasAttribute('aria-haspopup')) a.setAttribute('aria-expanded', String(on));
    });
  }

  closeMenu() {
    if (this.open === -1) return;
    this.open = -1;
    const mega = this.el?.querySelector('[data-mega]');
    this.el?.classList.remove('is-open');
    if (mega) {
      mega.hidden = true;
      mega.querySelectorAll('[data-sub]').forEach(p => p.classList.remove('is-active'));
    }
    this.el?.querySelectorAll('[data-menu]').forEach(a => {
      a.classList.remove('is-active');
      if (a.hasAttribute('aria-haspopup')) a.setAttribute('aria-expanded', 'false');
    });
  }

  toggleDrawer(open) {
    const drawer = this.el?.querySelector('[data-drawer]');
    const burger = this.el?.querySelector('[data-action="open-drawer"]');
    if (!drawer) return;
    if (open) {
      drawer.hidden = false;
      requestAnimationFrame(() => drawer.classList.add('is-open'));
    } else {
      drawer.classList.remove('is-open');
      setTimeout(() => { if (drawer) drawer.hidden = true; }, 260);
    }
    burger?.setAttribute('aria-expanded', String(!!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  /** 데이터가 새로 들어와 마크업이 갈리면 열림 상태도 초기화한다. */
  afterRender() {
    this.open = -1;
    this.el?.classList.remove('is-open');
  }

  onDestroy() { document.body.style.overflow = ''; }
}
