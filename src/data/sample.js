/**
 * sample.js — 선택적 미리보기 데이터. `?preview=1`일 때만 로드된다.
 *
 * 레이아웃 확인용이며 실서비스 콘텐츠가 아니다. 실제 API를 연결하면
 * 이 파일과 main.js의 동적 import를 함께 삭제하면 된다.
 * schema.js에 정의된 모든 데이터 구조의 예시 역할도 겸한다.
 *
 * 이미지는 인라인 SVG data URI라서 미리보기에 네트워크나 에셋 빌드가
 * 필요 없다.
 */

/** 브랜드 색을 입힌 인라인 생성 플레이스홀더 이미지. */
function ph(label, from = "#001543", to = "#001C88", w = 1600, h = 900) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <g fill="rgba(255,255,255,.10)">
      <circle cx="${w * 0.82}" cy="${h * 0.24}" r="${h * 0.3}"/>
      <circle cx="${w * 0.18}" cy="${h * 0.86}" r="${h * 0.22}"/>
    </g>
    <text x="50%" y="52%" text-anchor="middle" fill="rgba(255,255,255,.55)"
          font-family="sans-serif" font-size="${Math.round(h * 0.07)}" font-weight="700">${label}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const img = (label, alt, from, to) => ({
  url: ph(label, from, to),
  alt: alt || label,
});

export const sample = {
  /* 주 메뉴 — children이 있으면 헤더에 메가 메뉴 패널이 열린다.
     children이 없는 항목은 패널 없이 링크로만 동작한다. */
  "nav.menu": {
    items: [
      {
        label: "회사소개",
        href: "#/about",
        children: [
          { label: "회사 개요", href: "#/about", note: "미션과 사업 영역" },
          { label: "연혁", href: "#/about?to=history", note: "2016년부터의 기록" },
          { label: "오시는 길", href: "#/about?to=location", note: "서울 금천구" },
          { label: "채용", href: "#/careers", note: "함께할 사람을 찾습니다" },
        ],
      },
      {
        label: "서비스",
        href: "#/services",
        children: [
          { label: "생성형 AI", href: "#/services?to=genai", note: "도입 컨설팅부터 구축까지" },
          { label: "RAG", href: "#/services?to=rag", note: "사내 문서 지식베이스" },
          { label: "RPA", href: "#/services?to=rpa", note: "업무 자동화 설계·운영" },
          { label: "데이터", href: "#/services?to=data", note: "파이프라인·품질 진단" },
          { label: "지능형 문서처리", href: "#/services?to=idp", note: "IDP" },
          { label: "AI 거버넌스", href: "#/services?to=governance", note: "보안·규제 대응" },
        ],
      },
      {
        label: "솔루션",
        href: "#/solutions",
        children: [
          { label: "유레카 GenAI", href: "#/solutions?to=eureka-genai", note: "기업 특화 AI 업무 지원" },
          { label: "유레카 BOX", href: "#/solutions?to=eureka-box", note: "폐쇄망 문서 검색" },
          { label: "RPA 플랫폼", href: "#/solutions?to=rpa-platform", note: "클라우드 RPA" },
        ],
      },
      {
        label: "구축사례",
        href: "#/cases",
        children: [
          { label: "금융", href: "#/cases?cat=%EA%B8%88%EC%9C%B5" },
          { label: "제조", href: "#/cases?cat=%EC%A0%9C%EC%A1%B0" },
          { label: "공공", href: "#/cases?cat=%EA%B3%B5%EA%B3%B5" },
          { label: "서비스", href: "#/cases?cat=%EC%84%9C%EB%B9%84%EC%8A%A4" },
        ],
      },
    ],
    actions: [
      { label: "자료 다운로드", href: "#/resources" },
      { label: "도입 문의", href: "#/contact", variant: "primary" },
    ],
  },

  "hero.slides": [
    {
      id: "h1",
      introEyebrow: "CASE STUDY · FINANCE",
      statement: "금융 상담\n매뉴얼을\n3초만에\n답변으로",
      eyebrow: "구축 사례",
      title: "금융권 생성형 AI 상담 어시스턴트 구축 완료",
      description:
        "1,000여 개 업무 매뉴얼을 RAG로 연결해 상담사가 3초 안에 근거 있는 답을 찾습니다.",
      image: img(
        "AI Assistant",
        "상담 어시스턴트 구축 현장",
        "#001543",
        "#53009C",
      ),
      frame: {
        url: "./assets/videos/category2_document_intelligence_ai_demo.html",
        title: "문서 지능화 AI 데모",
      },
      actions: [
        { label: "사례 자세히 보기", href: "#/cases/1", variant: "primary" },
        { label: "기술백서 받기", href: "#/resources", variant: "secondary" },
      ],
    },
    {
      id: "h2",
      introEyebrow: "RPA PARTNERSHIP",
      statement: "검증된\nRPA 플랫폼\n자동화를\n끝까지",
      eyebrow: "파트너십",
      title: "클라우드 RPA 시장 점유율 1위 플랫폼의 국내 파트너",
      description: "자동화 진단부터 설계·구축·운영까지 전 과정을 함께합니다.",
      image: img("Automation 360", "RPA 자동화 플랫폼", "#001543", "#001C88"),
      frame: {
        url: "./assets/videos/integrated_manufacturing_ax_demo_preserved_intro.html",
        title: "제조업 AX 통합 자동화 데모",
      },
      actions: [
        {
          label: "플랫폼 살펴보기",
          href: "#/solutions?to=rpa-platform",
          variant: "primary",
        },
      ],
    },
    {
      id: "h3",
      introEyebrow: "EUREKA GenAI",
      statement: "사내 문서를\n업무 전문가 AI로 연결합니다",
      eyebrow: "유레카 GenAI",
      title: "도메인 특화 기업형 AI 플랫폼",
      description:
        "사내 문서를 그대로 학습해 업무 전문가 수준의 답변을 제공합니다.",
      image: img("Eureka GenAI", "기업형 AI 플랫폼", "#001543", "#53009C"),
      frame: {
        url: "./assets/videos/category1_field_operations_ai_demo.html",
        title: "현장 업무 지원 AI 데모",
      },
      actions: [
        { label: "체험 신청하기", href: "#/trial", variant: "primary" },
        {
          label: "자세히 보기",
          href: "#/solutions?to=eureka-genai",
          variant: "secondary",
        },
      ],
    },
  ],

  "news.list": [
    {
      id: "n1",
      title: "AI 쇼핑 시대, 유통 매출은 어떻게 달라졌나",
      category: "인사이트",
      source: "RAINBOW BRAIN",
      publishedAt: "2026-08-04",
      excerpt:
        "검색에서 대화로 넘어간 구매 여정이 상품 노출과 전환율에 만든 변화를 데이터로 정리했습니다.",
      image: img("Retail AI", "", "#001543", "#001C88"),
      href: "#/news/1",
    },
    {
      id: "n2",
      title: "자체 개발 AI 기반 보안 관제 서비스 출시",
      category: "뉴스",
      source: "RAINBOW BRAIN",
      publishedAt: "2026-07-28",
      excerpt: "탐지부터 대응까지 자동화한 관제 서비스를 공개했습니다.",
      href: "#/news/2",
    },
    {
      id: "n3",
      title: "생성형 AI 도입 기업 대상 무상 진단 프로그램 시작",
      category: "뉴스",
      source: "RAINBOW BRAIN",
      publishedAt: "2026-07-21",
      excerpt: "도입 타당성과 우선순위를 2주 만에 진단해드립니다.",
      href: "#/news/3",
    },
    {
      id: "n4",
      title: "업스테이지와 인공지능 사업 파트너십 체결",
      category: "뉴스",
      source: "RAINBOW BRAIN",
      publishedAt: "2026-07-10",
      excerpt: "국내 LLM 역량을 결합해 산업별 특화 모델을 제공합니다.",
      href: "#/news/4",
    },
    {
      id: "n5",
      title: "피지컬 AI 시대, 제조업이 지금 준비해야 할 것",
      category: "인사이트",
      publishedAt: "2026-06-30",
      excerpt: "설비 데이터와 생성형 AI를 잇는 실행 로드맵을 제시합니다.",
      image: img("Physical AI", "", "#001543", "#53009C"),
      href: "#/news/5",
    },
    {
      id: "n6",
      title: "레디 데이터(Ready Data)란? AI가 쓸 수 있는 데이터의 조건",
      category: "인사이트",
      publishedAt: "2026-06-18",
      excerpt: "20년 치 문서가 그대로 자산이 되지는 않습니다.",
      image: img("Ready Data", "", "#001543", "#001C88"),
      href: "#/news/6",
    },
    {
      id: "n7",
      title: "CTO 인터뷰 — 생성형 AI 실전 도입 전략",
      category: "뉴스",
      publishedAt: "2026-06-02",
      excerpt: "PoC에서 멈추지 않는 조직의 공통점을 짚었습니다.",
      image: img("Interview", "", "#001543", "#53009C"),
      href: "#/news/7",
    },
  ],

  "promotions.list": [
    {
      id: "p1",
      eyebrow: "RPA EDUCATION",
      title: "RPA 원리가 궁금한 모든 분께",
      description:
        "이론만으로는 감이 오지 않는 자동화, 직접 만들어보며 익히는 실습형 교육 과정을 운영합니다.",
      action: { label: "RPA 교육 신청하기", href: "#/education" },
      accent: "blue",
    },
    {
      id: "p2",
      eyebrow: "EUREKA GenAI",
      title: "필수가 된 AI 기술 LLM",
      description: "기업 특화 AI 업무 지원 솔루션 유레카GenAI를 경험해 보세요.",
      action: { label: "체험 신청하기", href: "#/trial" },
      accent: "violet",
    },
    {
      id: "p3",
      eyebrow: "NEWSLETTER",
      title: "한 달에 한 번, 현장에서 검증된 자동화 이야기",
      description:
        "생생한 구축 사례와 AI 업계 소식을 메일로 정리해 보내드립니다.",
      action: { label: "뉴스레터 구독하기", href: "#/newsletter" },
      accent: "blue",
    },
  ],

  "cases.list": [
    {
      id: "c1",
      title: "생명보험사 생성형 AI 상담 어시스턴트 구축",
      category: "금융",
      publishedAt: "2026-07-30",
      excerpt:
        "1,000여 종의 상품 약관을 RAG로 연결해 상담 응대 시간을 62% 단축했습니다.",
      image: img("Insurance", "", "#001543", "#53009C"),
      href: "#/cases/1",
    },
    {
      id: "c2",
      title: "수출 부가세 신고 데이터 검증 자동화",
      category: "제조",
      publishedAt: "2026-07-12",
      excerpt: "지능형 문서처리로 검증 공수를 대폭 줄였습니다.",
      href: "#/cases/2",
    },
    {
      id: "c3",
      title: "컨택센터 고객 경험 향상 프로젝트",
      category: "서비스",
      publishedAt: "2026-06-25",
      excerpt: "상담 이력 요약과 실시간 가이드를 자동 생성합니다.",
      href: "#/cases/3",
    },
    {
      id: "c4",
      title: "공공기관 문서 검색 지식베이스 구축",
      category: "공공",
      publishedAt: "2026-06-11",
      excerpt: "내부 규정 검색 정확도를 크게 끌어올렸습니다.",
      href: "#/cases/4",
    },
    {
      id: "c5",
      title: "글로벌 은행 하이퍼오토메이션 도입",
      category: "금융",
      publishedAt: "2026-05-28",
      excerpt: "고객 중심 프로세스 재설계와 자동화를 병행했습니다.",
      image: img("Banking", "", "#001543", "#001C88"),
      href: "#/cases/5",
    },
    {
      id: "c6",
      title: "에너지 기업 세무 프로세스 자동화",
      category: "에너지",
      publishedAt: "2026-05-14",
      excerpt: "지능형 자동화로 연간 비용을 크게 절감했습니다.",
      image: img("Energy", "", "#001543", "#53009C"),
      href: "#/cases/6",
    },
    {
      id: "c7",
      title: "제조 라인 품질 검사 리포트 자동 생성",
      category: "제조",
      publishedAt: "2026-04-30",
      excerpt: "검사 결과를 표준 리포트로 자동 변환합니다.",
      image: img("Manufacturing", "", "#001543", "#001C88"),
      href: "#/cases/7",
    },
  ],

  "capabilities.list": [
    {
      id: "g1",
      title: "AI",
      items: [
        "생성형 AI 도입 컨설팅",
        "RAG 기반 지식베이스 설계",
        "LLM 파인튜닝 · 프롬프트 엔지니어링",
        "AI 에이전트 · MCP 연동",
      ],
    },
    {
      id: "g2",
      title: "데이터",
      items: [
        "데이터 파이프라인 구축",
        "지능형 문서처리(IDP)",
        "데이터 품질 진단 · 정제",
        "마스터 데이터 관리",
      ],
    },
    {
      id: "g3",
      title: "자동화",
      items: [
        "RPA 진단 · 설계 · 구축",
        "하이퍼오토메이션 전환",
        "업무 프로세스 재설계",
        "운영 · 유지보수",
      ],
    },
    {
      id: "g4",
      title: "보안 & 컴플라이언스",
      items: [
        "AI 거버넌스 체계 수립",
        "개인정보 비식별 처리",
        "접근 통제 · 감사 로그",
        "규제 대응 자문",
      ],
    },
  ],

  "challenges.list": [
    {
      id: "x1",
      icon: "cost",
      title: "늘어나는 비용",
      description:
        "중복 투자와 파편화된 도구로 총소유비용이 계속 증가합니다. 통합 아키텍처로 정리합니다.",
    },
    {
      id: "x2",
      icon: "ops",
      title: "운영 복잡성",
      description:
        "부서마다 다른 프로세스가 자동화를 가로막습니다. 표준 프로세스를 먼저 설계합니다.",
    },
    {
      id: "x3",
      icon: "security",
      title: "보안 · 컴플라이언스",
      description:
        "민감 정보가 외부 모델로 나가는 위험을 차단하는 구조를 함께 만듭니다.",
    },
    {
      id: "x4",
      icon: "people",
      title: "전문 인력 부족",
      description:
        "구축 이후 스스로 운영할 수 있도록 내부 역량 이전까지 지원합니다.",
    },
  ],

  "partners.list": {
    // headline: "Partnership with RAINBOW BRAIN",
    // note: "100+ 고객사 · 2,000+ 자동화 과제를 함께 수행했습니다.",
    headline: " ",
    note: " ",
    items: [
      { id: "pa1", name: "AWS", note: "클라우드 인프라" },
      { id: "pa2", name: "Google Cloud", note: "데이터 · AI" },
      { id: "pa3", name: "Microsoft Azure", note: "AI 플랫폼" },
      { id: "pa4", name: "Snowflake", note: "데이터 플랫폼" },
      { id: "pa5", name: "Automation Anywhere", note: "RPA" },
      { id: "pa6", name: "Upstage", note: "LLM" },
      { id: "pa7", name: "NVIDIA", note: "GPU 인프라" },
      { id: "pa8", name: "Databricks", note: "레이크하우스" },
    ],
  },

  "stats.list": {
    headline: "Results, Proven by Numbers",
    note: "숫자로 확인하는 도입 성과입니다.",
    items: [
      {
        id: "s1",
        label: "상담 응대 시간 단축",
        figures: [
          { value: "62%", caption: "평균 단축률" },
          { value: "3초", caption: "근거 검색" },
          { value: "1,000+", caption: "연결 문서" },
        ],
        description:
          "상담사가 약관을 직접 찾던 과정을 RAG 검색으로 대체했습니다.",
        source: "2026 금융 고객사 도입 결과",
      },
      {
        id: "s2",
        label: "문서 처리 자동화율",
        figures: [
          { value: "41%", caption: "공수 절감" },
          { value: "98%", caption: "검증 정확도" },
        ],
        description:
          "수출 부가세 신고 데이터 검증 과정에 지능형 문서처리를 적용했습니다.",
        source: "2025 제조 고객사 도입 결과",
      },
      {
        id: "s3",
        label: "자동화 과제 확산",
        figures: [
          { value: "100+", caption: "고객사" },
          { value: "2,000+", caption: "자동화 과제" },
        ],
        description: "금융·제조·공공 전반에서 축적한 구축 경험입니다.",
        source: "2016–2026 누적 실적",
      },
    ],
  },

  "cta.report": {
    eyebrow: "RAINBOW BRAIN REPORT",
    title: "지금 바로 꺼내 쓰는 AI 기술 가이드",
    description:
      "AI를 도입은 했는데, 그다음이 막막하다면. 실제 구축 현장에서 정리한 체크리스트와 아키텍처 패턴을 담았습니다.",
    image: img("AI Report", "AI 기술 가이드 리포트 표지", "#001543", "#001C88"),
    actions: [
      { label: "리포트 다운로드", href: "#/resources/report" },
      { label: "목차 미리보기", href: "#/resources", variant: "ghost" },
    ],
  },

  "cta.closing": {
    title: "전문 컨설팅으로 기업 맞춤 솔루션을 만나보세요",
    description:
      "업무 진단부터 도입 로드맵까지, 1회 무료 상담으로 시작할 수 있습니다.",
    action: { label: "도입 문의하기", href: "#/contact" },
  },

  "footer.info": {
    logo: "RAINBOW BRAIN",
    tagline: "생성형 AI · RAG · RPA 기반 지능형 업무 자동화 전문기업",
    directories: [
      {
        title: "회사",
        links: [
          { label: "회사 소개", href: "#/about" },
          { label: "오시는 길", href: "#/about?to=location" },
          { label: "채용", href: "#/careers" },
        ],
      },
      {
        title: "서비스",
        links: [
          { label: "생성형 AI", href: "#/solutions?to=eureka-genai" },
          { label: "RPA", href: "#/solutions?to=rpa-platform" },
          { label: "데이터", href: "#/services?to=data" },
        ],
      },
      {
        title: "리소스",
        links: [
          { label: "뉴스", href: "#/news" },
          { label: "구축사례", href: "#/cases" },
          { label: "뉴스레터", href: "#/newsletter" },
        ],
      },
    ],
    legal: [
      { label: "대표이사", value: "홍길동" },
      { label: "주소", value: "서울특별시 금천구 벚꽃로 298, 1507호" },
      { label: "전화", value: "070-0000-0000" },
      { label: "사업자등록번호", value: "000-00-00000" },
      { label: "통신판매업신고", value: "제0000-서울금천-0000호" },
    ],
    policyHref: "#/privacy",
    copyright: "Copyright © RAINBOW BRAIN. All Rights Reserved.",
  },

  "rail.items": [
    { id: "r1", label: "블로그", href: "#/blog" },
    { id: "r2", label: "뉴스레터", href: "#/newsletter" },
    { id: "r3", label: "유튜브", href: "#/youtube" },
    {
      id: "r4",
      label: "문의",
      href: "#/contact",
      accent: true,
      collapsible: false,
    },
  ],

  /* ══════════════════════════════════════════════════════════════════════
     하위 페이지 — 회사소개 · 서비스 · 솔루션
     구조 확인용 샘플이다. 실서비스 문구가 아니다.
     ══════════════════════════════════════════════════════════════════════ */

  "about.intro": {
    eyebrow: "WHO WE ARE",
    title: "PoC에서 멈추지 않는 자동화를 만듭니다",
    body: [
      "레인보우브레인은 2016년 RPA 전문 기업으로 시작해, 지금은 생성형 AI와 RAG를 기업의 실제 업무 흐름에 연결하는 일을 합니다. 기술을 소개하는 자리가 아니라 업무가 돌아가는 자리에서 검증합니다.",
      "도입이 멈추는 지점은 대개 모델이 아니라 데이터와 프로세스입니다. 그래서 진단 단계에서 문서 체계와 권한 구조부터 살펴보고, 자동화할 것과 하지 말아야 할 것을 먼저 나눕니다.",
      "구축이 끝나면 운영을 넘기는 것으로 끝내지 않습니다. 고객사 담당자가 직접 시나리오를 고치고 늘릴 수 있는 상태까지 함께 갑니다.",
    ],
    points: [
      { value: "2016", label: "설립", note: "RPA 전문 기업으로 출발" },
      { value: "100+", label: "고객사", note: "금융 · 제조 · 공공 · 서비스" },
      { value: "2,000+", label: "자동화 과제", note: "누적 구축 기준" },
      { value: "4", label: "사업 축", note: "AI · 데이터 · 자동화 · 거버넌스" },
    ],
    image: img("Rainbow Brain", "레인보우브레인 사무 공간", "#001543", "#53009C"),
  },

  "about.values": [
    {
      id: "v1",
      title: "업무부터 본다",
      description:
        "모델 선정보다 업무 관찰이 먼저입니다. 실제로 누가 어떤 문서를 몇 번 열어보는지 확인한 뒤에 도구를 정합니다.",
    },
    {
      id: "v2",
      title: "근거 없는 답은 답이 아니다",
      description:
        "생성형 AI 답변에는 항상 출처 문서와 위치를 붙입니다. 확인할 수 없는 답은 업무에서 쓸 수 없습니다.",
    },
    {
      id: "v3",
      title: "데이터는 밖으로 나가지 않는다",
      description:
        "폐쇄망 설치를 기본값으로 설계합니다. 외부 모델을 쓰는 경우에도 어떤 정보가 어디까지 나가는지 문서로 남깁니다.",
    },
    {
      id: "v4",
      title: "운영까지 넘긴다",
      description:
        "구축이 끝나면 담당자 교육과 문서 이관을 진행합니다. 우리 없이도 굴러가는 상태가 프로젝트의 종료 조건입니다.",
    },
  ],

  "about.history": [
    {
      id: "h2026",
      year: "2026",
      note: "생성형 AI 확산기",
      entries: [
        { month: "08", title: "AI 쇼핑 · 유통 데이터 분석 리포트 발간" },
        {
          month: "07",
          title: "업스테이지와 인공지능 사업 파트너십 체결",
          description: "국내 LLM 역량을 결합해 산업별 특화 모델을 제공합니다.",
        },
        {
          month: "05",
          title: "생명보험사 생성형 AI 상담 어시스턴트 오픈",
          description: "상담 응대 시간 62% 단축.",
        },
        { month: "02", title: "자체 개발 AI 기반 보안 관제 서비스 출시" },
      ],
    },
    {
      id: "h2025",
      year: "2025",
      note: "유레카 제품화",
      entries: [
        { month: "11", title: "유레카 BOX 폐쇄망 버전 출시" },
        {
          month: "08",
          title: "제조 고객사 수출 부가세 신고 검증 자동화 완료",
          description: "검증 공수 41% 절감.",
        },
        { month: "03", title: "유레카 GenAI 정식 출시" },
      ],
    },
    {
      id: "h2023",
      year: "2023",
      note: "AI 전환",
      entries: [
        { month: "09", title: "생성형 AI 도입 컨설팅 조직 신설" },
        { month: "04", title: "지능형 문서처리(IDP) 솔루션 사업 개시" },
      ],
    },
    {
      id: "h2020",
      year: "2020",
      note: "하이퍼오토메이션",
      entries: [
        { month: "10", title: "글로벌 은행 하이퍼오토메이션 프로젝트 수행" },
        { month: "05", title: "누적 자동화 과제 1,000건 돌파" },
      ],
    },
    {
      id: "h2016",
      year: "2016",
      note: "설립",
      entries: [
        { month: "11", title: "클라우드 RPA 플랫폼 국내 파트너 계약 체결" },
        { month: "03", title: "레인보우브레인 설립" },
      ],
    },
  ],

  "about.location": {
    name: "레인보우브레인 본사",
    address: "서울특별시 금천구 벚꽃로 298, 1507호",
    addressDetail: "우편번호 08510 · 대륭포스트타워 6차",
    contacts: [
      { label: "대표전화", value: "070-0000-0000", href: "tel:07000000000" },
      {
        label: "도입 문의",
        value: "sales@rbrain.co.kr",
        href: "mailto:sales@rbrain.co.kr",
      },
      {
        label: "채용 문의",
        value: "recruit@rbrain.co.kr",
        href: "mailto:recruit@rbrain.co.kr",
      },
      { label: "업무 시간", value: "평일 09:00 – 18:00" },
    ],
    transit: [
      { label: "지하철", description: "1호선 가산디지털단지역 4번 출구에서 도보 7분" },
      { label: "버스", description: "가산디지털단지역 정류장 하차 · 5536 · 5713 · 6512" },
      { label: "주차", description: "건물 지하 주차장 이용 (방문 시 사전 등록 필요)" },
    ],
    // 지도 SDK 키가 생기면 mapEmbed에 iframe URL을 넣는다. 그전까지는 image가 놓인다.
    mapEmbed: null,
    mapHref: "https://map.naver.com/",
    image: img("Location", "본사 위치 지도", "#001543", "#001C88", 1200, 900),
  },

  "services.list": [
    {
      id: "genai",
      code: "AI CONSULTING",
      title: "생성형 AI 도입 컨설팅",
      summary: "무엇을 자동화할지부터 정합니다. 모델 선정은 그 다음입니다.",
      description:
        "업무 관찰과 문서 실사를 거쳐 도입 후보를 추리고, 기대 효과와 위험을 같은 표에 놓고 우선순위를 정합니다. 도입하지 않는 편이 나은 업무는 그렇게 적어 드립니다.",
      deliverables: [
        "업무 진단 리포트",
        "도입 우선순위 로드맵",
        "모델 · 아키텍처 선정안",
        "예상 비용 · 효과 산정표",
      ],
      outcomes: [{ value: "2주", caption: "무상 진단 기간" }],
      tags: ["컨설팅", "PoC 설계"],
    },
    {
      id: "rag",
      code: "RAG",
      title: "RAG 기반 지식베이스 구축",
      summary: "사내 문서를 그대로 학습해 근거와 함께 답하게 만듭니다.",
      description:
        "문서 수집·정제·청킹·색인 파이프라인을 구축하고, 조직의 권한 체계를 검색 단계에 그대로 반영합니다. 모든 답변에는 출처 문서와 위치가 따라붙습니다.",
      deliverables: [
        "문서 수집 · 정제 파이프라인",
        "임베딩 · 벡터 색인 설계",
        "권한 연동 검색 API",
        "답변 품질 평가 세트",
      ],
      outcomes: [
        { value: "3초", caption: "근거 검색" },
        { value: "1,000+", caption: "연결 문서" },
      ],
      tags: ["RAG", "검색", "권한 연동"],
    },
    {
      id: "rpa",
      code: "RPA",
      title: "RPA 진단 · 설계 · 구축",
      summary: "반복 업무를 걷어내고, 남은 판단만 사람에게 남깁니다.",
      description:
        "업무 프로세스를 재설계한 뒤 자동화합니다. 기존 프로세스를 그대로 옮기면 비효율까지 함께 자동화됩니다. 운영 이관과 유지보수까지 같은 팀이 맡습니다.",
      deliverables: [
        "프로세스 재설계 문서",
        "자동화 시나리오 · 봇 구축",
        "예외 처리 · 모니터링 체계",
        "운영 담당자 교육",
      ],
      outcomes: [{ value: "2,000+", caption: "누적 자동화 과제" }],
      tags: ["RPA", "하이퍼오토메이션"],
    },
    {
      id: "data",
      code: "DATA",
      title: "데이터 파이프라인 · 품질 진단",
      summary: "AI가 쓸 수 있는 상태의 데이터를 먼저 만듭니다.",
      description:
        "20년 치 문서가 그대로 자산이 되지는 않습니다. 중복·버전 충돌·비표준 양식을 걷어내고, 마스터 데이터 기준을 세운 뒤 파이프라인을 붙입니다.",
      deliverables: [
        "데이터 품질 진단 리포트",
        "정제 · 표준화 규칙",
        "수집 · 적재 파이프라인",
        "마스터 데이터 관리 기준",
      ],
      tags: ["데이터 엔지니어링", "품질"],
    },
    {
      id: "idp",
      code: "IDP",
      title: "지능형 문서처리",
      summary: "스캔본과 표를 사람이 다시 옮겨 적지 않게 합니다.",
      description:
        "비정형 문서에서 필요한 항목만 뽑아 검증 규칙에 태웁니다. 확신이 낮은 건만 사람에게 올려 보내, 검토 대상 자체를 줄입니다.",
      deliverables: [
        "문서 유형별 추출 모델",
        "검증 규칙 · 예외 큐 설계",
        "기간계 시스템 연동",
      ],
      outcomes: [
        { value: "41%", caption: "공수 절감" },
        { value: "98%", caption: "검증 정확도" },
      ],
      tags: ["IDP", "OCR", "검증 자동화"],
    },
    {
      id: "governance",
      code: "GOVERNANCE",
      title: "AI 거버넌스 · 보안",
      summary: "무엇이 어디까지 나가는지 문서로 남깁니다.",
      description:
        "개인정보 비식별 처리, 접근 통제, 감사 로그, 모델 사용 정책을 함께 설계합니다. 규제 대응은 구축이 끝난 뒤에 붙이면 늘 비쌉니다.",
      deliverables: [
        "AI 사용 정책 · 승인 절차",
        "비식별 처리 규칙",
        "접근 통제 · 감사 로그 설계",
        "규제 대응 체크리스트",
      ],
      tags: ["보안", "컴플라이언스"],
    },
  ],

  "services.process": [
    {
      id: "p1",
      title: "무상 진단",
      description: "업무 관찰과 문서 실사로 자동화 후보를 추립니다.",
      duration: "2주",
    },
    {
      id: "p2",
      title: "설계",
      description: "아키텍처와 권한 구조, 평가 기준을 먼저 합의합니다.",
      duration: "2–4주",
    },
    {
      id: "p3",
      title: "PoC",
      description: "가장 자주 쓰는 시나리오 하나로 효과를 실제 데이터에서 확인합니다.",
      duration: "4–6주",
    },
    {
      id: "p4",
      title: "구축",
      description: "기간계 연동과 예외 처리를 포함해 운영 가능한 형태로 만듭니다.",
      duration: "8–16주",
    },
    {
      id: "p5",
      title: "안정화 · 이관",
      description: "담당자 교육과 문서 이관까지 마친 뒤 종료합니다.",
      duration: "4주",
    },
  ],

  "solutions.list": [
    {
      id: "eureka-genai",
      eyebrow: "EUREKA GenAI",
      name: "유레카 GenAI",
      tagline: "사내 문서를 업무 전문가 수준의 답변으로",
      description:
        "기업 특화 AI 업무 지원 솔루션입니다. 사내 문서를 그대로 학습해 근거와 함께 답하고, 조직의 권한 체계를 검색 단계에서 그대로 지킵니다.",
      badges: ["폐쇄망 설치", "출처 인용", "권한별 검색"],
      features: [
        { name: "폐쇄망 설치", note: "데이터 외부 유출 없음" },
        { name: "문서 근거 인용", note: "출처와 위치를 함께 표시" },
        { name: "권한별 검색", note: "조직 체계 그대로 반영" },
        { name: "모델 선택", note: "국내외 LLM 교체 가능" },
      ],
      specs: [
        { label: "설치 형태", value: "온프레미스 · 프라이빗 클라우드" },
        { label: "지원 문서", value: "PDF · 한글 · 워드 · 엑셀 · 이미지" },
        { label: "연동", value: "그룹웨어 · 전자결재 · SSO" },
      ],
      image: img("Eureka GenAI", "유레카 GenAI 화면", "#001543", "#53009C", 1200, 900),
      actions: [
        { label: "체험 신청하기", href: "#/trial" },
        { label: "도입 문의", href: "#/contact", variant: "secondary" },
      ],
    },
    {
      id: "eureka-box",
      eyebrow: "EUREKA BOX",
      name: "유레카 BOX",
      tagline: "인터넷이 끊긴 곳에서도 도는 문서 검색",
      description:
        "망분리 환경 전용 문서 검색 솔루션입니다. 외부 통신 없이 설치형으로 동작하며, 부서별 문서함 단위로 색인과 권한을 분리합니다.",
      badges: ["망분리 전용", "설치형", "부서별 색인"],
      features: [
        { name: "완전 오프라인", note: "외부 통신 없이 동작" },
        { name: "부서별 문서함", note: "색인과 권한을 분리 운영" },
        { name: "경량 설치", note: "단일 서버 구성 지원" },
      ],
      specs: [
        { label: "설치 형태", value: "온프레미스 전용" },
        { label: "최소 구성", value: "단일 서버 (GPU 선택)" },
        { label: "관리", value: "웹 관리 콘솔 · 감사 로그" },
      ],
      image: img("Eureka BOX", "유레카 BOX 화면", "#001543", "#001C88", 1200, 900),
      actions: [{ label: "자세히 보기", href: "#/contact" }],
    },
    {
      id: "rpa-platform",
      eyebrow: "RPA PLATFORM",
      name: "RPA 플랫폼",
      tagline: "검증된 클라우드 RPA를 국내 환경에 맞춰",
      description:
        "클라우드 RPA 시장 점유율 1위 플랫폼의 국내 파트너로서 도입·구축·운영을 제공합니다. 국내 기간계 시스템과 전자결재 연동 경험이 쌓여 있습니다.",
      badges: ["클라우드 RPA", "국내 파트너", "운영 대행"],
      features: [
        { name: "봇 오케스트레이션", note: "일정 · 큐 · 예외 관리" },
        { name: "기간계 연동", note: "ERP · 그룹웨어 · 전자결재" },
        { name: "운영 대행", note: "모니터링과 장애 대응 포함" },
      ],
      specs: [
        { label: "설치 형태", value: "클라우드 · 하이브리드" },
        { label: "라이선스", value: "봇 단위 구독" },
        { label: "교육", value: "실습형 RPA 교육 과정 제공" },
      ],
      image: img("RPA Platform", "RPA 플랫폼 화면", "#001543", "#53009C", 1200, 900),
      actions: [
        { label: "플랫폼 살펴보기", href: "#/contact" },
        { label: "RPA 교육 신청", href: "#/education", variant: "secondary" },
      ],
    },
  ],

  "solutions.rollout": [
    {
      id: "r1",
      title: "체험 신청",
      description: "샘플 문서로 구성한 데모 환경을 열어 드립니다.",
      duration: "3일",
    },
    {
      id: "r2",
      title: "환경 진단",
      description: "망 구성과 권한 체계, 문서 형식을 확인합니다.",
      duration: "1주",
    },
    {
      id: "r3",
      title: "PoC",
      description: "실제 문서로 답변 품질을 평가 세트에 태워 확인합니다.",
      duration: "4주",
    },
    {
      id: "r4",
      title: "설치 · 연동",
      description: "폐쇄망 설치와 SSO · 그룹웨어 연동을 진행합니다.",
      duration: "4–8주",
    },
    {
      id: "r5",
      title: "운영 이관",
      description: "관리자 교육과 운영 문서를 넘기고 정기 점검으로 전환합니다.",
      duration: "2주",
    },
  ],
};
