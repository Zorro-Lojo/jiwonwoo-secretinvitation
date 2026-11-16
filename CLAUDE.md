# 모바일 청첩장 프로젝트

서원우 ♥ 박지원 모바일 청첩장. 빌드 도구 없는 순수 HTML/CSS/JS 정적 사이트.
`index.html` 을 브라우저로 열면 바로 동작한다 (서버 불필요).

## 파일 구조와 역할

| 파일 | 역할 | 수정 빈도 |
|---|---|---|
| `js/config.js` | **모든 내용**: 문구, 이름, 날짜, 연락처, 갤러리 사진 목록, 고인 표시, 효과 on/off | 높음 |
| `css/style.css` | 디자인. 색상·폰트는 맨 위 `:root` 변수 | 중간 |
| `index.html` | 섹션 뼈대와 순서. 텍스트는 들어있지 않음 | 낮음 |
| `js/main.js` | config 를 읽어 화면에 그리는 로직. 섹션별 `renderXxx()` 함수 | 낮음 |
| `images/gallery/` | 갤러리 사진 (`01` ~ `09`, 확장자 jpg/jpeg/png/webp 자동 탐색) | - |

## 수정 규칙

- 문구·이름·날짜·사진 변경은 **`js/config.js` 만** 고친다. HTML 에 텍스트를 직접 넣지 않는다.
- 색상·폰트 변경은 `css/style.css` 의 `:root` 변수를 고친다.
- 새 섹션 추가 시: ① `index.html` 에 `<section id="sec-이름">` 추가 → ② `config.js` 에 데이터 추가 → ③ `main.js` 에 `renderXxx()` 추가 후 맨 아래 "실행" 블록에서 호출 → ④ `style.css` 에 섹션 주석과 함께 스타일 추가.
- 파일이 커지면 한 파일에 몰아넣지 말고 분리한다 (예: `js/gallery.js`, `css/gallery.css`). 사용자가 직접 코드를 고치지 않아도 되게 유지한다.
- `config.js` 는 ES 모듈이 아닌 일반 스크립트(`window.CONFIG`)다. `file://` 로 직접 열어도 동작해야 하므로 `import`/`fetch` 를 쓰지 않는다.
- 사용자 입력(방명록)은 `textContent` 로만 넣는다. `innerHTML` 금지.
- 섹션 순서: 커버 → 인사말 → 혼주 → 캘린더 → 갤러리 → 방명록.

## 자주 하는 작업

- **갤러리 사진 넣기**: `images/gallery/` 에 파일을 넣고 `config.js` 의 `gallery.images` 경로를 맞춘다. 파일이 없는 칸은 번호가 적힌 빈 칸으로 표시된다. 열 수/간격/비율은 `style.css` 의 "5. 갤러리".
- **고인 표시(국화꽃 대체)**: `config.js` 에서 해당 부모의 `deceased: true`. 모양은 리본 고정 (`main.js` 의 `RIBBON_SVG`), 색은 `deceasedMark.color`.
- **연락처**: `config.js` 의 `groom.tel`, `bride.tel`.
- **커버 타이틀**: `cover.image` (SVG 이미지 고정), 대체 텍스트는 `cover.imageAlt`.
- **눈 효과 끄기**: `effects.snow: false`. 눈송이 모양은 `effects.snowImages` (SVG, CSS filter 로 흰색 처리). 항목별 `size: [최소, 최대]`(px) 와 `weight`(나오는 비율) 지정. 색은 `effects.snowColor` 의 `from`~`to` 사이 `steps` 단계 중 랜덤 (main.js `buildSnowTints` 가 SVG 필터 생성). 눈 설정 값은 기본값 없이 config 값을 그대로 쓰므로 항목을 지우지 말 것. 양은 `effects.snowGap` (페이지 높이 이 px 마다 1개, 클수록 적게). 속도는 `effects.snowDuration` (위→아래 걸리는 초 [최소, 최대]). 눈 레이어는 콘텐츠 뒤 (`.snow` z-index 0, section 1).
- **한 화면씩 넘기기**: `effects.pageSnap` (섹션마다 화면 높이, CSS scroll-snap). 섹션이 화면 가운데에 오면 `.reveal` 이 순서대로 나타나고 벗어나면 사라짐 (`main.js` `initReveal`). `.card` 는 `overflow: clip` 유지 — `hidden` 으로 바꾸면 카드가 스크롤 영역이 되어 스냅이 깨진다.

- **카톡 링크 미리보기**: `index.html` `<head>` 의 `<title>`, `og:*` 메타 (수집기가 JS 를 실행하지 않아 HTML 에 직접 작성하는 유일한 예외). 썸네일은 `images/og-thumbnail.png` (800x400, `title_text.svg` 를 검정으로 렌더링). 바꾼 뒤엔 카카오 공유 디버거에서 캐시 초기화.

## 알려진 제한

- 방명록 흐름: 작성(공개/비공개 선택) → 확인 창(`guestbook.confirmText`) → 전송. 화면에는 **공개 글만 최신 `showCount`(5)개** 표시. 서버 RLS 로 anon 은 insert + `is_public = true` 행 select 만 가능. 비공개 글은 Supabase Table Editor 에서만 확인.
- 방명록 저장은 `js/guestbook.js` 담당. `config.js` 의 `guestbook.supabase.url/key` 가 있으면 Supabase REST API 로 서버 저장, 없으면 `localStorage`. 테이블 생성 SQL 은 `supabase/guestbook.sql`. (외부 API 호출용 `fetch` 는 허용 — 금지 대상은 로컬 파일 로드용 `fetch`)
- 카카오톡 공유는 미구현 (Kakao JavaScript 키와 배포 도메인 등록 필요). 현재는 링크 복사 버튼.
- 폰트는 Google Fonts CDN 로드 (Noto Sans KR, Noto Serif, Crimson Pro).
