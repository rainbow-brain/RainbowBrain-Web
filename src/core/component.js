/**
 * component.js — 모든 섹션이 상속하는 베이스 클래스.
 *
 * 규약 (컴포넌트 작성에 필요한 API 전부):
 *
 *   class MySection extends Component {
 *     static tag  = 'section';           // 루트 엘리먼트 태그
 *     static root = 'band band--light';  // 루트 className
 *
 *     template(state) { ... HTML 문자열 반환 ... }      // 필수
 *     afterRender() {}                                 // 선택, 매 렌더 후 실행
 *     bind() {}                                        // 선택, 마운트 시 1회만 실행
 *     onDestroy() {}                                   // 선택, 정리 작업
 *   }
 *
 * 상태 흐름: 'loading' -> 'ready' | 'empty' | 'error'.
 * DB 응답 전에 레이아웃이 먼저 잡히도록 'loading' 상태로 즉시 렌더하고,
 * `setData()`가 레이아웃 흔들림 없이 실제 내용으로 교체한다.
 *
 * 재렌더는 `root.innerHTML`만 교체한다. 루트 엘리먼트는 유지되므로
 * `bind()`에서 건 위임 리스너는 갱신 후에도 계속 살아 있다.
 */
export class Component {
  static tag = "section";
  static root = "";

  constructor(props = {}) {
    this.props = props;
    this.el = null;
    this.state = { status: "loading", data: props.data ?? null, error: null };
    this._bound = false;
    this._cleanups = [];
  }

  /* ---- 라이프사이클 ------------------------------------------------------ */

  // DOM 요소를 만들고 화면에 붙임
  mount(target) {
    const Ctor = this.constructor;
    this.el = document.createElement(Ctor.tag);
    if (Ctor.root) this.el.className = Ctor.root;
    if (this.props.id) this.el.id = this.props.id;
    if (this.props.className)
      this.el.classList.add(...this.props.className.split(" "));

    this.render();
    target.appendChild(this.el);

    if (!this._bound) {
      this.bind?.();
      this._bound = true;
    }
    return this;
  }

  // template(state) 결과를 innerHTML로 그림
  render() {
    if (!this.el) return this;
    this.el.innerHTML = this.template(this.state) ?? "";
    this.afterRender?.();
    return this;
  }

  /**
   * DataClient에서 받아온 데이터를 주입한다.
   * `isEmpty()`로 `empty`/`ready`를 판단하며, 하위 클래스에서 재정의 가능.
   */
  setData(data) {
    this.state.data = data;
    this.state.error = null;
    this.state.status = this.isEmpty(data) ? "empty" : "ready";
    this.render();
    return this;
  }

  setError(error) {
    this.state.error = error;
    this.state.status = "error";
    this.render();
    return this;
  }

  setLoading() {
    this.state.status = "loading";
    this.render();
    return this;
  }

  isEmpty(data) {
    if (data === null || data === undefined) return true;
    if (Array.isArray(data)) return data.length === 0;
    if (typeof data === "object") return Object.keys(data).length === 0;
    return false;
  }

  // 이벤트, 타이머, DOM 정리
  destroy() {
    this.onDestroy?.();
    this._cleanups.forEach((fn) => fn());
    this._cleanups = [];
    this.el?.remove();
    this.el = null;
  }

  /* ---- 하위 클래스용 헬퍼 ------------------------------------------------ */

  /** 유지되는 루트에 거는 위임 리스너. 재렌더에도 살아남는다. */
  on(type, selector, handler) {
    const fn = (ev) => {
      const match = ev.target.closest(selector);
      if (match && this.el.contains(match)) handler(ev, match);
    };
    this.el.addEventListener(type, fn);
    this._cleanups.push(() => this.el?.removeEventListener(type, fn));
  }

  /** 정리 작업 등록 (타이머, 옵저버, window 리스너 등). */
  cleanup(fn) {
    this._cleanups.push(fn);
  }

  template() {
    throw new Error(`${this.constructor.name} must implement template(state)`);
  }
}
