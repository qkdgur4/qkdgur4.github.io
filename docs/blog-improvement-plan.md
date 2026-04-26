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
Seoul Simulator
Concurrent simulation engine for franchise location analysis.

Problem
Comparing Mapo-gu franchise locations required many assumptions and scenarios to be tested quickly.

Build
Built a simulation pipeline with LangGraph agent flows, AWS RDS, and asynchronous job handling.

Result
Produced comparable scenario reports for location, revenue, and traffic assumptions.

Stack
TypeScript / Python / LangGraph / AWS RDS
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

