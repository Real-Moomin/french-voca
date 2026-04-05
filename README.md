# French voca

프랑스어 어휘를 Day 1~30 구성으로 탐색할 수 있는 정적 웹 프로젝트입니다.

## 포함 기능

- HTML, CSS, JavaScript만으로 동작
- 모바일 최적화 레이아웃
- 다크모드 기본 지원 + 수동 전환
- Day별 JSON 데이터 로딩
- 단어 검색 / 품사 필터 / 페이지네이션
- `localStorage`로 마지막 본 day와 페이지 기억
- 각 day 마지막에 빈칸 문제 10개 제공

## 실행 방법

브라우저에서 `index.html`을 직접 열면 `file://` 환경 때문에 JSON 로딩 오류가 날 수 있습니다. 가장 쉬운 방법은 프로젝트 폴더에서 아래 명령으로 로컬 서버를 켜는 것입니다.

### 권장

```bash
npm start
```

서버가 켜지면 브라우저에서 `http://127.0.0.1:5500`으로 접속하면 됩니다.

### 왜 필요한가

- 이 프로젝트는 `fetch("./data/day01.json")` 방식으로 day별 JSON을 읽습니다.
- 대부분의 브라우저는 `file://`에서 이런 요청을 막거나 제한합니다.
- 그래서 `index.html` 더블클릭 대신 로컬 서버로 실행해야 안정적으로 테스트할 수 있습니다.

### Python

```bash
python -m http.server 5500
```

### Node.js

```bash
npx serve .
```

## 데이터 구조

- `data/index.json`: day 목록과 제목
- `data/day01.json` ~ `data/day30.json`: day별 단어 50개와 퀴즈 10개

## GitHub 업로드 팁

1. `git init`
2. `git checkout -b codex/french-voca`
3. `git add .`
4. `git commit -m "Create French voca web app"`
5. `git remote add origin <repo-url>`
6. `git push -u origin codex/french-voca`
