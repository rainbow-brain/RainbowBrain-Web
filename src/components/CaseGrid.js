/**
 * CaseGrid — 구축사례 목록. 산업별 필터 + 카드 그리드.
 *
 * 홈의 InsightsSection은 "대표 1 + 목록 5"로 최신 몇 건만 보여준다. 목록
 * 페이지는 목적이 다르다 — 방문자는 대개 자기 산업의 사례를 찾으러 오므로
 * 첫 화면에 필터가 있어야 하고, 카드는 전부 같은 크기여야 비교가 된다.
 *
 * 필터는 URL에 남긴다(`#/cases?cat=금융`). 그래야 "금융 사례만"인 화면을
 * 그대로 링크로 보낼 수 있고, 뒤로가기가 필터 해제로 동작한다. 상태를
 * 컴포넌트 안에만 두면 둘 다 안 된다.
 *
 * 카테고리 목록은 하드코딩하지 않고 받은 데이터에서 뽑는다. 새 산업의
 * 사례가 등록되면 칩이 저절로 생긴다.
 *
 * 리소스: 'cases.list' -> Article[]
 * props: { eyebrow, title, subtitle, queryKey='cat', basePath='/cases' }
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl, mediaFrame, formatDate } from '../core/dom.js';
import { sortByNewest } from '../data/schema.js';

const ALL = '전체';

export class CaseGrid extends Component {
  static tag = 'section';
  static root = 'band band--light band--pad cases-grid';

  get queryKey() { return this.props.queryKey || 'cat'; }
  get basePath() { return this.props.basePath || '/cases'; }

  /** 현재 선택된 카테고리. URL이 유일한 출처다. */
  get active() {
    return this.props.route?.query?.[this.queryKey] || ALL;
  }

  /** 라우터가 같은 경로에서 쿼리만 바뀐 것을 알려줄 때 호출된다. */
  onRouteChange() { this.render(); }

  template(state) {
    const p = this.props;
    const head = `
      <header class="head-left" data-reveal="up">
        ${p.eyebrow ? html`<p class="head-left__eyebrow">${p.eyebrow}</p>`.trim() : ''}
        <h2 class="head-left__title">${esc(p.title || '')}</h2>
        ${p.subtitle ? html`<p class="t-body-md head-left__sub">${p.subtitle}</p>`.trim() : ''}
      </header>`;

    if (state.status === 'loading') {
      return `<div class="container">${head}<div class="cases-grid__grid">
        ${`<div class="skeleton" style="height:300px;border-radius:var(--radius-lg)"></div>`.repeat(6)}
      </div></div>`;
    }

    const all = sortByNewest(Array.isArray(state.data) ? state.data : []);
    if (!all.length) {
      return `<div class="container">${head}
        <div class="empty-state t-body-md">등록된 구축사례가 없습니다.</div></div>`;
    }

    const cats = [ALL, ...[...new Set(all.map(a => a.category).filter(Boolean))]];
    const active = cats.includes(this.active) ? this.active : ALL;
    const items = active === ALL ? all : all.filter(a => a.category === active);

    const filters = cats.map(c => {
      const href = c === ALL
        ? `#${this.basePath}`
        : `#${this.basePath}?${this.queryKey}=${encodeURIComponent(c)}`;
      const count = c === ALL ? all.length : all.filter(a => a.category === c).length;
      return `<a class="case-filter ${c === active ? 'is-active' : ''}" href="${href}"
                 ${c === active ? 'aria-current="true"' : ''}>
        ${esc(c)}<span class="case-filter__count">${count}</span></a>`;
    }).join('');

    const cards = items.map(a => `
      <a class="case-card" href="${escUrl(a.href) || '#'}" data-reveal="up">
        ${mediaFrame(a.image, { ratio: '16x9', className: 'case-card__media' }).value}
        <div class="case-card__body">
          <div class="case-card__meta">
            ${a.category ? `<span class="chip">${esc(a.category)}</span>` : ''}
            ${a.publishedAt ? `<span class="case-card__date">${formatDate(a.publishedAt)}</span>` : ''}
          </div>
          <h3 class="case-card__title">${esc(a.title)}</h3>
          ${a.excerpt ? html`<p class="case-card__excerpt">${a.excerpt}</p>`.trim() : ''}
        </div>
      </a>`).join('');

    const body = items.length
      ? `<div class="cases-grid__grid" data-reveal-stagger="70">${cards}</div>`
      : `<div class="empty-state t-body-md">"${esc(active)}" 분야의 사례가 아직 없습니다.</div>`;

    return `
      <div class="container">
        ${head}
        <nav class="cases-grid__filters" aria-label="산업별 필터" data-reveal="up">${filters}</nav>
        <p class="cases-grid__count t-caption t-muted">${items.length}건</p>
        ${body}
      </div>`;
  }
}
