/* 한 화면씩 넘기기: 터치 스와이프 속도 필터
   - 모바일에서 세로 기본 스크롤을 막고, 손가락을 "빠르게 휙" 튕겼을 때만 다음/이전 화면으로 이동한다.
   - 천천히 끌거나 살짝 닿은 정도는 아무 반응 없음.
   - 감도는 config.js 의 effects.swipe (speed: px/ms, distance: px). 클수록 둔감.
   - 가로 스와이프(사진 슬라이드), 열린 모달, 입력칸(textarea 등)은 건드리지 않는다.
   - 화면보다 긴 섹션은 화면 높이씩 나눠서 넘긴다.
   - PC 마우스 휠/키보드는 기존 CSS scroll-snap 그대로. */
(function () {
  'use strict';
  const E = window.CONFIG.effects;
  if (!E.pageSnap || !E.swipe) return;
  const S = E.swipe;
  const root = document.documentElement;

  let startX = 0, startY = 0, lock = 'off', samples = [];
  let target = null, targetTimer;

  const skip = el => root.classList.contains('intro') ||
    (el.closest && el.closest('.modal.open, textarea, input, select'));

  document.addEventListener('touchstart', e => {
    if (e.touches.length !== 1 || skip(e.target)) { lock = 'off'; return; }
    const p = e.touches[0];
    startX = p.clientX; startY = p.clientY; lock = null;
    samples = [{ y: p.clientY, t: e.timeStamp }];
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (lock === 'off' || lock === 'x') return;
    if (e.touches.length !== 1) { lock = 'off'; return; }
    const p = e.touches[0];
    if (lock === null) {
      // 첫 움직임 방향으로 결정: 가로면 기본 동작(슬라이드)에 맡김
      lock = Math.abs(p.clientX - startX) > Math.abs(p.clientY - startY) ? 'x' : 'y';
      if (lock === 'x') return;
    }
    e.preventDefault(); // 세로 기본 스크롤 막기
    samples.push({ y: p.clientY, t: e.timeStamp });
    while (samples.length > 2 && e.timeStamp - samples[0].t > 200) samples.shift();
  }, { passive: false });

  document.addEventListener('touchend', e => {
    if (lock !== 'y') { lock = 'off'; return; }
    lock = 'off';
    const p = e.changedTouches[0];
    const now = e.timeStamp;
    // 손 떼기 직전 100ms 동안의 속도
    let from = samples[samples.length - 1];
    for (const s of samples) { if (now - s.t <= 100) { from = s; break; } }
    const dt = Math.max(16, now - from.t);
    const speed = (from.y - p.clientY) / dt;      // + : 위로 밀기 = 다음 화면
    const dist = startY - p.clientY;
    if (Math.abs(speed) < S.speed || Math.abs(dist) < S.distance) return;
    if (Math.sign(speed) !== Math.sign(dist)) return;
    go(speed > 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener('touchcancel', () => { lock = 'off'; }, { passive: true });

  // 멈출 위치 목록: 각 섹션 맨 위 (+ 화면보다 긴 섹션은 화면 높이 간격, 섹션 끝)
  function stops() {
    const h = window.innerHeight;
    const max = root.scrollHeight - h;
    const list = [];
    document.querySelectorAll('.card > section').forEach(sec => {
      const top = sec.getBoundingClientRect().top + window.scrollY;
      const end = top + sec.offsetHeight - h;
      let y = top;
      list.push(y);
      while (y + h < end - 1) { y += h; list.push(y); }
      if (end > y + 1) list.push(end);
    });
    return list.map(y => Math.round(Math.min(Math.max(y, 0), max)))
      .filter((y, i, a) => a.indexOf(y) === i).sort((a, b) => a - b);
  }

  function go(dir) {
    // 이동 중에 또 튕기면 진행 중인 목적지 기준으로 한 칸 더
    const cur = target !== null ? target : window.scrollY;
    const list = stops();
    const next = dir > 0 ? list.find(y => y > cur + 2) : list.reverse().find(y => y < cur - 2);
    if (next === undefined) return;
    target = next;
    clearTimeout(targetTimer);
    targetTimer = setTimeout(() => { target = null; }, 700);
    window.scrollTo({ top: next, behavior: 'smooth' });
  }
})();
