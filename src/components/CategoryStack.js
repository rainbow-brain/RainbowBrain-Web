/**
 * CategoryStack — 역량 4개를 계단처럼 어긋나게 세운 카드 열.
 *
 * CapabilityRows(스티키 라벨 + 가로 행)를 대체한다. 예전 방식은 스크롤에
 * 따라 활성 행이 바뀌는 스크럽이라, 사용자가 스크롤을 멈춘 위치에 따라
 * 보이는 내용이 달라졌다 — 네 항목이 대등한 관계인데 한 번에 하나만 펼쳐
 * 보이니 나머지 셋은 늘 접힌 상태로 지나쳤다. 넷을 동시에 세워 두면
 * "축이 넷"이라는 사실이 한눈에 들어온다.
 *
 * 카드 윗변을 한 칸씩 내려 계단을 만든다. 넷을 같은 높이에 세우면 카드가
 * 아니라 표의 한 행으로 읽히는데, 어긋나 있으면 각각이 독립된 판으로 읽히고
 * 시선이 왼쪽 위에서 오른쪽 아래로 흐른다. 오프셋은 CSS의 --stack-step 하나가
 * 정하므로 좁은 화면에서 계단을 접는 것도 그 값만 0으로 두면 된다.
 *
 * 카드 머리의 도형은 순서에서 생성한다. 실물 사진이 없는 자리에 의미 없는
 * 스톡 이미지를 채우느니, 항목마다 다르되 설명하지 않는 표식이 낫다.
 *
 * 리소스: 'capabilities.list' -> CapabilityGroup[]
 * props: { moreLabel, moreHref }
 */
import { Component } from "../core/component.js";
import { esc, escUrl } from "../core/dom.js";

/* 네 가지 표식. 브랜드 색 두 개(남색·보라) 안에서만 조합한다 — 카드마다
   새 색을 들이면 네 항목이 네 개의 다른 제품처럼 보인다. */
const MARKS = [
  `<circle cx="34" cy="34" r="22" fill="var(--mark-a)"/>
   <circle cx="66" cy="34" r="22" fill="var(--mark-b)" fill-opacity=".85"/>`,
  `<rect x="12" y="12" width="44" height="44" rx="6" fill="var(--mark-a)"/>
   <circle cx="68" cy="46" r="20" fill="var(--mark-b)" fill-opacity=".85"/>`,
  `<path d="M50 8 88 60H12z" fill="var(--mark-a)"/>
   <circle cx="30" cy="24" r="14" fill="var(--mark-b)" fill-opacity=".85"/>`,
  `<rect x="14" y="14" width="30" height="42" rx="15" fill="var(--mark-a)"/>
   <rect x="54" y="14" width="30" height="42" rx="15" fill="var(--mark-b)" fill-opacity=".85"/>`,
];

const mark = (i) => `
  <svg class="cat__mark" viewBox="0 0 100 68" aria-hidden="true" focusable="false">
    ${MARKS[i % MARKS.length]}
  </svg>`;

export class CategoryStack extends Component {
  static tag = "section";
  static root = "band band--light band--pad cats";

  template(state) {
    const p = this.props;

    if (state.status === "loading") {
      return `<div class="container"><div class="cats__grid">
        ${`<div class="skeleton" style="height:320px;border-radius:var(--radius-lg)"></div>`.repeat(4)}
      </div></div>`;
    }

    const groups = Array.isArray(state.data) ? state.data : [];
    if (!groups.length) {
      return `<div class="container"><div class="empty-state t-body-md">등록된 서비스가 없습니다.</div></div>`;
    }

    /* 항목은 셋까지만 싣는다. 카드마다 항목 수가 다르면 계단의 아랫변이
       들쭉날쭉해져 어긋난 게 의도인지 사고인지 구분되지 않는다. */
    const cards = groups
      .map((g, i) => {
        const items = (g.items || []).slice(0, 3);
        const href = escUrl(p.moreHref) || "#/services";
        return `
        <article class="cat" style="--stack-index:${i}" data-reveal="in" data-reveal-delay="${i * 90}">
          <div class="cat__head">${mark(i)}</div>
          <div class="cat__body">
            <span class="cat__no">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="cat__title">${esc(g.title)}</h3>
            <ul class="cat__items">
              ${items.map((it) => `<li>${esc(it)}</li>`).join("")}
            </ul>
            <a class="cat__more" href="${href}">${esc(p.moreLabel || "더 알아보기")} →</a>
          </div>
        </article>`;
      })
      .join("");

    return `<div class="container"><div class="cats__grid">${cards}</div></div>`;
  }
}
