/* 첫 터치 화면 + 배경음악 (강제 재생, 끄는 버튼 없음)
   - 모바일 브라우저는 사용자 터치 전에는 소리 재생을 막으므로,
     처음에 "TOUCH ME" 화면을 띄우고 터치하는 순간 음악을 시작한다.
   - 터치 전까지 html.intro 클래스가 붙어 있어 스크롤과 .reveal 등장이 멈춰 있다. */
(function () {
  'use strict';
  const C = window.CONFIG.bgm;
  const root = document.documentElement;
  const intro = document.getElementById('intro');

  document.getElementById('introText').textContent = C.introText;

  // 새로고침 시 이전 스크롤 위치로 돌아가지 않도록
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  root.classList.add('intro');

  const audio = new Audio(C.src);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = C.volume;

  const play = () => { const p = audio.play(); if (p && p.catch) p.catch(() => {}); };

  // 폭발 gif 미리 받아두기 (<img> 를 미리 만들면 gif 가 터치 전에 재생돼버려서 preload 링크만)
  if (C.explosion) {
    const link = document.createElement('link');
    link.rel = 'preload'; link.as = 'image'; link.href = C.explosion;
    document.head.appendChild(link);
  }

  const finish = () => {
    window.scrollTo(0, 0);
    intro.classList.add('hide');
    root.classList.remove('intro');
    setTimeout(() => intro.remove(), 900);
  };

  let started = false;
  intro.addEventListener('click', () => {
    if (started) return;
    started = true;
    play(); // 터치 이벤트 안에서 바로 호출해야 재생 허용됨
    if (!C.explosion) { finish(); return; }

    // 터치 → 화면 전체 폭발 gif 한 번 → 타이틀 화면
    intro.classList.add('boom');
    const img = document.createElement('img');
    img.className = 'intro-boom'; img.alt = '';
    let done = false;
    const end = () => { if (!done) { done = true; finish(); } };
    img.addEventListener('load', () => setTimeout(end, C.explosionMs));
    img.addEventListener('error', end);
    setTimeout(end, C.explosionMs + 6000); // 너무 오래 못 받으면 그냥 넘어감
    img.src = C.explosion;
    intro.appendChild(img);
  });

  // 다른 앱/탭으로 나가면 멈추고, 돌아오면 무조건 다시 재생
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audio.pause();
    else if (!root.classList.contains('intro')) play();
  });
})();
