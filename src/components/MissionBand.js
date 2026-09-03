/**
 * MissionBand — 회사소개 첫 본문 밴드. 한 문장짜리 선언 + 근거 문단 + 수치.
 *
 * ProductBand와 골격이 같지만(글 | 이미지 2단) 역할이 다르다. 제품 밴드는
 * 기능을 나열하고, 이쪽은 회사가 무엇을 하는 곳인지 한 번에 말한다. 그래서
 * 제목이 문단보다 크고, 기능 카드 대신 사실(설립연도 · 인원 · 누적 과제)을
 * 놓는다.
 *
 * 리소스: 'about.intro' -> {
 *   eyebrow, title, body: string[], points: [{ label, value, note? }],
 *   image: { url, alt }
 * }
 */
import { Component } from '../core/component.js';
import { html, esc, mediaFrame } from '../core/dom.js';

export class MissionBand extends Component {
  static tag = 'section';
  static root = 'band band--light band--pad mission';

  template(state) {
    const p = this.props;
    const d = state.data || {};

    if (state.status === 'loading') {
      return `<div class="container"><div class="mission__inner">
        <div class="stack">
          <div class="skeleton" style="height:44px;width:70%"></div>
          <div class="skeleton" style="height:16px"></div>
          <div class="skeleton" style="height:16px;width:88%"></div>
        </div>
        <div class="skeleton" style="aspect-ratio:4/3;border-radius:var(--radius-lg)"></div>
      </div></div>`;
    }
    if (state.status === 'empty') {
      return `<div class="container"><div class="empty-state t-body-md">등록된 소개가 없습니다.</div></div>`;
    }

    const paras = (d.body || []).map(t => html`<p class="mission__para">${t}</p>`.trim()).join('');
    const points = (d.points || []).map(pt => `
      <div class="mission__point" data-reveal="up">
        <span class="mission__point-value">${esc(pt.value)}</span>
        <span class="mission__point-label">${esc(pt.label)}</span>
        ${pt.note ? html`<span class="mission__point-note">${pt.note}</span>`.trim() : ''}
      </div>`).join('');

    return `
      <div class="container">
        <div class="mission__inner">
          <div class="mission__body" data-reveal="left">
            ${(d.eyebrow || p.eyebrow) ? html`<p class="head-left__eyebrow">${d.eyebrow || p.eyebrow}</p>`.trim() : ''}
            <h2 class="mission__title">${esc(d.title || p.title || '')}</h2>
            <div class="mission__paras">${paras}</div>
          </div>
          <div class="mission__media" data-reveal="right" data-reveal-delay="120">
            ${mediaFrame(d.image, { ratio: '4x3' }).value}
          </div>
        </div>
        ${points ? `<div class="mission__points" data-reveal-stagger="80">${points}</div>` : ''}
      </div>`;
  }
}
