/**
 * rest.js — DB/API가 준비된 뒤 사용할 어댑터.
 *
 * URL 구조를 아는 파일은 여기뿐이다. 백엔드에 맞춰 ENDPOINTS만 수정하면
 * 컴포넌트는 그대로 동작한다.
 *
 *   // src/main.js
 *   import { RestAdapter } from './data/adapters/rest.js';
 *   const client = new DataClient(new RestAdapter({ baseUrl: '/api' }));
 *
 * `unwrap` 훅은 국내 CMS/API가 보통 { code, message, data } 형태로 응답을
 * 감싸기 때문에 둔 것이다. 실제 API 응답 형태에 맞춰 지정하면 된다.
 */
import { Adapter } from '../client.js';

/** 리소스 키 -> { path, method?, transform? } */
export const ENDPOINTS = {
  'nav.menu':          { path: '/navigation' },
  'hero.slides':       { path: '/banners/hero' },
  'news.list':         { path: '/news' },
  'promotions.list':   { path: '/banners/promotions' },
  'cases.list':        { path: '/cases' },
  'capabilities.list': { path: '/capabilities' },
  'challenges.list':   { path: '/challenges' },
  'partners.list':     { path: '/partners' },
  'stats.list':        { path: '/stats' },
  'cta.report':        { path: '/cta/report' },
  'cta.closing':       { path: '/cta/closing' },
  'footer.info':       { path: '/footer' },
  'rail.items':        { path: '/rail' },

  /* 하위 페이지 */
  'about.intro':       { path: '/about/intro' },
  'about.values':      { path: '/about/values' },
  'about.history':     { path: '/about/history' },
  'about.location':    { path: '/about/location' },
  'services.list':     { path: '/services' },
  'services.process':  { path: '/services/process' },
  'solutions.list':    { path: '/solutions' },
  'solutions.rollout': { path: '/solutions/rollout' },
};

export class RestAdapter extends Adapter {
  /**
   * @param {object}   options
   * @param {string}   options.baseUrl            예: '/api' 또는 'https://api.rbrain.co.kr/v1'
   * @param {object}   [options.headers]
   * @param {Function} [options.unwrap]           (json) => payload
   * @param {number}   [options.timeout=10000]
   */
  constructor({ baseUrl, headers = {}, unwrap = (json) => (json?.data ?? json), timeout = 10000 } = {}) {
    super();
    this.baseUrl = String(baseUrl || '').replace(/\/$/, '');
    this.headers = headers;
    this.unwrap = unwrap;
    this.timeout = timeout;
  }

  async fetch(resource, params) {
    const endpoint = ENDPOINTS[resource];
    if (!endpoint) throw new Error(`[RestAdapter] no endpoint mapped for "${resource}"`);

    const url = new URL(this.baseUrl + endpoint.path, window.location.origin);
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeout);

    try {
      const res = await window.fetch(url.toString(), {
        method: endpoint.method || 'GET',
        headers: { Accept: 'application/json', ...this.headers },
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`[RestAdapter] ${resource} -> HTTP ${res.status}`);
      const json = await res.json();
      const payload = this.unwrap(json);
      return endpoint.transform ? endpoint.transform(payload) : payload;
    } finally {
      clearTimeout(timer);
    }
  }
}
