/**
 * InsightsSection — 재사용하는 에디토리얼 섹션. (목업 1a 기준)
 *
 * 뉴스와 구축사례를 한 컴포넌트가 담당한다. 레이아웃은 `variant`로 갈린다.
 *
 *   variant: 'feature' (구축 사례 — 기본)
 *     좌측 정렬 헤딩 + 규칙선 + 우측 "전체 보기 →"
 *     1.35fr / 1fr 분할: 큰 대표 항목 | 텍스트 목록(썸네일 없음)
 *
 *   variant: 'compact' (뉴스 & 인사이트)
 *     1.6fr / 1fr 분할: [헤딩 + (대표 | 목록)] | 프로모 카드 열
 *     프로모는 props.aside로 받는다(매니페스트의 extra로 주입).
 *
 * 대표 슬롯: `publishedAt` 내림차순 정렬 후 [0]. featured 플래그 불필요.
 * 카테고리 탭은 없다 — 전부 하나의 목록이고 category는 라벨로만 쓴다.
 *
 * 리소스: Article[]
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl, mediaFrame, formatDate } from '../core/dom.js';
import { sortByNewest } from '../data/schema.js';

export class InsightsSection extends Component {
  static tag = 'section';
  static root = 'band band--light band--pad insight-section';

  get variant() { return this.props.variant === 'compact' ? 'compact' : 'feature'; }

  template(state) {
    const p = this.props;
    const compact = this.variant === 'compact';

    if (state.status === 'loading') {
      return `<div class="container">${this._head()}${this._skeleton()}</div>`;
    }

    const items = sortByNewest(Array.isArray(state.data) ? state.data : []);
    if (!items.length) {
      return `<div class="container">${this._head()}
        <div class="empty-state t-body-md">등록된 콘텐츠가 없습니다.</div></div>`;
    }

    const railCount = p.railCount ?? (compact ? 4 : 5);
    const [featured, ...rest] = items;
    const rail = rest.slice(0, railCount);

    const body = `
      <div class="ed__split">
        <div data-reveal="left">${this._featured(featured)}</div>
        <div data-reveal="right" data-reveal-delay="120">${this._rail(rail)}</div>
      </div>`;

    if (!compact) {
      return `<div class="container">${this._head()}${body}</div>`;
    }

    // compact: 좌측(헤딩+본문) / 우측(프로모 카드 열)
    return `
      <div class="container ed__with-aside">
        <div class="ed__main">${this._head()}${body}</div>
        ${this._aside()}
      </div>`;
  }

  /* ---- 헤딩: 좌측 정렬 + 하단 규칙선 + 우측 전체보기 ---------------------- */
  _head() {
    const p = this.props;
    const compact = this.variant === 'compact';
    return `
      <header class="ed__head ${compact ? 'ed__head--sm' : ''}" data-reveal="up">
        <div class="ed__head-titles">
          ${(!compact && p.eyebrow) ? html`<p class="ed__eyebrow">${p.eyebrow}</p>`.trim() : ''}
          <h2 class="ed__title">${esc(p.title || '')}</h2>
        </div>
        ${p.moreHref ? `<a class="ed__more" href="${escUrl(p.moreHref)}">${esc(p.moreLabel || '전체 보기')} →</a>` : ''}
      </header>`;
  }

  _meta(a, cls = '') {
    return `
      <div class="ed__meta ${cls}">
        ${a.category ? `<span class="ed__cat">${esc(a.category)}</span>` : ''}
        ${a.publishedAt ? `<span class="ed__date">${formatDate(a.publishedAt)}</span>` : ''}
      </div>`;
  }

  _featured(a) {
    const compact = this.variant === 'compact';
    return `
      <a class="ed__lead ${compact ? 'ed__lead--sm' : ''}" href="${escUrl(a.href) || '#'}">
        ${mediaFrame(a.image, { ratio: '16x9', className: 'ed__lead-media' }).value}
        ${compact ? this._meta(a, 'ed__meta--inline') : this._meta(a, 'ed__meta--chip')}
        <h3 class="ed__lead-title">${esc(a.title)}</h3>
        ${a.excerpt ? html`<p class="ed__lead-excerpt">${a.excerpt}</p>`.trim() : ''}
      </a>`;
  }

  _rail(items) {
    const compact = this.variant === 'compact';
    if (!items.length) {
      return `<p class="t-body-sm t-muted" style="padding:var(--space-md) 0">표시할 항목이 없습니다.</p>`;
    }
    const rows = items.map(a => `
      <a class="ed__row" href="${escUrl(a.href) || '#'}">
        ${this._meta(a, 'ed__meta--inline')}
        <span class="ed__row-title">${esc(a.title)}</span>
        ${(!compact && a.excerpt) ? html`<span class="ed__row-excerpt">${a.excerpt}</span>`.trim() : ''}
      </a>`).join('');
    return `<div class="ed__rail">${rows}</div>`;
  }

  /* ---- 프로모 사이드바 (compact 전용) ------------------------------------ */
  _aside() {
    const promos = Array.isArray(this.props.aside) ? this.props.aside : [];
    if (!promos.length) return '';
    const cards = promos.map(x => `
      <a class="promo-card" href="${escUrl(x.action?.href) || '#'}">
        ${x.eyebrow ? html`<span class="promo-card__eyebrow">${x.eyebrow}</span>`.trim() : ''}
        <span class="promo-card__title">${esc(x.title || '')}</span>
        ${x.description ? html`<span class="promo-card__desc">${x.description}</span>`.trim() : ''}
        ${x.action ? `<span class="promo-card__link">${esc(x.action.label)} →</span>` : ''}
      </a>`).join('');
    return `<aside class="promo-stack" data-reveal="right" data-reveal-delay="160">${cards}</aside>`;
  }

  _skeleton() {
    const row = `<div class="ed__row"><div class="skeleton" style="height:12px;width:35%"></div>
      <div class="skeleton" style="height:18px;margin-top:8px"></div></div>`;
    return `
      <div class="ed__split">
        <div class="ed__lead">
          <div class="skeleton" style="aspect-ratio:16/9"></div>
          <div class="skeleton" style="height:16px;width:30%;margin-top:16px"></div>
          <div class="skeleton" style="height:30px;width:80%;margin-top:12px"></div>
        </div>
        <div class="ed__rail">${row.repeat(4)}</div>
      </div>`;
  }
}
