/**
 * ProcessSteps — 진행 프로세스. 가로로 이어지는 번호 단계.
 *
 * "진단 → 설계 → 구축 → 안정화 → 이관"처럼 순서가 의미인 정보다. 카드
 * 그리드로 늘어놓으면 순서가 사라지므로, 단계 사이를 잇는 선을 배경으로
 * 깔고 번호를 그 선 위에 올린다. 좁은 화면에서는 선이 세로로 돌아간다.
 *
 * 리소스: 'services.process' -> [{ id, title, description?, duration? }]
 */
import { Component } from '../core/component.js';
import { html, esc } from '../core/dom.js';

export class ProcessSteps extends Component {
  static tag = 'section';
  static root = 'band band--soft band--pad process';

  template(state) {
    const p = this.props;
    const head = `
      <header class="head-left" data-reveal="up">
        ${p.eyebrow ? html`<p class="head-left__eyebrow">${p.eyebrow}</p>`.trim() : ''}
        <h2 class="head-left__title">${esc(p.title || '')}</h2>
        ${p.subtitle ? html`<p class="t-body-md head-left__sub">${p.subtitle}</p>`.trim() : ''}
      </header>`;

    if (state.status === 'loading') {
      return `<div class="container">${head}<div class="process__grid">
        ${`<div class="skeleton" style="height:150px"></div>`.repeat(5)}</div></div>`;
    }

    const steps = Array.isArray(state.data) ? state.data : [];
    if (!steps.length) {
      return `<div class="container">${head}
        <div class="empty-state t-body-md">등록된 단계가 없습니다.</div></div>`;
    }

    const cells = steps.map((s, i) => `
      <li class="process__step" data-reveal="up">
        <span class="process__no">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="process__title">${esc(s.title)}</h3>
        ${s.description ? html`<p class="process__desc">${s.description}</p>`.trim() : ''}
        ${s.duration ? html`<p class="process__duration">${s.duration}</p>`.trim() : ''}
      </li>`).join('');

    return `<div class="container">${head}
      <ol class="process__grid" data-reveal-stagger="80">${cells}</ol></div>`;
  }
}
