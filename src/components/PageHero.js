/**
 * PageHero — 하위 페이지(회사소개 · 서비스 · 솔루션 · 구축사례) 공통 머리 밴드.
 *
 * 홈의 HeroSpine과 같은 네이비 판 언어를 쓰되, 스크롤 연동·패럴랙스·챕터
 * 회전을 전부 걷어냈다. 하위 페이지의 첫 화면은 "무슨 페이지인지"만 말하면
 * 되고, 그 아래 본문이 바로 시작돼야 한다. 홈과 같은 820px짜리 판을 또
 * 세우면 모든 페이지의 첫 스크롤이 낭비된다.
 *
 * 리소스 없음 — 내용은 매니페스트의 props로 받는다.
 * props: {
 *   breadcrumb: [{ label, href }],
 *   eyebrow, title, lede,
 *   meta:  [{ label, value }],      좌하단 요약 수치 (선택)
 *   index: [{ label, href }],       페이지 안 앵커 스트립 (선택)
 *   actions: [{ label, href, variant }]
 * }
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl } from '../core/dom.js';

export class PageHero extends Component {
  static tag = 'section';
  static root = 'band band--dark page-hero';

  isEmpty() { return false; }   // props로만 그린다

  template() {
    const p = this.props;

    const crumbs = (p.breadcrumb || []).map((c, i, arr) => {
      const last = i === arr.length - 1;
      const label = esc(c.label);
      const node = (c.href && !last)
        ? `<a class="page-hero__crumb" href="${escUrl(c.href)}">${label}</a>`
        : `<span class="page-hero__crumb is-current" aria-current="page">${label}</span>`;
      return node + (last ? '' : '<span class="page-hero__crumb-sep" aria-hidden="true">/</span>');
    }).join('');

    const meta = (p.meta || []).map(m => `
      <div class="page-hero__stat">
        <span class="page-hero__stat-value">${esc(m.value)}</span>
        <span class="page-hero__stat-label">${esc(m.label)}</span>
      </div>`).join('');

    const index = (p.index || []).map((x, i) => `
      <a class="page-hero__jump" href="${escUrl(x.href) || '#'}">
        <span class="page-hero__jump-no">${String(i + 1).padStart(2, '0')}</span>
        <span class="page-hero__jump-label">${esc(x.label)}</span>
      </a>`).join('');

    const actions = (p.actions || []).map(a => html`
      <a class="btn ${a.variant === 'secondary' ? 'btn--ghost-dark' : 'btn--invert'}"
         href="${escUrl(a.href) || '#'}">${a.label}</a>`).join('');

    return `
      <div class="container page-hero__inner">
        ${crumbs ? `<nav class="page-hero__crumbs" aria-label="위치">${crumbs}</nav>` : ''}
        <div class="page-hero__body">
          <div class="page-hero__lead" data-reveal="up">
            ${p.eyebrow ? html`<p class="page-hero__eyebrow">${p.eyebrow}</p>`.trim() : ''}
            <h1 class="page-hero__title">${esc(p.title || '')}</h1>
          </div>
          <div class="page-hero__aside" data-reveal="up" data-reveal-delay="90">
            ${p.lede ? html`<p class="page-hero__lede">${p.lede}</p>`.trim() : ''}
            ${actions ? `<div class="page-hero__actions">${actions}</div>` : ''}
          </div>
        </div>
        ${meta ? `<div class="page-hero__stats" data-reveal="up" data-reveal-delay="150">${meta}</div>` : ''}
        ${index ? `<nav class="page-hero__jumps" aria-label="페이지 내 이동">${index}</nav>` : ''}
      </div>`;
  }
}
