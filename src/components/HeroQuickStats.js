/**
 * HeroQuickStats — 히어로 아래에 따로 떠 있는 성과 지표 카드의 마크업.
 *
 * 현대차 메인의 "빠른 메뉴" 카드와 같은 자리다. 배너 판과 붙어 있지 않고,
 * 자기 면과 테두리를 가진 별개의 판이 배너 밑에 한 칸 띄워 놓인다.
 * 배너는 계속 넘어가고 이 값은 고정이므로, 눈에 보이는 상자부터 갈라
 * 놓는 것이 맞다.
 *
 * ── 왜 Component가 아니라 마크업 함수인가 ──────────────────────────────
 * 배너는 sticky 무대(.spine__stage) 안에 들어 있고, 무대 아래로는 활주로
 * 500px가 이어진다. 이 카드를 home.js의 독립 섹션으로 빼면 문서 흐름상
 * 활주로 *뒤*에 놓여, 첫 화면에는 안 보이고 배너를 다 지나친 뒤에야
 * 나타난다 — 사진의 배치가 아니게 된다. 그래서 무대 안에 배너와 나란히
 * 두되, 만드는 코드만 이 파일로 떼어 냈다.
 *
 * 히어로의 sticky·활주로를 걷어내면 그때는 진짜 독립 섹션으로 옮길 수 있다.
 */
import { esc } from "../core/dom.js";

/**
 * stats.list의 중첩 figures를 대표 숫자 목록으로 편다.
 *
 * StatCard 하나가 figures를 여럿 들고 있어서, 카드 단위로 세면 넷을
 * 채우기 전에 목록이 끝난다. 카드를 건너뛰며 figure를 먼저 긁는다.
 */
function flatten(items, max) {
  const out = [];
  for (const item of items) {
    for (const f of item.figures || []) {
      out.push({ value: f.value, label: f.caption || item.label || "" });
      if (out.length >= max) return out;
    }
  }
  return out;
}

/**
 * 카드 마크업을 문자열로 돌려준다. 지표가 없으면 빈 문자열 —
 * 껍데기만 남은 판이 배너 밑에 떠 있는 것보다 아예 없는 편이 낫다.
 *
 * @param {{items?: Array}} stats  'stats.list' 응답
 * @param {number} max             실을 개수
 */
export function heroQuickStats(stats, max = 4) {
  const items = Array.isArray(stats?.items) ? stats.items : [];
  if (!items.length) return "";

  const figures = flatten(items, max);
  if (!figures.length) return "";

  /* 카운트업은 걸지 않는다. 첫 화면이라 페이지가 열리는 순간 이미 보이고
     있어, 숫자가 0에서 올라가는 동안은 아무 값도 읽히지 않는다. 화면에
     들어오는 순간을 잡을 수 없는 자리에서는 최종값을 처음부터 보여준다. */
  return `
    <dl class="quick-stats">
      ${figures
        .map(
          (s) => `
        <div class="quick-stats__item">
          <dt class="quick-stats__value">${esc(s.value)}</dt>
          <dd class="quick-stats__label">${esc(s.label)}</dd>
        </div>`,
        )
        .join("")}
    </dl>`;
}
