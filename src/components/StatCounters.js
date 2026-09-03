/**
 * StatCounters — 테마 1의 성과 지표. StatBand(그레이 3카드)를 대체한다.
 *
 * 같은 'stats.list' 리소스를 쓰지만 카드 대신 대형 숫자 4개로 평탄화하고,
 * 밴드를 네이비로 바꿔 히어로/역량 밴드와 하나의 다크 스파인으로 이어붙인다.
 * 숫자는 화면에 들어올 때 한 번 카운트업한다.
 *
 * 리소스: 'stats.list' -> { headline, note, items: StatCard[] }
 * props: { eyebrow, title, note, max }
 */
import { Component } from '../core/component.js';
import { html, esc } from '../core/dom.js';

/** "2,000+" -> { n: 2000, unit: '+' } / "62%" -> { n: 62, unit: '%' } */
function parseFigure(value) {
  const s = String(value ?? '');
  const m = s.match(/^([\d,.]+)\s*(.*)$/);
  if (!m) return { n: null, unit: '', raw: s };
  return { n: Number(m[1].replace(/,/g, '')), unit: m[2] || '', raw: s };
}

const fmt = n => n.toLocaleString('ko-KR');

export class StatCounters extends Component {
  static tag = 'section';
  static root = 'band band--dark band--pad counters';

  constructor(props) {
    super(props);
    this.io = null;
  }

  isEmpty(data) { return !data || !(data.items || []).length; }

  /** stats.list의 중첩 figures를 대표 숫자 목록으로 평탄화한다. */
  flatten(items, max) {
    const out = [];
    for (const item of items) {
      for (const f of item.figures || []) {
        out.push({ ...parseFigure(f.value), label: item.label || '', desc: f.caption || '' });
        if (out.length >= max) return out;
      }
    }
    return out;
  }

  template(state) {
    const p = this.props;
    const d = state.data || {};
    const head = `
      <header class="counters__head">
        <div class="counters__head-titles">
          ${p.eyebrow ? html`<p class="counters__eyebrow">${p.eyebrow}</p>`.trim() : ''}
          <h2 class="t-heading-1">${esc(d.headline || p.title || '')}</h2>
        </div>
        ${(p.note || d.note) ? html`<p class="counters__note">${p.note || d.note}</p>`.trim() : ''}
      </header>`;

    if (state.status === 'loading') {
      return `<div class="container">${head}<div class="counters__grid">
        ${`<div class="skeleton" style="height:150px"></div>`.repeat(4)}
      </div></div>`;
    }
    if (state.status === 'empty') {
      return `<div class="container">${head}<div class="empty-state t-body-md">등록된 성과 지표가 없습니다.</div></div>`;
    }

    const figures = this.flatten(d.items || [], p.max || 4);

    return `
      <div class="container">${head}
        <div class="counters__grid">
          ${figures.map(f => `
            <div class="counter">
              <div class="counter__value" ${f.n !== null ? `data-count="${f.n}"` : ''}>
                ${f.n !== null ? `<span data-num>${fmt(f.n)}</span><span class="counter__unit">${esc(f.unit)}</span>`
                               : esc(f.raw)}
              </div>
              <p class="counter__label">${esc(f.label)}</p>
              ${f.desc ? html`<p class="counter__desc">${f.desc}</p>`.trim() : ''}
            </div>`).join('')}
        </div>
      </div>`;
  }

  afterRender() {
    this.io?.disconnect();
    const nodes = Array.from(this.el.querySelectorAll('[data-count]'));
    if (!nodes.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof window.IntersectionObserver !== 'function') return; // 최종값 그대로 노출

    // 시작값은 0. 화면에 들어오면 한 번만 세고 관찰을 끊는다.
    nodes.forEach(n => { n.querySelector('[data-num]').textContent = '0'; });

    this.io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        this.count(e.target);
        this.io.unobserve(e.target);
      }
    }, { threshold: 0.4 });

    nodes.forEach(n => this.io.observe(n));
    this.cleanup(() => this.io?.disconnect());
  }

  count(node) {
    const target = Number(node.dataset.count);
    const out = node.querySelector('[data-num]');
    const dur = 1100;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      out.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  onDestroy() { this.io?.disconnect(); }
}
