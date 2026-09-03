/**
 * ChallengeGrid — 2열 아이콘 행 ("Enterprise Challenges" 영역).
 * 아이콘 타일은 블루 또는 바이올렛만 사용한다. 항목 구분은 아이콘과 문구로
 * 하고, 세 번째 색을 추가하지 않는다 (DESIGN.md > icon-tile).
 *
 * 리소스: 'challenges.list' -> Challenge[]
 */
import { Component } from '../core/component.js';
import { html, esc } from '../core/dom.js';

/** 이름으로 관리하는 아이콘 — DB에는 마크업이 아니라 키만 저장한다. */
const ICONS = {
  cost:     `<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
  ops:      `<path d="M3 12h4l3 8 4-16 3 8h4"/>`,
  security: `<path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z"/>`,
  people:   `<path d="M16 20v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/>`,
  data:     `<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/>`,
  speed:    `<path d="M12 20a8 8 0 1 1 8-8M12 12l4-4"/>`,
  default:  `<circle cx="12" cy="12" r="8"/>`,
};

function icon(name) {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.default}</svg>`;
}

export class ChallengeGrid extends Component {
  static tag = 'section';
  static root = 'band band--soft band--pad stalls';

  template(state) {
    const p = this.props;
    // 목업 1a: 가운데 정렬이 아니라 좌측 정렬, 아이브로 + 제목.
    const head = `
      <header class="head-left" data-reveal="up">
        ${p.eyebrow ? html`<p class="head-left__eyebrow">${p.eyebrow}</p>`.trim() : ''}
        <h2 class="head-left__title">${esc(p.title || '')}</h2>
        ${p.subtitle ? html`<p class="t-body-md head-left__sub">${p.subtitle}</p>`.trim() : ''}
      </header>`;

    if (state.status === 'loading') {
      return `<div class="container">${head}<div class="stalls__grid">
        ${`<div class="skeleton" style="height:130px"></div>`.repeat(4)}
      </div></div>`;
    }

    const items = Array.isArray(state.data) ? state.data : [];
    if (!items.length) {
      return `<div class="container">${head}<div class="empty-state t-body-md">등록된 항목이 없습니다.</div></div>`;
    }

    // 목업 1a: 아이콘 타일 없이 4열, 각 항목 위에 2px 규칙선.
    const cards = items.map(c => `
      <article class="stall" data-reveal="up">
        <h3 class="stall__title">${esc(c.title)}</h3>
        ${c.description ? html`<p class="stall__desc">${c.description}</p>`.trim() : ''}
      </article>`).join('');

    return `<div class="container">${head}<div class="stalls__grid" data-reveal-stagger="90">${cards}</div></div>`;
  }
}
