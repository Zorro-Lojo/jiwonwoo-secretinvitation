/* 효과: 글리치 — 랜덤 RGB / 랜덤 투명도(0~1) 직사각형이 불규칙하게 번쩍였다 사라짐.
   설정은 config.js 의 effects.glitch* */
(function () {
  'use strict';
  const E = window.CONFIG.effects;
  const box = document.getElementById('glitch');
  if (!E.glitch || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { box.remove(); return; }
  if (E.glitchFront) box.classList.add('front');

  const rand = (a, b) => a + Math.random() * (b - a);
  const pool = [];

  function spawn() {
    const W = window.innerWidth, H = window.innerHeight;
    const n = Math.round(rand(E.glitchCount[0], E.glitchCount[1]));
    for (let i = 0; i < n; i++) {
      const r = pool.pop() || document.createElement('i');
      const bar = Math.random() < 0.65; // 대부분은 가로로 긴 띠, 나머지는 덩어리
      const w = bar ? rand(0.25, 1.1) * W : rand(8, 140);
      const h = bar ? rand(2, 22) : rand(8, 100);
      const s = r.style;
      s.left = rand(-0.2 * W, W).toFixed(0) + 'px';
      s.top = rand(0, H).toFixed(0) + 'px';
      s.width = w.toFixed(0) + 'px';
      s.height = h.toFixed(0) + 'px';
      s.background = 'rgb(' + [0, 0, 0].map(() => Math.floor(Math.random() * 256)).join(',') + ')';
      s.opacity = Math.random().toFixed(2);
      box.appendChild(r);
      setTimeout(() => { r.remove(); pool.push(r); }, rand(E.glitchLife[0], E.glitchLife[1]));
    }
    setTimeout(spawn, rand(E.glitchGap[0], E.glitchGap[1]));
  }
  spawn();
})();
