/**
 * page.js — 선언적 페이지 매니페스트를 렌더링한다.
 *
 * 페이지는 코드가 아니라 데이터다. `src/pages/home.js`가 섹션 목록을 내보내면
 * 이 렌더러가 각 섹션을 마운트하고, 리소스를 받아와 주입한다.
 * 페이지 추가 = 매니페스트 하나 더 작성 (컴포넌트는 그대로 재사용).
 *
 * 매니페스트 항목 구조:
 * {
 *   component: HeroBanner,       // Component 하위 클래스
 *   target:    'main',           // 'main' | 'header' | 'footer' | 'rail'  (기본값 'main')
 *   resource:  'hero.slides',    // 선택 — DataClient.get()에 넘길 키
 *   params:    { limit: 3 },     // 선택 — 리소스 쿼리 파라미터
 *   props:     { title: '…' },   // 정적 표시용 props
 *   optional:  true,             // 조회 실패해도 페이지 렌더링은 계속 진행
 * }
 */
import { observeIn } from './reveal.js';

export class Page {
  /**
   * @param {object}      manifest  { sections: [...] }
   * @param {DataClient}  client
   * @param {object}      targets   대상 이름 -> DOM 엘리먼트 맵
   * @param {object}      [context] 라우터가 넘기는 값. 모든 섹션의 props에
   *                                그대로 합쳐진다 (예: { route: { path, query } }).
   */
  constructor(manifest, client, targets, context = {}) {
    this.manifest = manifest;
    this.client = client;
    this.targets = targets;
    this.context = context;
    this.sections = [];
  }

  /** 모든 섹션을 동기적으로 마운트(로딩 상태)한 뒤 비동기로 채운다. */
  async render() {
    for (const entry of this.manifest.sections) {
      const target = this.targets[entry.target || 'main'];
      if (!target) {
        console.warn(`[Page] unknown target "${entry.target}" for ${entry.component?.name}`);
        continue;
      }
      const instance = new entry.component({ ...(entry.props || {}), ...this.context });
      instance.mount(target);
      observeIn(instance.el);
      this.sections.push({ entry, instance });
    }

    await this.hydrate();
    return this;
  }

  /** 선언된 리소스를 병렬로 받아와 결과를 주입한다. */
  async hydrate() {
    await Promise.all(this.sections.map(async ({ entry, instance }) => {
      if (!entry.resource) {
        // 정적 섹션: 조회할 게 없으니 props 그대로 ready 처리.
        instance.setData(entry.props?.data ?? {});
        observeIn(instance.el);
        return;
      }
      try {
        // extra: { propName: 'resource.key' } — 한 섹션이 보조 리소스를 더
        // 받아야 할 때(뉴스 섹션의 프로모 사이드바 등) props로 주입한다.
        if (entry.extra) {
          const pairs = await Promise.all(
            Object.entries(entry.extra).map(async ([prop, res]) =>
              [prop, await this.client.get(res).catch(() => null)])
          );
          Object.assign(instance.props, Object.fromEntries(pairs));
        }
        const data = await this.client.get(entry.resource, entry.params);
        instance.setData(data);
      } catch (err) {
        console.error(`[Page] "${entry.resource}" failed`, err);
        if (entry.optional) instance.setData(null);
        else instance.setError(err);
      }
      observeIn(instance.el);
    }));
  }

  /** 리소스 하나만 다시 받아와 해당 섹션만 갱신한다. */
  async refresh(resource) {
    this.client.invalidate(resource);
    await Promise.all(
      this.sections
        .filter(s => s.entry.resource === resource)
        .map(async ({ entry, instance }) => {
          instance.setLoading();
          try { instance.setData(await this.client.get(entry.resource, entry.params)); }
          catch (err) { instance.setError(err); }
          observeIn(instance.el);
        })
    );
  }

  destroy() {
    this.sections.forEach(s => s.instance.destroy());
    this.sections = [];
  }
}
