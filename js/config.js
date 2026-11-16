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
  groom: {
    role: 'Groom', name: '서원우', relation: '친구', tel: '010-9934-5644',
    father: { name: '방카르', deceased: false },
    mother: { name: '고양이', deceased: false }
  },
  bride: {
    role: 'Bride', name: '박지원', relation: '화신', tel: '010-5539-6199',
    father: { name: '방구', deceased: false },
    mother: { name: '죽음', deceased: false }
  },

  /* ---------- 고인 표시 ---------- */
  deceasedMark: {
    color: '#8290ba'
  },

  /* ---------- 예식 일시 / 캘린더 ---------- */
  wedding: {
    at: '2027-01-17T14:00:00+09:00',
    year: 2027, month: 1, day: 17,
    holidays: [1],
    dateNum: '2027.01.17',
    dateKo: '일요일 오후 2시'
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

  /* ---------- 방명록 ---------- */
  guestbook: {
    engTitle: 'Guestbook',
    koTitle: '방명록',
    lead: '간단한 축하글을 남겨주시면\n전부 소중히 읽고 간직해두겠습니다.',
    showCount: 5,
    privateHelp: '저희에게만 비밀스럽게 전달됩니다.',
    publicHelp: '사이트에 이름과 메시지가 표시됩니다.',
    confirmText: '한 번 보내면 삭제하거나 수정할 수 없습니다.\n이대로 보낼까요?',
    doneText: '축하 메시지가 전달되었습니다.',
    storageKey: 'wedding-guestbook-20270117',
    supabase: {
      url: 'https://ixqhjpxrsipjxduhajjs.supabase.co',
      key: 'sb_publishable_i695J4ZqRYJga0q7um_x0g_H61YTy7P'
    }
  },

  /* ---------- 하단 문구 ---------- */
  footer: 'Suh Wonwoo & Park Jiwon · 2027.01.17',

  /* ---------- 효과 ---------- */
  effects: {
    snow: true,
    snowImages: [
      { src: 'images/snowflake_01.svg', size: [10, 20], weight: 2 },
      { src: 'images/snowflake_02.svg', size: [10, 20], weight: 2 },
      { src: 'images/snowflake_03.svg', size: [3, 7],   weight: 1 }
    ],
    snowColor: { from: [255, 255, 255], to: [186, 208, 253], steps: 10 },
    snowGap: 56,
    snowDuration: [40, 117],
    reveal: true,
    pageSnap: true
  }
};
