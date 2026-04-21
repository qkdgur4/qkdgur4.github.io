---
title: "Astro로 개발 블로그 시작하기"
description: "Astro 6와 Tailwind CSS v4를 사용하여 정적 블로그를 처음부터 구축하는 과정을 다룹니다."
pubDate: 2026-04-20
category: "Frontend"
tags: ["astro", "tailwind", "ssg"]
---

## 왜 Astro인가?

Astro는 **제로 자바스크립트** 철학을 기반으로 한 정적 사이트 생성기입니다. 블로그처럼 콘텐츠 중심의 사이트에 최적화되어 있으며, 빌드 시점에 HTML을 생성하여 빠른 로딩 속도를 보장합니다.

### 핵심 특징

- **Islands Architecture:** 필요한 컴포넌트만 클라이언트에서 하이드레이션
- **Content Layer API:** 타입 안전한 마크다운 콘텐츠 관리
- **View Transitions:** 네이티브 브라우저 API를 활용한 페이지 전환

## 프로젝트 초기화

```bash
npm create astro@latest ./
npx astro add tailwind sitemap mdx
```

위 명령어만으로 Tailwind CSS, 사이트맵, MDX 지원이 모두 포함된 프로젝트를 생성할 수 있습니다.

## Content Layer 설정

Astro 6에서는 `content.config.ts`에서 `glob()` 로더를 사용합니다:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
  }),
});
```

이 구조를 통해 프론트매터의 타입 검증이 빌드 시점에 자동으로 이루어집니다.
