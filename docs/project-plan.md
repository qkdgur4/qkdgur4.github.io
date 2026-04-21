# GitHub Blog (Astro) 프로젝트 계획 및 구조

## 1. 초기 설정 명령어 (CLI)

```bash
# Astro 프로젝트 생성 (현재 디렉토리)
npm create astro@latest ./

# 필수 통합 플러그인 설치 (Tailwind, Sitemap, MDX)
npx astro add tailwind sitemap mdx
```

## 2. 제안하는 폴더 구조

```text
e:\githubblog\
├── .github\
│   └── workflows\
│       └── deploy.yml          # 배포 파이프라인
├── public\
│   ├── favicon.svg
│   └── robots.txt              # 검색엔진 봇 제어
├── src\
│   ├── components\
│   │   ├── seo-head.astro      # 공통 SEO 헤더
│   │   └── post-card.astro     # 포스트 목록 아이템
│   ├── content\
│   │   ├── config.ts           # 콘텐츠 스키마 정의 (태그, 카테고리 등)
│   │   └── blog\               # Markdown/MDX 포스트 작성 폴더
│   ├── layouts\
│   │   ├── base-layout.astro   # 기본 레이아웃
│   │   └── post-layout.astro   # 포스트 상세 페이지 레이아웃
│   ├── pages\
│   │   ├── index.astro         # 메인 페이지 (자기소개 + 최신 글)
│   │   └── blog\
│   │       ├── index.astro     # 전체 포스트 목록
│   │       ├── [category].astro # 카테고리별 동적 라우팅
│   │       └── [slug].astro    # 개별 포스트 동적 라우팅
├── astro.config.mjs            # 프레임워크 핵심 설정
├── tailwind.config.mjs         # UI/디자인 시스템 설정
└── package.json
```

## 3. 핵심 파일 및 코드

### `astro.config.mjs`
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://username.github.io', // 본인의 GitHub Pages URL로 변경
  integrations: [
    tailwind(), 
    sitemap(), 
    mdx()
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark', // 다크모드 기반 가독성 높은 코드 하이라이팅
      wrap: true,
    },
  },
});
```

### `src/components/seo-head.astro`
```html
---
interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image = '/default-og.png' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!-- Global Metadata -->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="generator" content={Astro.generator} />

<!-- Canonical URL -->
<link rel="canonical" href={canonicalURL} />

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content={Astro.url} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.url)} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={Astro.url} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={new URL(image, Astro.url)} />

<!-- Google Search Console -->
<!-- <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> -->
```

### `src/layouts/base-layout.astro`
```html
---
import SeoHead from '../components/seo-head.astro';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="ko" class="dark">
  <head>
    <SeoHead title={title} description={description} />
  </head>
  <body class="bg-gray-900 text-gray-100 min-h-screen flex flex-col antialiased">
    <header class="w-full max-w-4xl mx-auto p-6">
      <nav>
        <a href="/" class="text-xl font-bold text-white hover:text-blue-400 transition-colors">DevBlog</a>
      </nav>
    </header>
    
    <main class="flex-grow w-full max-w-4xl mx-auto p-6">
      <slot />
    </main>

    <footer class="w-full max-w-4xl mx-auto p-6 text-center text-gray-500 text-sm">
      © {new Date().getFullYear()} DevOps Portfolio. All rights reserved.
    </footer>
  </body>
</html>
```

### `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Build with Astro
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 4. 아키텍처 및 로직 설계 원칙
- **SSG 및 Zero-JS:** Astro 프레임워크의 특성을 활용하여 클라이언트 측 자바스크립트를 최소화하고 로드 속도를 극대화.
- **SEO 강박:** `seo-head.astro`를 통해 모든 페이지에 필수 메타태그 삽입 강제화.
- **콘텐츠 스키마 적용:** Zod 등을 활용하여 마크다운 파일 작성 시 프론트매터(Frontmatter) 검증 단계 도입.
- **자동화된 배포 파이프라인:** `deploy.yml`을 통해 main 브랜치 푸시 시 즉시 GitHub Pages 환경에 업데이트 반영.
