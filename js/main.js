(function () {
  'use strict';
  const C = window.CONFIG;
  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const setLines = (node, str) => {
    node.textContent = '';
    String(str).split('\n').forEach((part, i) => {
      if (i) node.appendChild(document.createElement('br'));
      node.appendChild(document.createTextNode(part));
    });
  };

  /* ---------- 공통: 이미지 확장자 자동 탐색 ----------
     src 에 확장자가 없거나 틀려도 jpg/jpeg/png/webp 순서로 시도. 전부 없으면 onEmpty() */
  const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG', 'webp'];
  function imageCandidates(src) {
    const m = src.match(/^(.*?)(?:\.([a-zA-Z0-9]+))?$/);
    const base = m[1], ext = m[2];
    const exts = ext ? [ext].concat(IMAGE_EXTS.filter(e => e !== ext)) : IMAGE_EXTS;
    return exts.map(e => base + '.' + e);
  }
  function loadImage(img, src, onEmpty) {
    const candidates = imageCandidates(src);
    let tryIdx = 0;
    img.addEventListener('error', () => {
      tryIdx++;
      if (tryIdx < candidates.length) { img.src = candidates[tryIdx]; return; }
      onEmpty();
    });
    img.src = candidates[0];
  }

  /* ---------- 고인 표시 아이콘 ---------- */
  const RIBBON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-2.2 0-3.5 1.6-3.5 3.4 0 2.6 2 4.6 3.5 6.6 1.5-2 3.5-4 3.5-6.6C15.5 4.6 14.2 3 12 3z"/><path d="M12 13l-5 8M12 13l5 8"/></svg>';
  function deceasedMark() {
    const span = el('span', 'mark');
    span.style.color = C.deceasedMark.color;
    span.setAttribute('aria-label', '고인');
    span.innerHTML = RIBBON_SVG;
    return span;
  }

  /* ---------- 1. 커버 ---------- */
  function renderCover() {
    document.title = C.pageTitle;
    const img = el('img'); img.src = C.cover.image; img.alt = C.cover.imageAlt;
    $('coverArt').appendChild(img);
    $('coverNames').textContent = C.cover.names;
    $('coverDate').textContent = C.cover.date;
  }

  /* ---------- 2. 인사말 ---------- */
  function renderInvitation() {
    $('invEng').textContent = C.invitation.engTitle;
    $('invKo').textContent = C.invitation.koTitle;
    const body = $('invBody');
    C.invitation.lines.forEach(line => { const p = el('p'); setLines(p, line); body.appendChild(p); });
  }

  /* ---------- 3. 혼주 ---------- */
  function renderFamily() {
    const f = C.family;
    if (f.image) { const img = el('img'); img.src = f.image; img.alt = ''; $('familyArt').appendChild(img); }
    else $('familyArt').remove();
    setLines($('familyText'), f.text || '');
    const rows = $('familyRows');
    [C.groom, C.bride].forEach(p => {
      const row = el('div', 'row');
      const parent = who => {
        const wrap = el('span', 'parent');
        if (who.deceased) wrap.appendChild(deceasedMark());
        wrap.appendChild(document.createTextNode(who.name));
        return wrap;
      };
      row.append(
        parent(p.father), el('span', 'dot', '·'), parent(p.mother),
        el('span', 'of', '의'), el('span', 'rel', p.relation), el('span', null, p.name)
      );
      rows.appendChild(row);
    });
  }

  /* ---------- 4·5. 남편 / 아내 소개 (좌우 슬라이드) ---------- */
  function renderProfiles() {
    document.querySelectorAll('[data-profile]').forEach(sec => {
      const p = C.profiles[Number(sec.dataset.profile)];
      if (!p) { sec.remove(); return; }
      sec.querySelector('.eng-title').textContent = p.engTitle;
      sec.querySelector('.ko-title').textContent = p.title;
      setLines(sec.querySelector('.body'), p.intro);

      const slider = sec.querySelector('.slider');
      const count = sec.querySelector('.slider-count');
      p.images.forEach((src, i) => {
        const cell = el('div', 's-item');
        const img = el('img'); img.alt = p.title + ' 사진 ' + (i + 1); img.draggable = false;
        loadImage(img, src, () => {
          img.remove(); cell.classList.add('empty');
          cell.appendChild(el('span', null, String(i + 1).padStart(2, '0')));
        });
        cell.appendChild(img);
        slider.appendChild(cell);
      });

      const cells = slider.children;
      const step = () => cells.length > 1 ? cells[1].offsetLeft - cells[0].offsetLeft : slider.clientWidth;
      const current = () => Math.max(0, Math.min(cells.length - 1, Math.round(slider.scrollLeft / step())));
      const update = () => { count.textContent = (current() + 1) + ' / ' + cells.length; };
      const go = d => slider.scrollTo({ left: (current() + d) * step(), behavior: 'smooth' });
      slider.addEventListener('scroll', update, { passive: true });
      sec.querySelector('.s-nav.prev').addEventListener('click', () => go(-1));
      sec.querySelector('.s-nav.next').addEventListener('click', () => go(1));
      update();
    });
  }

  /* ---------- 6. 공지 ---------- */
  function renderEvent() {
    const e = C.event;
    $('evEng').textContent = e.engTitle;
    $('evKo').textContent = e.koTitle;
    const list = $('evList');
    e.items.forEach(t => { const d = el('div', 'ev-item'); setLines(d, t); list.appendChild(d); });
    if (e.coord) list.appendChild(el('div', 'ev-coord', e.coord));

    const map = $('evMap');
    const img = el('img'); img.alt = '맵 사진';
    loadImage(img, e.map, () => { img.remove(); map.appendChild(el('span', null, e.mapEmpty)); });
    map.appendChild(img);
    setLines($('evNote'), e.mapNote || '');
  }

  /* ---------- 7. 갤러리 ---------- */
  function renderGallery() {
    const g = C.gallery;
    $('galEng').textContent = g.engTitle;
    $('galKo').textContent = g.koTitle;
    const grid = $('galleryGrid');
    const loaded = [];
    let current = 0;

    g.images.forEach((src, i) => {
      const cell = el('button', 'g-item'); cell.type = 'button';
      cell.setAttribute('aria-label', '사진 ' + (i + 1));
      const img = el('img'); img.alt = '갤러리 사진 ' + (i + 1); img.loading = 'lazy';
      img.addEventListener('load', () => {
        loaded.push({ i, src: img.src }); loaded.sort((a, b) => a.i - b.i);
      });
      loadImage(img, src, () => {
        cell.classList.add('empty'); cell.disabled = true; img.remove();
        cell.appendChild(el('span', null, String(i + 1).padStart(2, '0')));
      });
      cell.appendChild(img);
      cell.addEventListener('click', () => {
        const idx = loaded.findIndex(x => x.i === i);
        if (idx >= 0) show(idx);
      });
      grid.appendChild(cell);
    });

    /* 확대 보기: 가로 스크롤 트랙. 터치 스와이프·트랙패드는 브라우저 기본 스크롤,
       마우스는 휠/드래그를 한 장씩 넘기기로 변환 */
    const lb = $('lightbox'), track = $('lbTrack'), count = $('lbCount');
    const slideW = () => track.clientWidth || 1;
    const updateCount = () => {
      current = Math.max(0, Math.min(loaded.length - 1, Math.round(track.scrollLeft / slideW())));
      count.textContent = (current + 1) + ' / ' + loaded.length;
    };
    const goTo = (idx, smooth) => {
      idx = Math.max(0, Math.min(loaded.length - 1, idx));
      track.scrollTo({ left: idx * slideW(), behavior: smooth ? 'smooth' : 'auto' });
    };

    const show = idx => {
      if (!loaded.length) return;
      track.textContent = '';
      loaded.forEach(it => {
        const slide = el('div', 'lb-slide');
        const img = el('img'); img.src = it.src; img.alt = '갤러리 사진 ' + (it.i + 1);
        img.draggable = false;
        slide.appendChild(img);
        track.appendChild(slide);
      });
      openModal('lightbox');
      goTo(idx, false);
      updateCount();
    };

    track.addEventListener('scroll', updateCount, { passive: true });
    // 사진 바깥(어두운 배경) 탭하면 닫기
    track.addEventListener('click', e => {
      if (dragMoved) return;
      if (e.target.tagName !== 'IMG') closeModals();
    });

    // 마우스 휠(세로) → 한 장씩 넘기기. 가로 휠/트랙패드는 기본 스크롤에 맡김
    let wheelLock = 0;
    track.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      const now = Date.now();
      if (now < wheelLock) return;
      wheelLock = now + 450;
      goTo(current + (e.deltaY > 0 ? 1 : -1), true);
    }, { passive: false });

    // 마우스 드래그로 넘기기 (터치는 기본 스와이프 사용)
    let dragX = null, dragStart = 0, dragMoved = false;
    track.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragX = e.clientX; dragStart = track.scrollLeft; dragMoved = false;
      track.classList.add('dragging');
    });
    window.addEventListener('pointermove', e => {
      if (dragX === null) return;
      const dx = e.clientX - dragX;
      if (Math.abs(dx) > 5) dragMoved = true;
      track.scrollLeft = dragStart - dx;
    });
    window.addEventListener('pointerup', e => {
      if (dragX === null) return;
      const dx = e.clientX - dragX;
      const startIdx = Math.round(dragStart / slideW());
      dragX = null;
      track.classList.remove('dragging');
      goTo(Math.abs(dx) > slideW() * 0.15 ? startIdx + (dx < 0 ? 1 : -1) : startIdx, true);
      setTimeout(() => { dragMoved = false; }, 0);
    });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') goTo(current - 1, true);
      if (e.key === 'ArrowRight') goTo(current + 1, true);
    });
  }

  /* ---------- 8. 탈출 ---------- */
  function renderEscape() {
    const e = C.escape;
    $('esEng').textContent = e.engTitle;
    $('esKo').textContent = e.koTitle;
    setLines($('esLead'), e.lead);
    const a = $('btnEscape');
    a.textContent = e.button;
    a.href = e.url;
    $('foot').textContent = C.footer;
  }

  /* ---------- 효과: 페이지 스냅 / 페이드 ---------- */
  function initReveal() {
    if (C.effects.pageSnap) document.documentElement.classList.add('snap');
    const els = document.querySelectorAll('.reveal');
    if (!C.effects.reveal || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('on')); return; }
    const setOn = (sec, on) => sec.querySelectorAll('.reveal').forEach((r, i) => {
      r.style.transitionDelay = on ? (i * 0.2) + 's' : '0s';
      r.classList.toggle('on', on);
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => setOn(en.target, en.isIntersecting));
    }, { rootMargin: '-40% 0px -40% 0px' });
    document.querySelectorAll('.card > section').forEach(s => io.observe(s));
  }

  /* ---------- 공통: 모달 ---------- */
  function openModal(id) { $(id).classList.add('open'); }
  function closeModals() { document.querySelectorAll('.modal').forEach(m => m.classList.remove('open')); }
  function initModals() {
    document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeModals));
    document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModals(); }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });
  }

  /* ---------- 실행 ---------- */
  initModals();
  renderCover();
  renderInvitation();
  renderFamily();
  renderProfiles();
  renderEvent();
  renderGallery();
  renderEscape();
  initReveal();
})();
