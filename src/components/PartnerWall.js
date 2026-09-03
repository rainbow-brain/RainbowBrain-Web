/**
 * PartnerWall — 협력사 마퀴.
 *
 * 히어로 아래 네이비가 흰색으로 넘어간 자리에 놓인다. 그래서 밴드는
 * 흰 면이고, 워드마크는 회색으로 가라앉힌 뒤 호버에서만 남색이 된다.
 *
 * 이전 버전은 정적 4열 로고 그리드였지만, 목업 1a는 좌측 정렬 인라인 헤딩 +
 * 가로로 흐르는 워드마크 마퀴다. 목록을 두 벌 이어 붙이고 -50%까지 이동시켜
 * 이음매 없이 순환시킨다.
 *
 * 접근성: 복제본은 aria-hidden으로 감춰 스크린리더가 두 번 읽지 않게 하고,
 * prefers-reduced-motion이면 애니메이션을 멈추고 줄바꿈 목록으로 바꾼다.
 *
 * 리소스: 'partners.list' -> { headline, note, items: Partner[] }
 */
import { Component } from '../core/component.js';
import { html, esc, escUrl } from '../core/dom.js';

export class PartnerWall extends Component {
  static tag = 'section';
  static root = 'band band--light partners';

  isEmpty(data) { return !data || !(data.items || []).length; }

  template(state) {
    const p = this.props;
    const d = state.data || {};

    // 공백 문자열은 "비어 있음"으로 본다. 운영에서 제목을 지울 때 필드를
    // 통째로 비우지 않고 스페이스 한 칸을 남기는 일이 잦은데, 그러면
    // 높이 0짜리 <h2>에 margin-bottom 44px만 남아 로고 위에 빈 자리가 생긴다.
    const title = String(d.headline || p.title || '').trim();
    const note = String(d.note || p.subtitle || '').trim();
    const head = (title || note) ? `
      <div class="container partners__head" data-reveal="up">
        ${title ? html`<h2 class="partners__title">${title}</h2>`.trim() : ''}
        ${note ? html`<p class="partners__note">${note}</p>`.trim() : ''}
      </div>` : '';

    if (state.status === 'loading') {
      return `${head}<div class="container"><div class="skeleton" style="height:40px"></div></div>`;
    }
    if (state.status === 'empty') {
      return `${head}<div class="container"><div class="empty-state t-body-md">등록된 파트너가 없습니다.</div></div>`;
    }

    const marks = (d.items || []).map(item => {
      const label = `<span class="partners__mark">${esc(item.name || '')}</span>`;
      return item.href ? `<a class="partners__link" href="${escUrl(item.href)}">${label}</a>` : label;
    }).join('');

    // 한 벌 + 복제본. 복제본은 보조기술에서 감춘다.
    return `
      ${head}
      <div class="partners__viewport">
        <div class="partners__track">
          <div class="partners__set">${marks}</div>
          <div class="partners__set" aria-hidden="true">${marks}</div>
        </div>
      </div>`;
  }
}
