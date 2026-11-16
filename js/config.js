window.CONFIG = {

  /* ---------- 브라우저 탭 제목 ---------- */
  pageTitle: '天下統一 大婚禮',

  /* ---------- 커버 ---------- */
  cover: {
    image: 'images/title_text.svg',
    imageAlt: '終身監禁 確定',
    names: '正官庄everytime & 殺霸拖爾',
    date: '2027'
  },

  /* ---------- 인사말 ---------- */
  invitation: {
    engTitle: 'The King is Back',
    koTitle: '天下統一 大婚禮',
    lines: [
      '婚禮當日，缺席者斬立決！',
      '攜帶重金前來朝拜，違令者粉身碎骨！',
      '-正官庄,殺霸 내림-'
    ]
  },

  /* ---------- 신랑 / 신부 / 혼주 ---------- */
  family: {
    image: 'images/phoenix_gif.gif',   // 섹션 맨 위 가로 꽉 채움
    text: '날이 많이 덥습니다. 오시는 길 미끄러지시지 않게 삼계탕을 챙겨입으시고, 두꺼운 옷을 준비했으니 맛있게 드시길 바라겠습니다'
  },
  groom: {
    role: 'Groom', name: '서원우', relation: '친구',
    father: { name: '방카르', deceased: false },
    mother: { name: '고양이', deceased: false }
  },
  bride: {
    role: 'Bride', name: '박지원', relation: '화신',
    father: { name: '설사', deceased: false },
    mother: { name: '죽음', deceased: false }
  },

  /* ---------- 고인 표시 ---------- */
  deceasedMark: {
    color: '#8290ba'
  },

  /* ---------- 남편 / 아내 소개 ----------
     images: 확장자 생략 가능 (jpg/jpeg/png/webp 자동 탐색). 파일이 없으면 번호 칸으로 표시 */
  profiles: [
    {
      engTitle: '男子',
      title: '穷凶极恶正官庄Everytime',
      intro: 'Эорзеа 투기장에서 무예의 정점에 선 지상 최강의 흉악 무투가. 수만 번의 사투 끝에 고대의 주문 “ᠪᠠᠩᠬᠠᠷ ᠰᠡᠪᠰᠦᠭᠡᠷ” 을 각성하며 奧義을 완성했다. “패배를 알고 싶다”며 탈옥한 男性.',
      images: ['images/groom/01', 'images/groom/02', 'images/groom/03', 'images/groom/04', 'images/groom/05']
    },
    {
      engTitle: '女子',
      title: 'W̷E̷D̷D̷I̷N̷G̷_̷B̷R̷I̷D̷E̷ : 煞爆奪爾<Salvator>',
      intro: '차원의 틈을 찢고 기어 나온 폭력의 魔神. 첫 울음소리와 함께 북반구 해수면을 40m 끌어올리며 태평양 일대를 쑥대밭으로 만들었다. 지나간 자리엔 중력도, 오존층도, 생명체도 남지 않는 멸종의 짐승. 오늘 인류가 살아있는 이유는 단지 이 개체가 機̵嫌̵이 나쁘지 않기 떄̵문̵이̵다̵.',
      images: ['images/bride/01', 'images/bride/02', 'images/bride/03', 'images/bride/04', 'images/bride/05']
    }
  ],

  /* ---------- 공지 (캘린더 자리) ---------- */
  event: {
    engTitle: 'NOTICE',
    koTitle: '重要公告',
    items: [
      '2027년중 친구 전용 이벤트 추후 공지 예정(귀찮을시취소가능성있음)',
      'ffxiv 4번째 리마인드 언약식 2027년 9월중 예정'
    ],
    coord: '東black장막(X17, Y18)',
    map: 'images/map',       // 파판 맵 사진 (images/map.png 등)
    mapEmpty: 'MAP',         // 사진 없을 때 표시
    mapNote: '이 곳에 도달한 자네는 우리의 友이며, ffxiv를 하지 않는 자는 결혼식 참석을 위해 게임을 시작하라. 不參卽死'  // 맵 아래 작은 글씨
  },

  /* ---------- 갤러리 ---------- */
  gallery: {
    engTitle: 'From 2019',
    koTitle: '陷戒害瘟溢殺突',
    images: [
      'images/gallery/01',
      'images/gallery/02',
      'images/gallery/03',
      'images/gallery/04',
      'images/gallery/05',
      'images/gallery/06',
      'images/gallery/07',
      'images/gallery/08',
      'images/gallery/09'
    ]
  },

  /* ---------- 탈출 (방명록 자리) ---------- */
  escape: {
    engTitle: 'EXIT',
    koTitle: '원래의 사이트로 탈출하기',
    lead: '탈출 가능성.\nrandom 확률로 성공하다',
    button: '탈출하다!',
    url: 'https://jiwonwoo-marriage-announcement.vercel.app/'
  },

  /* ---------- 하단 문구 ---------- */
  footer: 'Suh Wonwoo & Park Jiwon · 2027.01.17',

  /* ---------- 첫 터치 화면 / 배경음악 ---------- */
  bgm: {
    src: 'images/bgm_ultima.mp3', // 무한 반복, 끄는 버튼 없음
    volume: 0.6,           // 0 ~ 1
    introText: 'TOUCH ME', // 첫 화면 문구
    explosion: 'images/explosion_gif.gif', // 터치하면 화면 전체에 한 번 재생 ('' 이면 생략)
    explosionMs: 2940      // 폭발 gif 길이 (ms). 이 시간이 지나면 타이틀 화면으로
  },

  /* ---------- 효과 ---------- */
  effects: {
    glitch: true,              // 치지직 사각형 효과
    glitchFront: true,         // true: 글자 위로 지나감 / false: 콘텐츠 뒤에서만
    glitchGap: [40, 600],      // 다음 치지직까지 간격 (ms) [최소, 최대]
    glitchLife: [40, 180],     // 사각형 하나가 떠 있는 시간 (ms)
    glitchCount: [1, 6],       // 한 번에 나오는 사각형 개수
    reveal: true,
    pageSnap: true,
    // 모바일 화면 넘김 감도: speed(px/ms) 이상 빠르게, distance(px) 이상 밀어야 넘어감. 숫자가 클수록 둔감
    swipe: { speed: 0.5, distance: 40 }
  }
};
