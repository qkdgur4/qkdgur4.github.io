---
title: "GitHub Actions로 CI/CD 파이프라인 구축"
description: "GitHub Actions를 활용하여 자동 테스트, 빌드, 배포까지 이어지는 CI/CD 파이프라인을 단계별로 설정합니다."
pubDate: 2026-04-15
category: "DevOps"
tags: ["github-actions", "cicd", "devops", "automation"]
---

## CI/CD가 필요한 이유

수동 배포는 **휴먼 에러의 온상**입니다. 코드를 푸시할 때마다 자동으로 테스트하고, 빌드하고, 배포하는 파이프라인을 구축하면 개발 속도와 안정성을 동시에 확보할 수 있습니다.

## GitHub Actions 워크플로우

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run build

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: echo "Deploying to production server..."
```

## 핵심 개념

### Jobs와 Steps
- **Job:** 독립된 실행 환경(러너)에서 동작하는 작업 단위
- **Step:** Job 내에서 순차적으로 실행되는 개별 명령

### 의존성 관리
`needs` 키워드로 Job 간 실행 순서를 제어합니다. 위 예제에서는 `test → build → deploy` 순서가 보장됩니다.

### 조건부 실행
```yaml
if: github.ref == 'refs/heads/main'
```
`main` 브랜치에 대한 푸시만 배포를 트리거하도록 조건을 걸 수 있습니다.

## 마무리

GitHub Actions는 **무료 티어**에서도 월 2,000분의 실행 시간을 제공합니다. 개인 프로젝트의 CI/CD 파이프라인으로 충분합니다.
