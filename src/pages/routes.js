/**
 * routes.js — 경로 하나당 매니페스트 하나. 라우터가 읽는 유일한 표다.
 *
 * 페이지를 추가할 때 손대는 곳은 여기와 `src/pages/<이름>.js` 둘뿐이다.
 * `title`은 <title> 태그에 "… | 레인보우브레인" 형태로 들어간다.
 */
import { homePage } from "./home.js";
import { aboutPage } from "./about.js";
import { servicesPage } from "./services.js";
import { solutionsPage } from "./solutions.js";
import { casesPage } from "./cases.js";
import { notFoundPage } from "./notFound.js";

export const routes = [
  {
    path: "/",
    title: "",
    description:
      "레인보우브레인은 생성형 AI, RAG, RPA 기반의 지능형 업무 자동화 전문기업입니다.",
    manifest: homePage,
  },
  {
    path: "/about",
    title: "회사소개",
    description:
      "레인보우브레인의 미션, 일하는 방식, 연혁과 오시는 길을 소개합니다.",
    manifest: aboutPage,
  },
  {
    path: "/services",
    title: "서비스",
    description:
      "생성형 AI · RAG · RPA · 데이터 · 지능형 문서처리 · AI 거버넌스 — 진단부터 운영까지 제공하는 서비스입니다.",
    manifest: servicesPage,
  },
  {
    path: "/solutions",
    title: "솔루션",
    description:
      "유레카 GenAI, 유레카 BOX, RPA 플랫폼 — 폐쇄망 설치를 전제로 만든 자사 솔루션입니다.",
    manifest: solutionsPage,
  },
  {
    path: "/cases",
    title: "구축사례",
    description:
      "금융 · 제조 · 공공 · 서비스 분야에서 진행한 AI 및 자동화 구축 사례입니다.",
    manifest: casesPage,
  },
];

export const notFoundRoute = {
  path: "*",
  title: "준비 중",
  manifest: notFoundPage,
};
