---
title: "Docker Compose로 개발 환경 구축하기"
description: "Docker Compose를 활용하여 Frontend, Backend, DB를 하나의 명령어로 관리하는 DevOps 워크플로우를 소개합니다."
pubDate: 2026-04-18
category: "DevOps"
tags: ["docker", "devops", "infrastructure"]
---

## 왜 Docker Compose인가?

팀 프로젝트에서 "내 로컬에서는 되는데..."라는 말을 없애려면, **개발 환경을 코드로 관리**해야 합니다. Docker Compose는 여러 컨테이너를 하나의 YAML 파일로 정의하고 관리할 수 있는 도구입니다.

## 기본 구조

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb

volumes:
  pgdata:
```

## 실무 팁

1. **환경 변수 분리:** `.env` 파일을 사용하여 민감한 정보를 분리하세요.
2. **볼륨 매핑:** 개발 중에는 `./src:/app/src` 매핑으로 핫 리로드를 활용하세요.
3. **헬스 체크:** `healthcheck`를 설정하여 서비스 간 의존성 순서를 보장하세요.

```bash
# 전체 서비스 시작
docker compose up -d

# 로그 확인
docker compose logs -f backend

# 재빌드 후 시작
docker compose up --build -d
```

이 패턴을 사용하면 새로운 팀원도 `docker compose up` 한 줄로 전체 개발 환경을 구성할 수 있습니다.
