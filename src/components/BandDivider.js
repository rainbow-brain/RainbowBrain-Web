/**
 * BandDivider — 다크 면과 밝은 면 사이를 잇는 얇은 전환 밴드.
 *
 * 히어로(네이비)에서 본문(흰색)으로 넘어가는 자리에 놓는다. 두 면이 직각으로
 * 맞닿으면 그 선이 "여기서 화면이 끝났다"로 읽혀 아래를 더 볼 이유가 없어
 * 보인다. 사선 한 줄을 끼워 넣으면 위 면이 아래로 흘러내리는 모양이 되고,
 * 경계가 끝이 아니라 이어짐으로 읽힌다.
 *
 * 이미지가 아니라 clip-path로 그린다. 배경 이미지 한 장으로 처리하면 폭에
 * 따라 사선 각도가 달라지고, 위아래 면 색을 바꿀 때마다 이미지를 다시
 * 만들어야 한다. 도형으로 두면 색은 토큰이 정한다.
 *
 * 리소스 없음.
 * props: { from, to, flip }
 *   from/to — 'dark' | 'light' | 'soft' | 'primary'. 양쪽 밴드가 실제로 쓰는
 *   면 색과 같은 값을 줘야 한다. 다르면 사선이 두 면을 잇는 게 아니라 그
 *   위에 얹힌 별개의 도형으로 보인다. 그래서 그라데이션 밴드(제품 배너)
 *   옆에는 쓸 수 없다 — 맞출 평면색이 없다.
 *   from — 위쪽(앞 밴드) 면 색, to — 아래쪽(뒤 밴드) 면 색.
 *   flip — 사선 방향을 좌우로 뒤집는다.
 */
import { Component } from "../core/component.js";

const FACE = {
  dark: "var(--color-surface-dark)",
  light: "var(--color-canvas)",
  soft: "var(--color-canvas-soft)",
  primary: "var(--color-primary)",
};

export class BandDivider extends Component {
  static tag = "div";
  static root = "divider";

  isEmpty() {
    return false;
  }

  afterRender() {
    const p = this.props;
    this.el.style.setProperty("--divider-from", FACE[p.from] || FACE.dark);
    this.el.style.setProperty("--divider-to", FACE[p.to] || FACE.light);
    this.el.classList.toggle("divider--flip", !!p.flip);
    this.el.setAttribute("aria-hidden", "true");
  }

  /* 아래 면(to)을 밴드 배경으로 깔고, 그 위에 위 면(from) 색의 삼각형을
     얹는다. 삼각형 하나로 끝나므로 두 면이 어떤 색이든 이음매가 없다. */
  template() {
    return `<div class="divider__wedge"></div>`;
  }
}
