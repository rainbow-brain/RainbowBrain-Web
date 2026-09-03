/**
 * HistoryTimeline — 연혁. 네이비 밴드 위 좌측 스티키 연도 + 우측 항목 목록.
 *
 * 흔한 연혁 UI는 가운데 세로선 양쪽으로 카드를 번갈아 놓는 형태지만,
 * 한국어 연혁은 한 항목이 한 줄로 끝나는 경우가 많아 그 배치에서는 좌우가
 * 계속 비고 시선이 지그재그로 튄다. 여기서는 CapabilityRows와 같은
 * "왼쪽 라벨 고정 · 오른쪽 목록" 구조를 써서 읽는 축을 하나로 유지한다.
 *
 * 리소스: 'about.history' -> [{
 *   id, year: '2026', note?: string,
 *   entries: [{ month?: '03', title, description? }]
 * }]
 */
import { Component } from '../core/component.js';
import { html, esc } from '../core/dom.js';

export class HistoryTimeline extends Component {
  static tag = 'section';
  static root = 'band band--dark band--pad history';

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
        ${`<div class="skeleton" style="height:96px;margin-bottom:24px"></div>`.repeat(3)}</div>`;
    }

    const groups = Array.isArray(state.data) ? state.data : [];
    if (!groups.length) {
      return `<div class="container">${head}
        <div class="empty-state t-body-md">등록된 연혁이 없습니다.</div></div>`;
    }

    const rows = groups.map(g => {
      const entries = (g.entries || []).map(e => `
        <li class="history__entry">
          <span class="history__month">${esc(e.month || '')}</span>
          <span class="history__entry-body">
            <span class="history__entry-title">${esc(e.title)}</span>
            ${e.description ? html`<span class="history__entry-desc">${e.description}</span>`.trim() : ''}
          </span>
        </li>`).join('');

      return `
        <div class="history__group" data-reveal="up">
          <div class="history__year">
            <span class="history__year-value">${esc(g.year)}</span>
            ${g.note ? html`<span class="history__year-note">${g.note}</span>`.trim() : ''}
          </div>
          <ul class="history__entries">${entries}</ul>
        </div>`;
    }).join('');

    return `<div class="container">${head}<div class="history__groups">${rows}</div></div>`;
  }
}
