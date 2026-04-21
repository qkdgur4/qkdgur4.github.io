# 블로그 구현 로드맵 (2026.04.21 Updated)

> **현재 환경:** Astro 6.1.8 / Tailwind CSS 4.2.3 / Node ≥ 22.12.0
> **현재 상태:** 뼈대(Layout + SEO Head + 기본 Index)만 존재. 콘텐츠 시스템, 디자인, 라우팅 모두 미구현.

---

## 리서치 결과: 기존 로드맵과의 차이점

| 항목 | 이전 계획 (구버전) | 최신 (Astro 6 + TW v4) |
|------|-------------------|------------------------|
| 콘텐츠 설정 파일 | `src/content/config.ts` | **`src/content.config.ts`** (루트 레벨) |
| 콘텐츠 로더 | `type: 'content'` | **`glob()` Loader** from `astro/loaders` |
| 포스트 식별자 | `post.slug` | **`post.id`** (slug 폐기) |
| 렌더링 방식 | `post.render()` | **`render(post)`** from `astro:content` |
| View Transitions | `<ViewTransitions />` | **`<ClientRouter />`** (네이티브 브라우저 API) |
| Tailwind 설정 | `tailwind.config.mjs` | **CSS-First** (`@theme`, `@plugin` 디렉티브) |
| Typography 플러그인 | JS 설정 파일에서 등록 | **`@plugin "@tailwindcss/typography"`** in CSS |
| 이미지 최적화 | 수동 | **`<Image />` 빌트인 컴포넌트** (WebP 자동변환) |

---

## Phase 1: 콘텐츠 시스템 구축 (Content Layer API)
> Astro 5/6의 Content Layer API + `glob()` Loader를 사용한다.

| # | 작업 | 파일 | 설명 |
|---|------|------|------|
| 1-1 | 콘텐츠 스키마 정의 | `src/content.config.ts` | `defineCollection` + `glob()` loader + Zod 스키마 (title, description, pubDate, category, tags, heroImage) |
| 1-2 | Typography 플러그인 설치 | `src/styles/global.css` | `@plugin "@tailwindcss/typography"` + prose 다크모드 커스텀 |
| 1-3 | 샘플 포스트 3개 작성 | `src/content/blog/*.md` | 실제 렌더링 테스트용. 각각 다른 카테고리/태그, 코드블록 포함 |
| 1-4 | 포스트 레이아웃 | `src/layouts/post-layout.astro` | 제목, 날짜, 태그, `prose dark:prose-invert` 본문 스타일링 |
| 1-5 | 포스트 상세 페이지 | `src/pages/blog/[id].astro` | `getStaticPaths()` + `render(post)` 방식의 동적 라우팅 |

---

## Phase 2: 프리미엄 디자인 시스템
> Tailwind v4의 CSS-First 설정 + `<ClientRouter />` View Transitions 적용.

| # | 작업 | 파일 | 설명 |
|---|------|------|------|
| 2-1 | 디자인 토큰 정의 | `src/styles/global.css` | `@theme` 디렉티브로 커스텀 컬러, 폰트(Inter/Pretendard), 애니메이션 변수 |
| 2-2 | View Transitions 적용 | `src/layouts/base-layout.astro` | `<ClientRouter />` 추가 → 페이지 간 부드러운 전환 애니메이션 |
| 2-3 | 네비게이션 바 | `src/components/navbar.astro` | 로고 + 메뉴(Home, Blog, Tags, About) + 모바일 반응형 + `transition:persist` |
| 2-4 | 히어로 섹션 | `src/components/hero-section.astro` | 그라디언트 배경 + 타이핑 애니메이션 + 소개 텍스트 |
| 2-5 | 포스트 카드 | `src/components/post-card.astro` | 호버 이펙트, 태그 뱃지, 날짜, glassmorphism + `transition:name` 공유 요소 |
| 2-6 | 푸터 | `src/components/footer.astro` | 소셜 링크(GitHub, LinkedIn) + 저작권 |
| 2-7 | 메인 페이지 리디자인 | `src/pages/index.astro` | 히어로 + Content Layer에서 최신 포스트 3개 쿼리 + About 미니 섹션 |

---

## Phase 3: 카테고리 & 태그 시스템
> Content Layer의 `getCollection()` API를 활용한 필터링.

| # | 작업 | 파일 | 설명 |
|---|------|------|------|
| 3-1 | 블로그 목록 페이지 | `src/pages/blog/index.astro` | 전체 포스트 목록 (날짜순 정렬) |
| 3-2 | 카테고리 페이지 | `src/pages/blog/category/[category].astro` | 카테고리별 필터링된 포스트 목록 |
| 3-3 | 태그 페이지 | `src/pages/tags/index.astro` | 전체 태그 클라우드 |
| 3-4 | 태그별 포스트 | `src/pages/tags/[tag].astro` | 특정 태그의 포스트 목록 |
| 3-5 | 태그 뱃지 컴포넌트 | `src/components/tag-badge.astro` | 재사용 가능한 태그 UI |

---

## Phase 4: SEO 마무리 & 배포 최적화
> Google이 좋아하는 블로그로 최종 다듬기.

| # | 작업 | 파일 | 설명 |
|---|------|------|------|
| 4-1 | robots.txt | `public/robots.txt` | 크롤링 허용 규칙 + sitemap 경로 |
| 4-2 | 404 페이지 | `src/pages/404.astro` | 커스텀 Not Found 페이지 |
| 4-3 | RSS 피드 | `src/pages/rss.xml.js` | `@astrojs/rss` 패키지 활용 자동 생성 |
| 4-4 | About 페이지 | `src/pages/about.astro` | 자기소개 + 기술스택 + 경력 |
| 4-5 | 이미지 최적화 | 전역 | Astro `<Image />` 빌트인 컴포넌트로 WebP 자동변환 + lazy loading |
| 4-6 | favicon & OG 이미지 | `public/` | 파비콘 SVG + 기본 OG 이미지 |

---

## 작업 순서 요약

```
Phase 1 (콘텐츠) → Phase 2 (디자인) → Phase 3 (분류) → Phase 4 (SEO/배포)
```

---

## 현재 완료된 파일

- [x] `astro.config.mjs` — Tailwind(Vite), Sitemap, MDX, Shiki 설정
- [x] `src/components/seo-head.astro` — 메타태그 컴포넌트
- [x] `src/layouts/base-layout.astro` — 기본 레이아웃 + `<ClientRouter />`
- [x] `src/pages/index.astro` — 메인 페이지 (히어로 + 최근 포스트)
- [x] `.github/workflows/deploy.yml` — 배포 파이프라인
- [x] `src/styles/global.css` — Tailwind import + Typography + 테마 토큰
- [x] `src/content.config.ts` — Content Layer API 설정
- [x] `src/components/navbar.astro`, `hero-section.astro`, `post-card.astro`, `footer.astro` — UI 컴포넌트
- [x] `src/pages/blog/index.astro`, `[id].astro` — 블로그 목록 및 상세 페이지
- [x] `src/pages/blog/category/[category].astro` — 카테고리 필터링
- [x] `src/pages/tags/index.astro`, `[tag].astro` — 태그 클라우드 및 필터링
- [x] `src/components/tag-badge.astro` — 태그 뱃지 컴포넌트
- [x] `public/robots.txt` — 크롤링 허용 규칙 + sitemap 경로
- [x] `src/pages/404.astro` — 커스텀 Not Found 페이지
- [x] `src/pages/rss.xml.js` — `@astrojs/rss` 활용 RSS 피드
- [x] `src/pages/about.astro` — About 소개 페이지
- [x] Astro `<Image />` 내장 컴포넌트 환경 구성 완료
- [x] favicon.svg 기본 제공됨
