# 비밀 청첩장 프로젝트

서원우 ♥ 박지원 **친구 전용 비밀 청첩장** (원래 청첩장 `../wedding-invitation` 의 이스터에그로만 들어오는 곳).
컨셉: 중국산 스캠사이트. 검정·빨강·노랑, 일부러 촌스럽고 삐뚤빼뚤한 디자인.
빌드 도구 없는 순수 HTML/CSS/JS 정적 사이트. `index.html` 을 브라우저로 열면 바로 동작한다 (서버 불필요).

## 파일 구조와 역할

| 파일 | 역할 | 수정 빈도 |
|---|---|---|
| `js/config.js` | **모든 내용**: 문구, 이름, 소개, 공지, 사진 목록, bgm, 효과 on/off | 높음 |
| `css/style.css` | 디자인. 색상·폰트는 맨 위 `:root` 변수 | 중간 |
| `index.html` | 섹션 뼈대와 순서. 텍스트는 들어있지 않음 | 낮음 |
| `js/main.js` | config 를 읽어 화면에 그리는 로직. 섹션별 `renderXxx()` 함수 | 낮음 |
| `js/bgm.js` | 첫 터치 화면 + 배경음악 | 낮음 |
| `js/glitch.js` | 글리치(치지직 사각형) 효과 | 낮음 |
| `images/gallery/` | 갤러리 사진 (`01` ~ `09`) | - |
| `images/groom/`, `images/bride/` | 남편/아내 소개 슬라이드 사진 (`01` ~ `05`) | - |
| `images/map.*` | 공지 섹션 파판 맵 사진 | - |

사진은 확장자 생략 가능 (jpg/jpeg/png/webp 자동 탐색, `main.js` `loadImage`). 파일이 없으면 번호/문구 칸으로 표시.

## 수정 규칙

- 문구·이름·사진 변경은 **`js/config.js` 만** 고친다. HTML 에 텍스트를 직접 넣지 않는다.
- 색상·폰트 변경은 `css/style.css` 의 `:root` 변수를 고친다.
- 새 섹션 추가 시: ① `index.html` 에 `<section id="sec-이름">` 추가 → ② `config.js` 에 데이터 추가 → ③ `main.js` 에 `renderXxx()` 추가 후 맨 아래 "실행" 블록에서 호출 → ④ `style.css` 에 섹션 주석과 함께 스타일 추가.
- 파일이 커지면 한 파일에 몰아넣지 말고 분리한다. 사용자가 직접 코드를 고치지 않아도 되게 유지한다.
- `config.js` 는 ES 모듈이 아닌 일반 스크립트(`window.CONFIG`)다. `file://` 로 직접 열어도 동작해야 하므로 `import`/`fetch` 를 쓰지 않는다.
- 섹션 순서: 커버 → 인사말 → 혼주 → 남편 소개 → 아내 소개 → 공지 → 갤러리 → 탈출.
- 이 사이트에는 방명록·링크 복사·연락하기 기능이 **없다** (의도적으로 제거).

## 자주 하는 작업

- **혼주 섹션**: 맨 위 `family.image`(피닉스 gif, 가로 꽉 채움) → `family.text` → 부모 이름 줄.
- **남편/아내 소개**: `config.js` 의 `profiles[0]`(남편), `profiles[1]`(아내). 제목·소개·사진 5장. 사진은 가로 스와이프 슬라이드 + ◀▶ 버튼 (`main.js` `renderProfiles`).
- **공지**: `config.js` 의 `event.items`(줄마다 박스), `event.coord`(깜빡이는 좌표), `event.map`(맵 사진 경로).
- **탈출 버튼**: `config.js` 의 `escape.url` (원래 청첩장 주소).
- **고인 표시**: 해당 부모의 `deceased: true`.
- **첫 터치 화면 / 배경음악**: 처음엔 검은 화면 가운데 빨간 "TOUCH ME" 화면(`#intro`)만 보이고 터치 시 음악 재생 → `bgm.explosion` gif 를 화면 전체에 `bgm.explosionMs` 동안 재생 → 화면 사라짐 (모바일은 터치 전 소리 재생이 막힘). gif 는 터치 전에 `<img>` 로 만들면 미리 재생돼버리므로 preload 링크만 걸고 터치 시 `<img>` 생성. 터치 전엔 `html.intro` 로 스크롤 잠금·`.reveal` 등장 보류. `config.js` 의 `bgm.src`(`bgm_ultima.mp3`) 무한 반복. **끄는 버튼 없음 (강제 청취, 의도된 것)**. 탭을 벗어나면 일시정지, 돌아오면 무조건 다시 재생.
- **글리치 효과**: `effects.glitch` (끄기: false). 랜덤 RGB·랜덤 투명도 사각형. `glitchFront` true 면 글자 위로, false 면 콘텐츠 뒤. 빈도 `glitchGap`, 지속 `glitchLife`, 개수 `glitchCount`. 동작 줄이기 설정된 기기에서는 꺼짐.
- **한 화면씩 넘기기**: `effects.pageSnap`. 섹션이 화면 가운데에 오면 `.reveal` 이 순서대로 나타남 (`main.js` `initReveal`). `.card` 는 `overflow: clip` 유지 — `hidden` 으로 바꾸면 스냅이 깨진다.
- **링크 미리보기 메타**: `index.html` `<head>` 의 `og:*` 는 원래 청첩장 것 그대로 둠 (아무도 볼 일 없음).

## 알려진 제한

- 폰트는 `:root` 의 `--font-mix` 하나로 통일. 글자마다 앞에서부터 있는 폰트로 그려짐: 영어 Arial → 중국어 Ma Shan Zheng(Google Fonts) → 한글 바탕체(Windows 내장 Batang, 폰엔 없어서 Google Fonts Nanum Myeongjo). Ma Shan Zheng 에 없는 번체자는 바탕/나눔명조로 대체됨. 예외: 영어 제목(`.eng-title`)은 `--font-eng` = Papyrus (Mac/iOS 내장, 없는 기기는 Arial), 본문 단락(인사말·소개·공지·탈출 문구)은 `--font-text` = 한글 돋움체(Windows 내장, 폰엔 Nanum Gothic).
