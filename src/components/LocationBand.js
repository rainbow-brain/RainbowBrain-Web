/**
 * LocationBand — 오시는 길 · 연락처.
 *
 * 지도는 외부 스크립트(카카오/네이버 지도 SDK)를 붙여야 하는데, 이 사이트는
 * 빌드 도구도 키 관리도 없는 정적 묶음이다. 그래서 지도 자리는 링크가 걸린
 * 프레임으로 두고, 실제 SDK는 운영에서 키가 생겼을 때 `mapEmbed`(iframe URL)
 * 만 채우면 그 자리에 들어간다. 주소와 교통편은 지도 없이도 그 자체로
 * 완결된 정보라 먼저 읽히도록 왼쪽에 놓았다.
 *
 * 리소스: 'about.location' -> {
 *   name, address, addressDetail?, mapHref?, mapEmbed?, image?: Image,
 *   contacts: [{ label, value, href? }],
 *   transit:  [{ label, description }]
 * }
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl, mediaFrame } from '../core/dom.js';

export class LocationBand extends Component {
  static tag = 'section';
  static root = 'band band--light band--pad location';

  template(state) {
    const p = this.props;
    const d = state.data || {};

    const head = `
      <header class="head-left" data-reveal="up">
        ${p.eyebrow ? html`<p class="head-left__eyebrow">${p.eyebrow}</p>`.trim() : ''}
        <h2 class="head-left__title">${esc(p.title || '')}</h2>
      </header>`;

    if (state.status === 'loading') {
      return `<div class="container">${head}<div class="location__inner">
        <div class="skeleton" style="height:240px"></div>
        <div class="skeleton" style="aspect-ratio:4/3;border-radius:var(--radius-lg)"></div>
      </div></div>`;
    }
    if (state.status === 'empty') {
      return `<div class="container">${head}
        <div class="empty-state t-body-md">등록된 위치 정보가 없습니다.</div></div>`;
    }

    const contacts = (d.contacts || []).map(c => `
      <div class="location__contact">
        <dt class="location__contact-label">${esc(c.label)}</dt>
        <dd class="location__contact-value">${c.href
          ? `<a href="${escUrl(c.href)}">${esc(c.value)}</a>`
          : esc(c.value)}</dd>
      </div>`).join('');

    const transit = (d.transit || []).map(t => `
      <li class="location__transit">
        <span class="location__transit-label">${esc(t.label)}</span>
        <span class="location__transit-desc">${esc(t.description)}</span>
      </li>`).join('');

    // 지도 SDK 키가 생기면 mapEmbed만 채운다. 그전까지는 이미지 프레임.
    const map = d.mapEmbed
      ? `<div class="media media--4x3 location__map">
           <iframe src="${escUrl(d.mapEmbed)}" title="${esc(d.name || '오시는 길')} 지도"
                   loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
         </div>`
      : mediaFrame(d.image, { ratio: '4x3', className: 'location__map' }).value;

    return `
      <div class="container">
        ${head}
        <div class="location__inner">
          <div class="location__body" data-reveal="left">
            ${d.name ? html`<p class="location__name">${d.name}</p>`.trim() : ''}
            <p class="location__address">${esc(d.address || '')}</p>
            ${d.addressDetail ? html`<p class="location__address-sub">${d.addressDetail}</p>`.trim() : ''}
            ${contacts ? `<dl class="location__contacts">${contacts}</dl>` : ''}
            ${transit ? `<ul class="location__transits">${transit}</ul>` : ''}
            ${d.mapHref ? `<a class="link-more location__maplink" href="${escUrl(d.mapHref)}"
               target="_blank" rel="noopener noreferrer">지도에서 열기</a>` : ''}
          </div>
          <div data-reveal="right" data-reveal-delay="120">${map}</div>
        </div>
      </div>`;
  }
}
