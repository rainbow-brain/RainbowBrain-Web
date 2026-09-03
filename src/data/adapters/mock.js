/**
 * mock.js — DB가 준비되기 전까지 사용하는 어댑터.
 *
 * 기본 동작: 모든 리소스에 EMPTY를 반환한다. 그래서 페이지는 실제 구조를
 * 스켈레톤과 빈 상태로 그리고, 임시 더미 문구는 넣지 않는다.
 * 요청받은 "구조만, 내용은 비움" 상태.
 *
 * 화면 확인이 필요하면 시드 데이터를 넣을 수 있다:
 *   new MockAdapter({ seed: sampleData, latency: 400 })
 * `src/data/sample.js`에 간단한 샘플 데이터가 들어 있다.
 */
import { Adapter } from '../client.js';
import { EMPTY } from '../schema.js';

export class MockAdapter extends Adapter {
  /**
   * @param {object}  [options]
   * @param {object}  [options.seed]     리소스 -> 데이터. EMPTY보다 우선한다
   * @param {number}  [options.latency]  지연 시뮬레이션 (ms)
   */
  constructor({ seed = {}, latency = 0 } = {}) {
    super();
    this.seed = seed;
    this.latency = latency;
  }

  async fetch(resource, params) {
    if (this.latency) await new Promise(r => setTimeout(r, this.latency));

    const payload = resource in this.seed
      ? this.seed[resource]
      : (resource in EMPTY ? EMPTY[resource] : null);

    if (payload === null || payload === undefined) return payload;

    // `limit` 파라미터 지원 — 컴포넌트가 표시할 개수만 요청할 수 있게.
    if (Array.isArray(payload) && params?.limit) {
      return payload.slice(0, params.limit);
    }
    return payload;
  }
}
