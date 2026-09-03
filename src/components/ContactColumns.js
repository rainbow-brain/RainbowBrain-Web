/**
 * ContactColumns — 푸터 바로 위 마무리 밴드. 문장 + 연락 창구 3열.
 *
 * CtaBandLight(흰 면에 문장 하나 + 버튼 하나)를 대체한다. 예전 밴드는 "문의
 * 하세요"라고만 하고 어디로 문의하는지는 푸터 법인정보 줄에 작은 글씨로
 * 흩어져 있었다. 창구를 세 칸으로 펼쳐 놓으면 용건에 맞는 곳을 바로 고른다.
 *
 * 면은 흰색 그대로다. NOBASE의 Contact 밴드는 다크지만 여기서는 쓸 수 없다 —
 * 바로 위가 남색 리포트 밴드(#001c88)이고 바로 아래가 네이비 푸터(#001543)라,
 * 이 밴드를 네이비로 칠하면 위로는 1.28:1로 경계가 안 보이고 아래로는 푸터와
 * 같은 색이 되어 둘이 한 덩어리가 된다. 흰 면이 그 사이를 벌리는 것이 이
 * 자리에 흰 밴드가 있던 원래 이유다(assets/css/layout.css > 밴드 섹션).
 * 옮겨 온 것은 색이 아니라 3열 구조다.
 *
 * 리소스: 'cta.closing' -> ClosingCta | null
 * extra:  { place: 'about.location' } -> LocationInfo (contacts를 쓴다)
 * props: { eyebrow, max }
 */
import { Component } from "../core/component.js";
import { html, esc, escUrl } from "../core/dom.js";

export class ContactColumns extends Component {
  static tag = "section";
  static root = "band band--light band--pad contact-cols";

  template(state) {
    const p = this.props;
    const d = state.data;

    if (state.status === "loading") {
      return `<div class="container">
        <div class="skeleton" style="height:40px;width:min(560px,80%)"></div>
        <div class="contact-cols__grid" style="margin-top:var(--space-xxl)">
          ${`<div class="skeleton" style="height:150px"></div>`.repeat(3)}
        </div></div>`;
    }

    /* 링크가 걸린 창구만 칸으로 세운다. "평일 09:00 – 18:00" 같은 안내는
       누를 곳이 없어 칸으로 만들면 빈 버튼 자리가 남는다 — 아래 한 줄로
       내려 보낸다. */
    const contacts = (this.props.place?.contacts || []).filter((c) => c.href);
    const notes = (this.props.place?.contacts || []).filter((c) => !c.href);
    const cols = contacts.slice(0, p.max || 3);

    // 마무리 문장도 창구도 없으면 밴드째로 감춘다. 껍데기만 남으면
    // 96px 상하 여백이 그대로 페이지 끝에 붙는다.
    if (!d?.title && !cols.length) {
      this.el?.classList.add("is-hidden");
      return "";
    }
    this.el?.classList.remove("is-hidden");

    const head = d?.title
      ? `<header class="contact-cols__head">
          ${p.eyebrow ? html`<p class="contact-cols__eyebrow" data-reveal="up">${p.eyebrow}</p>`.trim() : ""}
          <h2 class="contact-cols__title" data-reveal="up" data-reveal-delay="80">${esc(d.title)}</h2>
          ${d.description ? html`<p class="contact-cols__desc" data-reveal="up" data-reveal-delay="140">${d.description}</p>`.trim() : ""}
          ${
            d.action
              ? `<a class="btn btn--primary btn--lg" data-reveal="up" data-reveal-delay="200"
                    href="${escUrl(d.action.href) || "#"}">${esc(d.action.label)}</a>`
              : ""
          }
         </header>`
      : "";

    const grid = cols.length
      ? `<div class="contact-cols__grid" data-reveal="in" data-reveal-delay="120">
          ${cols
            .map(
              (c) => `
            <div class="contact-col">
              <p class="contact-col__label">${esc(c.label)}</p>
              <p class="contact-col__value">${esc(c.value)}</p>
              <a class="contact-col__link" href="${escUrl(c.href)}">${esc(c.label)} →</a>
            </div>`,
            )
            .join("")}
         </div>`
      : "";

    const foot = notes.length
      ? `<p class="contact-cols__note" data-reveal="in" data-reveal-delay="200">
          ${notes.map((n) => `${esc(n.label)} ${esc(n.value)}`).join(" · ")}
         </p>`
      : "";

    return `<div class="container">${head}${grid}${foot}</div>`;
  }
}
