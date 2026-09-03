/**
 * ServiceList — 서비스 페이지 본문. 번호가 붙은 서비스 행을 세로로 쌓는다.
 *
 * 홈의 CapabilityRows는 "네 개 축이 있다"만 보여주면 되니까 접힌 요약으로
 * 충분했다. 서비스 페이지는 그 다음 질문("그래서 뭘 해주는데?")에 답해야
 * 하므로 모든 행을 처음부터 펼쳐 둔다. 아코디언으로 감추면 비교하려고 온
 * 사람이 매 항목을 눌러야 한다.
 *
 * 행 하나 = 좌측 번호·제목·요약 / 우측 산출물 목록. 우측이 비어 있으면
 * 좌측이 전체 폭을 쓴다.
 *
 * 리소스: 'services.list' -> [{
 *   id, code?, title, summary?, description?,
 *   deliverables?: string[], outcomes?: [{ value, caption }], tags?: string[],
 *   href?
 * }]
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl } from '../core/dom.js';

export class ServiceList extends Component {
  static tag = 'section';
  static root = 'band band--light band--pad services';

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
        ${`<div class="skeleton" style="height:170px;margin-bottom:20px"></div>`.repeat(4)}</div>`;
    }

    const items = Array.isArray(state.data) ? state.data : [];
    if (!items.length) {
      return `<div class="container">${head}
        <div class="empty-state t-body-md">등록된 서비스가 없습니다.</div></div>`;
    }

    const rows = items.map((s, i) => {
      const deliverables = (s.deliverables || []).map(t => `
        <li class="service__deliverable">${esc(t)}</li>`).join('');
      const outcomes = (s.outcomes || []).map(o => `
        <div class="service__outcome">
          <span class="service__outcome-value">${esc(o.value)}</span>
          <span class="service__outcome-caption">${esc(o.caption || '')}</span>
        </div>`).join('');
      const tags = (s.tags || []).map(t => `<span class="service__tag">${esc(t)}</span>`).join('');

      return `
        <article class="service" id="${esc(s.id || `service-${i + 1}`)}" data-reveal="up">
          <div class="service__head">
            <span class="service__no">${String(i + 1).padStart(2, '0')}</span>
            <div class="service__titles">
              ${s.code ? html`<p class="service__code">${s.code}</p>`.trim() : ''}
              <h3 class="service__title">${esc(s.title)}</h3>
              ${s.summary ? html`<p class="service__summary">${s.summary}</p>`.trim() : ''}
            </div>
          </div>
          <div class="service__detail">
            ${s.description ? html`<p class="service__desc">${s.description}</p>`.trim() : ''}
            ${deliverables ? `<ul class="service__deliverables">${deliverables}</ul>` : ''}
            ${outcomes ? `<div class="service__outcomes">${outcomes}</div>` : ''}
            ${tags ? `<div class="service__tags">${tags}</div>` : ''}
            ${s.href ? `<a class="link-more" href="${escUrl(s.href)}">자세히 보기</a>` : ''}
          </div>
        </article>`;
    }).join('');

    return `<div class="container">${head}<div class="services__rows">${rows}</div></div>`;
  }
}
