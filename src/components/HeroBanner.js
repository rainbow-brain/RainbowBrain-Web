/**
 * HeroBanner — 컨테이너 안에 들어가는 둥근 히어로 블록. 페이지의 유일한 캐러셀.
 *
 * DESIGN.md: 화면 끝까지 채우는 이미지가 아니다. 흰 바탕 위 컨테이너 안에
 * 좌우 여백을 보이며 놓인다. 그래서 페이지 자체가 아니라 교체 가능한
 * 컴포넌트로 읽힌다.
 *
 * 슬라이드 높이는 고정이다. 제목이 길면 줄바꿈될 뿐 배너 크기는 변하지 않는다.
 * 가독성이 사진에 좌우되지 않도록 그라데이션 스크림을 항상 깐다.
 *
 * 리소스: 'hero.slides' -> Slide[]
 */
import { Component } from '../core/component.js';
import { html, raw, join, esc, escUrl } from '../core/dom.js';

const ARROW_L = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>`;
const ARROW_R = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>`;

export class HeroBanner extends Component {
  static tag = 'section';
  static root = 'hero';

  constructor(props) {
    super(props);
    this.index = 0;
    this.timer = null;
    this.autoplayMs = props.autoplayMs ?? 6000;
  }

  template(state) {
    const slides = Array.isArray(state.data) ? state.data : [];

    if (state.status === 'loading' || !slides.length) {
      return `
        <div class="container">
          <div class="hero__frame">
            <div class="hero__slide is-active">
              <div class="hero__body">
                ${state.status === 'loading' ? `
                  <div class="skeleton" style="width:120px;height:18px"></div>
                  <div class="skeleton" style="width:min(560px,80%);height:44px"></div>
                  <div class="skeleton" style="width:min(420px,70%);height:20px"></div>
                ` : `<p class="t-body-md t-muted-dark">등록된 배너가 없습니다.</p>`}
              </div>
            </div>
          </div>
        </div>`;
    }

    const slideHTML = slides.map((s, i) => {
      const actions = (s.actions || []).map(a => html`
        <a class="btn ${raw(a.variant === 'secondary' ? 'btn--ghost-dark' : 'btn--invert')}"
           href="${escUrl(a.href) || '#'}">${a.label}</a>`);

      const bg = s.image?.url
        ? `<div class="hero__bg"><img src="${escUrl(s.image.url)}" alt="${esc(s.image.alt || '')}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`
        : '';

      return `
        <article class="hero__slide ${i === 0 ? 'is-active' : ''}" data-slide="${i}"
                 role="group" aria-roledescription="슬라이드" aria-label="${i + 1} / ${slides.length}"
                 ${i === 0 ? '' : 'aria-hidden="true"'}>
          ${bg}
          <div class="hero__scrim"></div>
          <div class="hero__body">
            ${s.eyebrow ? html`<p class="t-eyebrow hero__eyebrow">${s.eyebrow}</p>`.trim() : ''}
            <h2 class="t-heading-1 hero__title">${esc(s.title)}</h2>
            ${s.description ? html`<p class="t-body-md hero__desc">${s.description}</p>`.trim() : ''}
            ${actions.length ? `<div class="hero__actions">${join(actions).value}</div>` : ''}
          </div>
        </article>`;
    }).join('');

    const dots = slides.map((_, i) => `
      <button class="hero__dot ${i === 0 ? 'is-active' : ''}" type="button"
              data-goto="${i}" aria-label="${i + 1}번 슬라이드"></button>`).join('');

    const controls = slides.length > 1 ? `
      <div class="hero__dots" role="tablist">${dots}</div>
      <div class="hero__nav">
        <button class="hero__arrow" type="button" data-step="-1" aria-label="이전 슬라이드">${ARROW_L}</button>
        <button class="hero__arrow" type="button" data-step="1" aria-label="다음 슬라이드">${ARROW_R}</button>
      </div>` : '';

    return `
      <div class="container">
        <div class="hero__frame" data-track aria-roledescription="캐러셀" aria-label="주요 소식">
          ${slideHTML}
          ${controls}
        </div>
      </div>`;
  }

  bind() {
    this.on('click', '[data-step]', (_e, btn) => {
      this.go(this.index + Number(btn.dataset.step));
      this.restart();
    });
    this.on('click', '[data-goto]', (_e, btn) => {
      this.go(Number(btn.dataset.goto));
      this.restart();
    });
    // 마우스를 올렸거나 탭이 비활성일 때는 자동 재생을 멈춘다.
    this.on('mouseenter', '.hero__frame', () => this.stop());
    this.on('mouseleave', '.hero__frame', () => this.start());
    this.on('focusin', '.hero__frame', () => this.stop());

    const onVis = () => (document.hidden ? this.stop() : this.start());
    document.addEventListener('visibilitychange', onVis);
    this.cleanup(() => document.removeEventListener('visibilitychange', onVis));
  }

  afterRender() {
    this.index = 0;
    this.restart();
  }

  get slideEls() { return Array.from(this.el?.querySelectorAll('[data-slide]') || []); }

  /**
   * 가로 슬라이드 전환.
   * 나가는 슬라이드에 `is-prev`를 붙여 왼쪽으로 밀어내고, 들어오는 슬라이드는
   * 오른쪽 대기 위치에서 제자리로 들어온다. 나머지는 대기 위치에 그대로 둔다.
   */
  go(next) {
    const slides = this.slideEls;
    if (slides.length < 2) return;

    const from = this.index;
    this.index = (next + slides.length) % slides.length;
    if (from === this.index) return;

    slides.forEach((s, i) => {
      const active = i === this.index;
      s.classList.toggle('is-active', active);
      s.classList.toggle('is-prev', i === from);   // 직전 슬라이드만 왼쪽으로
      if (active) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
    });
    this.el.querySelectorAll('[data-goto]').forEach((d, i) => {
      d.classList.toggle('is-active', i === this.index);
    });
  }

  /** 자동 슬라이드. 모션 축소 설정이면 전환만 즉시 바뀌고 재생은 계속된다. */
  start() {
    if (this.timer || this.slideEls.length < 2) return;
    this.timer = setInterval(() => this.go(this.index + 1), this.autoplayMs);
  }
  stop() { clearInterval(this.timer); this.timer = null; }
  restart() { this.stop(); this.start(); }
  onDestroy() { this.stop(); }
}
