/**
 * SectionIntro — 아이브로 + 제목만 담은 얇은 밴드.
 *
 * 제목을 뒤따르는 내용과 같은 섹션에 넣지 않고 따로 떼어 낸 형태다.
 * 제목이 내용과 한 상자 안에 있으면 둘 사이 여백을 그 상자의 안쪽 여백이
 * 정하게 되고, 밴드마다 값이 조금씩 달라져 페이지를 내려갈 때 제목이
 * 붙었다 떨어졌다 한다. 밴드로 분리하면 제목-내용 간격을 여기 하나가
 * 정한다.
 *
 * 리소스 없음 — 전부 props다.
 * props: { eyebrow, title, align: 'left'|'center', tone: 'light'|'soft'|'dark' }
 */
import { Component } from "../core/component.js";
import { html, esc } from "../core/dom.js";

const TONE = {
  light: "band--light",
  soft: "band--soft",
  dark: "band--dark",
};

export class SectionIntro extends Component {
  static tag = "section";
  static root = "band intro";

  isEmpty() {
    return false;
  }

  /* 배경 클래스는 루트가 만들어진 뒤에 붙인다. Component.mount가 static root를
     그대로 className에 넣으므로, 톤처럼 props로 갈리는 값은 여기서 더한다. */
  afterRender() {
    const tone = TONE[this.props.tone] || TONE.light;
    this.el.classList.add(tone);
    this.el.classList.toggle("intro--center", this.props.align === "center");
  }

  template() {
    const p = this.props;
    return `
      <div class="container">
        ${p.eyebrow ? html`<p class="intro__eyebrow" data-reveal="up">${p.eyebrow}</p>`.trim() : ""}
        <h2 class="intro__title" data-reveal="up" data-reveal-delay="80">${esc(p.title || "")}</h2>
        ${p.subtitle ? html`<p class="intro__sub" data-reveal="up" data-reveal-delay="160">${p.subtitle}</p>`.trim() : ""}
      </div>`;
  }
}
