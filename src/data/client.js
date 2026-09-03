/**
 * client.js — UI와 데이터 소스를 잇는 단일 통로.
 *
 * 컴포넌트는 직접 조회하지 않고 `Component.setData()`로 데이터를 받는다.
 * `DataClient.get()`을 호출하는 곳은 `Page` 뿐이다. 그래서 백엔드 교체는
 * src/main.js 한 줄 수정으로 끝난다.
 *
 *   const client = new DataClient(new MockAdapter());              // 현재
 *   const client = new DataClient(new RestAdapter({ baseUrl }));   // DB 연동 시
 */
import { validate } from './schema.js';

export class DataClient {
  constructor(adapter, { cache = true } = {}) {
    this.adapter = adapter;
    this.cacheEnabled = cache;
    this._cache = new Map();
    this._inflight = new Map();
  }

  _key(resource, params) {
    return params ? `${resource}?${JSON.stringify(params)}` : resource;
  }

  /**
   * 리소스를 조회한다. 동일한 동시 호출은 하나로 합치고 결과를 캐싱하므로
   * 두 섹션이 요청 하나를 공유할 수 있다.
   * @returns {Promise<any>}
   */
  async get(resource, params) {
    const key = this._key(resource, params);

    if (this.cacheEnabled && this._cache.has(key)) return this._cache.get(key);
    if (this._inflight.has(key)) return this._inflight.get(key);

    const promise = Promise.resolve(this.adapter.fetch(resource, params))
      .then((data) => {
        const checked = validate(resource, data);
        if (this.cacheEnabled) this._cache.set(key, checked);
        return checked;
      })
      .finally(() => this._inflight.delete(key));

    this._inflight.set(key, promise);
    return promise;
  }

  /** 캐시를 비워 다음 get()에서 다시 조회하게 한다. */
  invalidate(resource) {
    if (!resource) { this._cache.clear(); return; }
    for (const key of [...this._cache.keys()]) {
      if (key === resource || key.startsWith(`${resource}?`)) this._cache.delete(key);
    }
  }

  /** 런타임에 백엔드 교체 (예: 기능 플래그로 mock -> 실서비스 전환). */
  setAdapter(adapter) {
    this.adapter = adapter;
    this.invalidate();
  }
}

/**
 * Adapter 인터페이스 — 새 백엔드는 이 메서드 하나만 구현하면 된다.
 * @interface
 */
export class Adapter {
  /**
   * @param {string} resource  예: 'news.list'
   * @param {object} [params]  예: { limit: 7 }
   * @returns {Promise<any>|any}
   */
  fetch(resource, params) { // eslint-disable-line no-unused-vars
    throw new Error('Adapter.fetch() not implemented');
  }
}
