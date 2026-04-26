# GitHub Blog Improvement Plan

Date: 2026-04-26

Site: https://qkdgur4.github.io/

## Goal

The current blog has the basic shape of a portfolio, but the first impression is still too generic. A visitor should immediately understand who qkdgur4 is, what kind of problems they solve, and why the projects are worth opening.

This improvement plan focuses on three points:

1. Make the identity clear in the first viewport.
2. Remove template-like language and visual patterns.
3. Turn projects from simple links into compact case studies.

## Current Diagnosis

### 1. Identity Is Not Sharp Enough

The current homepage already has a Hero section with phrases like `I'm Bang Hyuk` and `Software Engineer and Entrepreneur`. The issue is that these phrases are broad. They do not explain what kind of engineer this is: backend, DevOps, simulation, game backend, product builder, or something else.

Recommended direction:

- Lead with the problem domain, not just the name.
- Replace abstract titles with concrete strengths.
- Use a Korean-first tone if the blog is mainly for Korean readers, with English keywords only where they help.

Hero copy candidates:

```text
I turn complex ideas into working services.
```

```text
Backend, infrastructure, and simulation projects built to actually run.
```

```text
Fast experiments, solid deployments, and honest engineering notes.
```

Recommended Hero structure:

- Identity line: `I turn complex ideas into working services.`
- Supporting line: `I write about TypeScript, Astro, AWS, LangGraph, game/backend experiments, and simulation projects.`
- Calls to action: `View Projects`, `Read Blog`, `GitHub`
- Proof points: `Simulation Engine`, `AWS Cost Optimization`, `Game Backend`, `Technical Writing`

## 2. Remove Template Traces

The current site still feels close to a general Astro/Tailwind portfolio template. Glassmorphism, gradient headlines, generic project cards, placeholder links, and stock images make the site feel less personal.

Recommended concept:

```text
Control Room Portfolio
```

The site should feel like a developer's control room: projects, writing, stack, and current work can be scanned quickly. The design should be practical, dense, and memorable rather than decorative.

Concrete ideas:

- Add a small terminal/status panel in the Hero area.
- Add a `Now Building` panel that shows current focus.
- Give project cards a `Problem -> Build -> Result` structure.
- Split tags into `Stack`, `Role`, and `Outcome` where useful.
- Add subtle section-entry and card-hover interactions.
- Create a consistent `qkdgur4` wordmark treatment for nav/favicon/OG direction.

Remove or replace:

- `Premium template` and `beautiful glassmorphism` style wording.
- `contact@example.com`, `username`, and `#` placeholder values.
- Generic Unsplash images that do not represent the actual project.
- Fake or overly generic About-page career text.

## 3. Increase Content Density

The portfolio menu exists, but project presentation needs more substance. A portfolio project should not be only a title, image, and link. It should explain context, contribution, and result.

Each project card should include:

- Problem: What problem did this solve?
- Role: What did qkdgur4 personally build?
- Build: What architecture or implementation was used?
- Result: What changed, improved, or was learned?
- Links: GitHub, demo, write-up, or `Coming soon`.

Example project structure:

```text
Alphacar Kubernetes Platform
Multi-cloud MSA platform with AI-driven observability.

Problem
Automotive platform features needed clear service boundaries, repeatable deployment, and reliable observability.

Build
Built Next.js and NestJS services on Kubernetes with AWS EKS, GCP GKE, ArgoCD, Terraform, and Grafana stack observability.

Result
Documented a cloud-native operating flow from deployment to metrics, logs, traces, and AI-generated reports.

Stack
Next.js / NestJS / Kubernetes / AWS EKS / GCP GKE / ArgoCD / Terraform / Bedrock
```

The homepage should show only two or three featured projects. The full `/projects` page can carry the heavier case-study structure.

## Execution Plan

### Phase 1. Redesign the Hero Section

Target files:

- `src/pages/index.astro`
- `src/components/hero-section.astro` if reused

Tasks:

- Replace generic English copy with a sharper personal positioning line.
- Remove placeholder values such as `contact@example.com`, `username`, and `#`.
- Rework CTA buttons around `View Projects`, `Read Blog`, and `GitHub`.
- Add a compact strength/current-work panel.

Done when:

- The first viewport explains what qkdgur4 builds.
- The Hero no longer reads like an Astro template intro.

### Phase 2. Reorder Homepage Information

Target files:

- `src/pages/index.astro`
- `src/components/horizontal-card.astro`
- `src/components/post-card.astro`

Tasks:

- Use the flow `Hero -> Featured Projects -> Writing -> About Snapshot`.
- Show only the strongest two or three projects on the homepage.
- Make recent posts easy to scan by title, description, tag, and date.
- Add a short About snapshot focused on working style, not a long skill list.

Done when:

- A visitor can understand who this is, what they built, and where to click within 10 seconds.

### Phase 3. Make Projects Case-Study Based

Target files:

- `src/pages/projects.astro`
- Optional new component: `src/components/project-card.astro`

Tasks:

- Change project cards to `Problem`, `Build`, `Result`, and `Stack`.
- Separate GitHub, demo, and write-up links.
- Mark unavailable links as `Coming soon` instead of using `#`.
- Replace unrelated stock images with project screenshots, diagrams, or cleaner non-image layouts.

Done when:

- Each project card communicates context, contribution, and value without needing an external link.

### Phase 4. Add a Signature Interaction

Target files:

- `src/pages/index.astro`
- `src/styles/global.css`
- Relevant components under `src/components/`

Tasks:

- Add a small terminal/status-panel interaction in the Hero area.
- Make project hover states reveal useful information rather than only scaling visually.
- Add subtle transitions for sections and page changes.
- Verify mobile layout so text and cards do not overlap.

Done when:

- The interaction reinforces the developer/control-room identity.
- The page still feels fast, readable, and stable on mobile.

### Phase 5. Clean Text, SEO, and Metadata

Target files:

- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/projects.astro`
- `src/components/seo-head.astro`
- `astro.config.mjs`

Tasks:

- Update site title and description around qkdgur4's actual identity.
- Remove fake career entries and generic About text.
- Decide whether the site tone is Korean-first or English-first.
- Prepare favicon and OG-image direction.
- Revisit old `docs` files that appear to have encoding issues.

Done when:

- Search previews and link previews clearly present the site as qkdgur4's portfolio/blog.

## Priority Order

1. Rewrite the Hero and first viewport.
2. Improve featured project card structure.
3. Remove placeholders and template wording.
4. Rewrite About with real personal context.
5. Add the signature terminal/status interaction.
6. Clean SEO, OG, favicon, and old docs encoding.

## 9+ Quality Target

The site should not aim for a theoretical `10/10` blog. The practical target is to become a memorable `9+` portfolio/blog across four axes:

| Axis | Current Estimate | Target | What Must Change |
| --- | ---: | ---: | --- |
| Basic completeness | 7/10 | 9/10 | Tight layout, no broken metadata, good mobile behavior, clear navigation, no placeholder content |
| Personality | 5.5/10 | 9/10 | Korean-first Hero copy, stronger qkdgur4 voice, control-room concept used as information structure |
| Portfolio persuasion | 6.5/10 | 9/10 | Real proof: screenshots, diagrams, GitHub links, result numbers, role clarity |
| Technical blog feeling | 6/10 | 9/10 | Recent technical notes should feel central, not secondary to portfolio cards |

### Cold Design Diagnosis

The current site is much better than the original template-like version, but it still sits between a customized portfolio template and a memorable personal technical blog.

What works:

- The qkdgur4 identity is now visible.
- `Backend / Infra / Simulation` gives a clearer technical direction.
- `Now Building` creates a stronger first impression.
- `Problem / Build / Result / Stack` makes projects easier to understand.

What still feels weak:

- The Hero copy is clean but too generic and English-heavy.
- The control-room concept is currently a visual layer, not the full information architecture.
- Featured projects still lack real evidence.
- The main page still reads more like a portfolio with a blog section than a technical blog with strong project proof.
- The color system is stable but not yet uniquely qkdgur4.

## Next Improvement Plan: Move From 7-ish to 9+

### Phase 6. Rewrite Hero in Korean-First Voice

Goal:

The Hero should sound like a specific person, not a polished SaaS landing page.

Target files:

- `src/pages/index.astro`
- `src/components/hero-section.astro`
- `public/og-image.svg`

Tasks:

- Replace `I turn complex ideas into working services.` with a sharper Korean-first statement.
- Keep English technical keywords only as supporting labels.
- Make the first sentence answer: "What kind of engineer is qkdgur4?"
- Add a short proof line under the Hero: project, stack, and writing direction.

Candidate Hero directions:

```text
아이디어를 실제로 굴러가는 서비스로 바꾸는 개발자.
```

```text
백엔드, 인프라, 시뮬레이션으로 작동하는 제품을 만듭니다.
```

```text
실험은 빠르게, 배포는 단단하게, 기록은 솔직하게.
```

Recommended Hero draft:

```text
아이디어를 실제로 굴러가는 서비스로 바꾸는 개발자, qkdgur4입니다.

백엔드와 인프라를 중심으로 시뮬레이션, 게임 서비스, 자동화 실험을 만들고
그 과정의 판단과 시행착오를 기술 글로 남깁니다.
```

Done when:

- A Korean visitor understands the person and direction within five seconds.
- The Hero no longer sounds like a generic English portfolio.

### Phase 7. Add Real Project Evidence

Goal:

Projects should feel real before the visitor clicks anything.

Target files:

- `src/pages/index.astro`
- `src/pages/projects.astro`
- `src/components/project-card.astro`
- `public/projects/*` for screenshots or diagrams

Tasks:

- Add one visual proof asset per featured project.
- Use screenshots if available; otherwise create simple architecture diagrams.
- Add `Role`, `Status`, and `Evidence` fields to project cards.
- Replace vague results with measurable or inspectable outcomes.
- Add real GitHub/demo/write-up links where available.

Evidence types:

- Screenshot of actual UI, terminal output, dashboard, report, or game screen.
- Architecture diagram showing data flow or service flow.
- GitHub repository link.
- Before/after number such as cost, speed, deployment time, scenario count, or error reduction.
- Blog post explaining implementation decisions.

Project card target structure:

```text
Title
One-line value proposition

Status: Building / Shipped / Experiment
Role: Backend / Infra / Simulation Design

Problem
Build
Result
Evidence
Stack
Links
```

Done when:

- Each project has at least one concrete proof point.
- No project relies only on a good-sounding description.

### Phase 8. Make Technical Writing Central

Goal:

The site should feel like a technical blog, not only a portfolio.

Target files:

- `src/pages/index.astro`
- `src/pages/blog/index.astro`
- `src/components/post-card.astro`
- `src/content/blog/*`

Tasks:

- Move `Latest Writing` visually closer to the top or make it denser.
- Add a `Recent Technical Logs` or `Engineering Notes` section.
- Show tags as technical signals: `Astro`, `AWS`, `Simulation`, `CI/CD`, `Backend`.
- Add a small `What I learned` or `Tradeoff` preview per post if content supports it.
- Ensure the blog index has enough information density for scanning.

Homepage structure option:

```text
Hero
Control Room Dashboard
Recent Technical Logs
Featured Case Studies
About Snapshot
```

This structure makes the site read as a technical blog first, with portfolio proof embedded.

Done when:

- Recent writing feels like a primary product of the site.
- A visitor can quickly tell what topics qkdgur4 actually writes about.

### Phase 9. Turn Control Room Into Information Architecture

Goal:

The control-room concept should organize information, not just decorate cards.

Target files:

- `src/pages/index.astro`
- `src/styles/global.css`
- New optional component: `src/components/control-room-panel.astro`

Tasks:

- Create a reusable `ControlRoomPanel` component.
- Replace isolated decorative effects with dashboard-like sections.
- Add status rows such as `Current Focus`, `Latest Build`, `Writing Queue`, and `Project Signals`.
- Use compact metrics only when they are meaningful.
- Keep the visual language restrained: dense, clear, technical, not flashy.

Possible dashboard modules:

```text
Current Focus
- Portfolio case studies
- Simulation project notes
- Backend deployment habits

Latest Build
- Control-room Hero
- Project card evidence fields
- OG/social metadata

Project Signals
- 3 case studies
- 2 active experiments
- 1 technical writing queue
```

Done when:

- The homepage looks organized around status, projects, and writing.
- The terminal/control-room style is useful even without animations.

### Phase 10. Visual Identity Tightening

Goal:

Make the site recognizable without adding noise.

Target files:

- `src/styles/global.css`
- `src/components/side-bar.astro`
- `src/components/project-card.astro`
- `public/favicon.svg`
- `public/og-image.svg`

Tasks:

- Define a more intentional visual system around dark navy, cyan, emerald, and neutral gray.
- Reduce generic gradients where they do not carry meaning.
- Use repeated structural motifs: status labels, signal lines, terminal rows, compact panels.
- Improve spacing rhythm between Hero, writing, projects, and About.
- Make mobile layout feel designed, not merely stacked.

Done when:

- A screenshot of the homepage is recognizable as qkdgur4's site.
- The design feels technical and personal, not like a default theme.

## New Priority Order

1. Korean-first Hero copy and OG copy.
2. Control Room Dashboard as actual information structure.
3. Real project evidence fields and visuals.
4. Recent Technical Logs section on the homepage.
5. Project screenshots/diagrams.
6. Blog index density and post-card preview improvements.
7. Visual system tightening and mobile polish.

## Recommended Next Commit Scope

The next implementation should stay focused:

- Rewrite Hero and OG copy in Korean-first voice.
- Add a `ControlRoomPanel` component or dashboard section.
- Add `Recent Technical Logs` above or near Featured Projects.
- Extend `ProjectCard` with `status`, `role`, and `evidence`.
- Use placeholder diagrams only if real screenshots are not available yet, but label them clearly as architecture diagrams.

Do not try to solve everything in one commit. The highest-impact next step is to make the homepage feel like a living technical control room instead of a polished landing page.

## Recommended First Commit Scope

Start with a small but high-impact pass:

- Rewrite the Hero in `src/pages/index.astro`.
- Convert homepage project descriptions into case-study style summaries.
- Remove `#`, Unsplash dependency, and template wording from `src/pages/projects.astro`.
- Remove fake career text from `src/pages/about.astro`.

This scope should noticeably improve the first impression without requiring a full redesign. The interaction and visual system can follow as a second pass.

## Progress Log

### 2026-04-26 Pass 1

- Reworked the homepage Hero around qkdgur4's identity.
- Added a `Now Building` panel to create a stronger first impression.
- Added `src/components/project-card.astro`.
- Changed project presentation to `Problem / Build / Result / Stack`.
- Rewrote the About page to remove fake career/template language.
- Replaced `DevBlog`, placeholder links, and template copy in source files.

### 2026-04-26 Pass 2

- Added a lightweight control-room visual language with grid, scanline, and caret utilities.
- Enhanced project cards with a subtle signal hover treatment.
- Replaced the missing default OG image reference with `/og-image.svg`.
- Added a qkdgur4 favicon and `site.webmanifest`.

### 2026-04-26 Pass 3

- Rewrote the homepage Hero and metadata in a Korean-first voice.
- Added `src/components/control-room-panel.astro` and moved the Hero status panel into a reusable dashboard component.
- Moved `Recent Technical Logs` above featured projects and added a writing-queue fallback for empty blog content.
- Extended project cards with `Status`, `Role`, `Evidence`, and visual proof support.
- Added architecture diagram placeholders under `public/projects/` for the current featured projects.
- Rewrote `/projects`, `/about`, `/blog`, and the OG image copy to better match the control-room technical blog direction.

