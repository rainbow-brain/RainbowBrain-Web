/**
 * SiteFooter — 전체 폭 네이비 배경에 내용은 컨테이너 안에.
 * 회사 정보 블록(대표이사 · 주소 · 사업자등록번호 · 통신판매업신고 ·
 * 개인정보처리방침)을 담는다. 개인정보처리방침은 흐리게 처리하지 않고
 * 본문과 같은 명도를 유지한다 — 작은 글씨가 아니라 필수 링크이기 때문.
 *
 * 리소스: 'footer.info' -> FooterInfo
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl } from '../core/dom.js';

export class SiteFooter extends Component {
  static tag = 'footer';
  static root = 'site-footer';

  isEmpty() { return false; }

  template(state) {
    const d = state.data || {};
    const dirs = (d.directories || []).map(col => `
      <div>
        <p class="t-body-sm site-footer__coltitle">${esc(col.title || '')}</p>
        ${(col.links || []).map(l => `
          <a class="site-footer__link" href="${escUrl(l.href) || '#'}">${esc(l.label)}</a>`).join('')}
      </div>`).join('');

    const legal = (d.legal || []).map(item => `
      <span class="t-caption">${esc(item.label)} | ${esc(item.value)}</span>`).join('');

    return `
      <div class="container">
        <div class="site-footer__top">
          <div class="site-footer__brand">
            <span class="site-footer__logo">${esc(d.logo || this.props.brand || 'RAINBOW BRAIN')}</span>
            ${d.tagline ? html`<p class="t-caption">${d.tagline}</p>`.trim() : ''}
          </div>
          <div class="site-footer__dirs">${dirs}</div>
        </div>

        <div class="site-footer__legal">
          <div class="site-footer__legal-row">${legal}</div>
          <div class="site-footer__legal-row">
            ${d.policyHref
              ? `<a class="t-caption site-footer__policy" href="${escUrl(d.policyHref)}">개인정보처리방침</a>`
              : `<span class="t-caption site-footer__policy">개인정보처리방침</span>`}
          </div>
          <p class="t-caption site-footer__copy">${esc(d.copyright || '')}</p>
        </div>
      </div>`;
  }
}
