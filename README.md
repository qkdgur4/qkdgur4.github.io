# qkdgur4.github.io

qkdgur4의 GitHub Pages 기술 블로그입니다.
백엔드, 인프라, Kubernetes, 관측성, 자동화 실험을 실제 프로젝트 증거와 함께 정리하는 것을 목표로 합니다.

## 방향

- 글은 직접 쓴다.
- 프로젝트는 문제, 구현, 결과, 증거를 함께 보여준다.
- 블로그는 포트폴리오 링크 모음이 아니라 다시 읽을 수 있는 개발 기록으로 관리한다.

## 글 작성 템플릿

글의 문체와 판단은 직접 작성하고, 구조가 필요할 때는 [docs/post-templates.md](docs/post-templates.md)를 참고합니다.
템플릿은 실제 발행 글이 아니라 질문과 섹션만 제공하는 작성용 틀입니다.

## Project Structure

```text
/
├── docs/                  # 개선 계획과 글 작성 템플릿
├── public/                # 정적 이미지, favicon, OG 이미지
├── src/
│   ├── components/        # 카드, 네비게이션, 검색 등 UI 컴포넌트
│   ├── content/blog/      # Markdown 기반 블로그 글
│   ├── layouts/           # 공통 레이아웃
│   └── pages/             # Astro 라우트
└── package.json
```

## Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using Astro CLI                         |

## Publishing Notes

- `src/content/blog/*.md` 글은 `draft: false`일 때만 홈, 블로그 목록, RSS에 노출됩니다.
- 새 글은 먼저 `draft: true`로 작성하고, 직접 다듬은 뒤 발행합니다.
- `npm run build`로 발행 전에 정적 빌드를 확인합니다.
