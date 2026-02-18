# Helium Search

> A lightweight and clean AI search engine.

## 기술 스택

| 구성 요소 | 기술 |
|-----------|------|
| AI 모델 | Qwen API (DashScope) |
| 검색 소스 | Google, Bing, DuckDuckGo, Brave, Yandex, SearXNG, Wikipedia, Wiby, Marginalia, Mojeek |
| 백엔드 | Cloudflare Workers |
| 프론트엔드 | 정적 HTML + CSS + JS |
| 배포 | Cloudflare (Pages + Workers) |

## 프로젝트 구조

```
helium-search/
├── frontend/
│   ├── index.html          # 메인 + 결과 SPA
│   ├── style.css           # 스타일
│   └── app.js              # 검색 요청, 결과 렌더링
├── worker/
│   └── index.js            # Cloudflare Worker (검색 + AI)
├── wrangler.toml           # Workers 설정
└── README.md
```

## 시작하기

### 1. 의존성 설치

```bash
npm install -g wrangler
wrangler login
```

### 2. API 키 설정

```bash
wrangler secret put QWEN_API_KEY          # 필수: Qwen (DashScope) API 키
wrangler secret put GOOGLE_API_KEY        # 선택: Google Custom Search API 키
wrangler secret put GOOGLE_CX            # 선택: Google Search Engine ID
wrangler secret put BING_API_KEY          # 선택: Bing Web Search API 키
wrangler secret put BRAVE_API_KEY         # 선택: Brave Search API 키
wrangler secret put YANDEX_USER           # 선택: Yandex 사용자명
wrangler secret put YANDEX_KEY            # 선택: Yandex API 키
wrangler secret put MOJEEK_API_KEY        # 선택: Mojeek Search API 키
wrangler secret put MARGINALIA_KEY        # 선택: Marginalia API 키 (기본: public)
wrangler secret put SEARXNG_URL           # 선택: SearXNG 인스턴스 URL
```

> DuckDuckGo, Wikipedia, Wiby, Marginalia는 API 키 없이 동작합니다. SearXNG는 자체 인스턴스 URL 설정 시에만 사용됩니다.

### 3. 로컬 개발

```bash
wrangler dev
```

### 4. 배포

```bash
# Worker 배포
wrangler deploy

# 프론트엔드는 Cloudflare Pages에 frontend/ 디렉토리 배포
```

## 검색 흐름

```
사용자 입력 → Worker가 검색엔진 최대 10개 병렬 호출 (8초 타임아웃)
           → 결과 수집 & URL 기준 중복 제거 (최대 15개)
           → Qwen API로 의도 분류 + 요약/추천
           → JSON 응답 → 프론트엔드 렌더링
```

## API

### `GET /api/search?q={query}`

**정보형 응답** (type: "info"):
```json
{
  "type": "info",
  "query": "검색어",
  "answer": "AI 요약 답변",
  "sources": [{"title": "...", "url": "...", "snippet": "..."}],
  "related": ["추천1", "추천2", "추천3"]
}
```

**사이트형 응답** (type: "site"):
```json
{
  "type": "site",
  "query": "검색어",
  "sites": [{"name": "...", "url": "...", "description": "..."}],
  "related": ["추천1", "추천2", "추천3"]
}
```

## 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `QWEN_API_KEY` | ✅ | DashScope API 키 |
| `QWEN_MODEL` | ❌ | 모델명 (기본: qwen3.5-plus) |
| `SEARCH_TIMEOUT_MS` | ❌ | 검색 타임아웃 (기본: 8000ms) |
| `MAX_RESULTS` | ❌ | Qwen 전달 최대 결과 수 (기본: 15) |
| `GOOGLE_API_KEY` | ❌ | Google Custom Search API 키 |
| `GOOGLE_CX` | ❌ | Google Search Engine ID |
| `BING_API_KEY` | ❌ | Bing Web Search 구독 키 |
| `BRAVE_API_KEY` | ❌ | Brave Search API 키 |
| `YANDEX_USER` | ❌ | Yandex XML 사용자명 |
| `YANDEX_KEY` | ❌ | Yandex XML API 키 |
| `SEARXNG_URL` | ❌ | SearXNG 인스턴스 URL (기본: search.ononoki.org) |
| `MARGINALIA_KEY` | ❌ | Marginalia API 키 (기본: public) |
| `MOJEEK_API_KEY` | ❌ | Mojeek Search API 키 |
