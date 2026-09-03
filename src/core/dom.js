/**
 * dom.js — 모든 컴포넌트가 공유하는 작은 DOM/HTML 헬퍼.
 * 의존성 없음. 사이트 고유 로직도 없음.
 */

/** HTML 템플릿에 안전하게 삽입하도록 값을 이스케이프한다. */
export function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** URL 이스케이프. DB 값에 섞인 javascript:/data: 스킴을 차단한다. */
export function escUrl(value) {
  if (!value) return '';
  const s = String(value).trim();
  if (/^(javascript|data|vbscript):/i.test(s)) return '';
  return esc(s);
}

/** 모든 삽입값을 이스케이프하는 태그드 템플릿. 항상 html`...` 을 사용할 것. */
export function html(strings, ...values) {
  return strings.reduce((out, str, i) => {
    const v = values[i - 1];
    return out + (v && v.__raw ? v.value : esc(v)) + str;
  });
}

/** 이미 만들어진 HTML 문자열을 이스케이프에서 제외 (자체 마크업 전용). */
export function raw(value) {
  return { __raw: true, value: value ?? '' };
}

/** HTML 문자열 배열을 하나로 합친다. */
export function join(parts, sep = '') {
  return raw(parts.filter(Boolean).map(p => (p && p.__raw ? p.value : p)).join(sep));
}

/** 고정 비율 프레임 안에 <img>를 렌더. 이미지가 없으면 스켈레톤 표시. */
export function mediaFrame(image, { ratio = '16x9', className = '', eager = false } = {}) {
  const src = escUrl(image?.url);
  const alt = esc(image?.alt || '');
  const inner = src
    ? `<img src="${src}" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`
    : `<div class="skeleton" style="position:absolute;inset:0"></div>`;
  return raw(`<div class="media media--${ratio} ${className}">${inner}</div>`);
}

/** ISO 날짜를 YYYY.MM.DD 형식으로 변환 (사이트 표기 규칙). */
export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

/** HTML 문자열로 DOM 엘리먼트를 만든다. */
export function fromHTML(str) {
  const t = document.createElement('template');
  t.innerHTML = str.trim();
  return t.content.firstElementChild;
}

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
