/**
 * shell.js — 모든 페이지가 공유하는 껍데기(헤더 · 푸터 · 플로팅 레일).
 *
 * 라우터는 `main` 안의 페이지만 갈아 끼우고 이 셸은 건드리지 않는다.
 * 페이지마다 헤더를 다시 그리면 데이터가 캐시에서 오더라도 한 프레임은
 * 빈 바가 보인다 — 이동할 때마다 상단이 깜빡이는 원인이 된다.
 */
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import { FloatRail } from "../components/FloatRail.js";

export const shellPage = {
  id: "shell",
  sections: [
    {
      component: SiteHeader,
      target: "header",
      resource: "nav.menu",
      props: { brand: "RAINBOW BRAIN" },
      optional: true,
    },
    {
      component: SiteFooter,
      target: "footer",
      resource: "footer.info",
      props: { brand: "RAINBOW BRAIN" },
      optional: true,
    },
    {
      component: FloatRail,
      target: "rail",
      resource: "rail.items",
      optional: true,
    },
  ],
};
