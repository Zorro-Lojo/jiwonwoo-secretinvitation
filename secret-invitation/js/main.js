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

    const list = $('contactList');
    [C.groom, C.bride].forEach(p => {
      const row = el('div', 'contact');
      const left = el('div');
      left.append(el('small', null, p.role), el('span', null, p.name));
      if (p.tel) left.appendChild(el('small', null, p.tel));
      row.appendChild(left);
      if (p.tel) {
        const a = el('a', null, '전화'); a.href = 'tel:' + p.tel.replace(/[^0-9+]/g, '');
        row.appendChild(a);
      } else {
        row.appendChild(el('small', null, '연락처 미등록'));
      }
      list.appendChild(row);
    });
    $('btnContact').addEventListener('click', () => openModal('modalContact'));
  }

  /* ---------- 4. 캘린더 + 카운트다운 ---------- */
  function renderCalendar() {
    const w = C.wedding;
    $('calDateNum').textContent = w.dateNum;
    $('calDateKo').textContent = w.dateKo;
    const cal = $('cal');
    ['일', '월', '화', '수', '목', '금', '토'].forEach((d, i) => cal.appendChild(el('div', 'h' + (i === 0 ? ' red' : ''), d)));
    const first = new Date(w.year, w.month - 1, 1).getDay();
    const last = new Date(w.year, w.month, 0).getDate();
    for (let i = 0; i < first; i++) cal.appendChild(el('div'));
    for (let d = 1; d <= last; d++) {
      const dow = (first + d - 1) % 7;
      let cls = 'd';
      if (d === w.day) cls += ' dday';
      else if (dow === 0 || (w.holidays || []).includes(d)) cls += ' red';
      cal.appendChild(el('div', cls, d));
    }

    const target = new Date(w.at).getTime();
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      let diff = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const d = Math.floor(diff / 86400); diff -= d * 86400;
      const h = Math.floor(diff / 3600); diff -= h * 3600;
      const m = Math.floor(diff / 60); const s = diff - m * 60;
      $('cdD').textContent = d; $('cdH').textContent = pad(h);
      $('cdM').textContent = pad(m); $('cdS').textContent = pad(s);
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- 5. 갤러리 ---------- */
  const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG', 'webp'];
  function imageCandidates(src) {
    const m = src.match(/^(.*?)(?:\.([a-zA-Z0-9]+))?$/);
    const base = m[1], ext = m[2];
    const exts = ext ? [ext].concat(IMAGE_EXTS.filter(e => e !== ext)) : IMAGE_EXTS;
    return exts.map(e => base + '.' + e);
  }

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
      const candidates = imageCandidates(src);
      let tryIdx = 0;
      img.addEventListener('load', () => {
        loaded.push({ i, src: img.src }); loaded.sort((a, b) => a.i - b.i);
      });
      img.addEventListener('error', () => {
        tryIdx++;
        if (tryIdx < candidates.length) { img.src = candidates[tryIdx]; return; }
        cell.classList.add('empty'); cell.disabled = true; img.remove();
        cell.appendChild(el('span', null, String(i + 1).padStart(2, '0')));
      });
      img.src = candidates[0];
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

  /* ---------- 6. 방명록 ---------- */
  function renderGuestbook() {
    const g = C.guestbook;
    const store = window.GuestbookStore;
    $('gbEng').textContent = g.engTitle;
    $('gbKo').textContent = g.koTitle;
    setLines($('gbLead'), g.lead);
    setLines($('cfMsg'), g.confirmText);

    const list = $('gbList');
    const load = async () => {
      let items;
      try { items = await store.listPublic(); } catch (e) { return; }
      list.textContent = '';
      items.forEach(it => {
        const box = el('div', 'gb-item');
        const who = el('div', 'who');
        who.append(el('span', null, it.name), el('time', null, it.date));
        box.append(who, el('div', 'msg', it.msg));
        list.appendChild(box);
      });
      buildSnow();
    };
    load();

    const form = $('gbForm');
    const yes = $('cfYes');
    const isPublic = () => form.elements.gbVis.value === 'public';
    const values = () => ({ name: $('gbName').value.trim(), msg: $('gbMsg').value.trim(), pub: isPublic() });

    const updateHelp = () => { $('gbVisHelp').textContent = isPublic() ? g.publicHelp : g.privateHelp; };
    form.querySelectorAll('input[name="gbVis"]').forEach(r => r.addEventListener('change', updateHelp));
    form.addEventListener('reset', () => setTimeout(updateHelp));
    updateHelp();

    $('btnWrite').addEventListener('click', () => { openModal('modalWrite'); $('gbName').focus(); });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = values();
      if (!v.name || !v.msg) return;
      closeModals(); openModal('modalConfirm');
    });

    $('cfNo').addEventListener('click', () => { closeModals(); openModal('modalWrite'); });

    yes.addEventListener('click', async () => {
      const v = values();
      if (!v.name || !v.msg || yes.disabled) return;
      yes.disabled = true;
      try {
        await store.add(v.name, v.msg, v.pub);
        form.reset(); closeModals(); toast(g.doneText);
        if (v.pub) load();
      } catch (err) {
        closeModals(); openModal('modalWrite');
        toast('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        yes.disabled = false;
      }
    });

    $('btnShare').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); toast('링크가 복사되었습니다.'); }
      catch (e) { toast('복사에 실패했습니다. 주소창의 링크를 복사해 주세요.'); }
    });

    $('foot').textContent = C.footer;
  }

  /* ---------- 효과: 눈 ---------- */
  function buildSnow() {
    const box = $('snow');
    box.textContent = '';
    if (!C.effects.snow) return;
    const h = document.querySelector('.card').offsetHeight;
    const count = Math.round(h / C.effects.snowGap);
    const imgs = C.effects.snowImages;
    const [minDur, maxDur] = C.effects.snowDuration;
    const totalWeight = imgs.reduce((sum, it) => sum + it.weight, 0);
    const pick = () => {
      let r = Math.random() * totalWeight;
      for (const it of imgs) { r -= it.weight; if (r < 0) return it; }
      return imgs[imgs.length - 1];
    };
    const tints = buildSnowTints();
    for (let i = 0; i < count; i++) {
      const s = el('img');
      const it = pick();
      const id = tints[Math.floor(Math.random() * tints.length)];
      s.style.filter = 'url(#' + id + ') drop-shadow(0 0 1px rgba(190, 210, 235, .6))';
      s.src = it.src;
      s.alt = ''; s.draggable = false;
      const [minSize, maxSize] = it.size;
      const size = minSize + Math.random() * (maxSize - minSize);
      const dur = minDur + Math.random() * (maxDur - minDur);
      s.style.left = (Math.random() * 100) + '%';
      s.style.width = s.style.height = size.toFixed(1) + 'px';
      s.style.opacity = (0.65 + Math.random() * 0.35).toFixed(2);
      s.style.setProperty('--dist', (h + 60) + 'px');
      s.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
      s.style.animationDuration = dur + 's';
      s.style.animationDelay = (-Math.random() * dur) + 's';
      box.appendChild(s);
    }
  }

  /* 눈송이 색: from ~ to 사이를 steps 단계로 나눈 SVG 색 필터를 만들어 id 목록 반환.
     (원본 SVG 색은 무시하고 모양만 사용. mask-image 는 file:// 에서 막혀서 필터 사용) */
  function buildSnowTints() {
    const c = C.effects.snowColor;
    let svg = $('snowTints');
    if (!svg) {
      const NS = 'http://www.w3.org/2000/svg';
      svg = document.createElementNS(NS, 'svg');
      svg.id = 'snowTints';
      svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.position = 'absolute';
      const steps = Math.max(2, c.steps);
      for (let n = 0; n < steps; n++) {
        const t = n / (steps - 1);
        const rgb = [0, 1, 2].map(k => (c.from[k] + (c.to[k] - c.from[k]) * t) / 255);
        const f = document.createElementNS(NS, 'filter');
        f.id = 'snowTint' + n;
        f.setAttribute('color-interpolation-filters', 'sRGB');
        const m = document.createElementNS(NS, 'feColorMatrix');
        m.setAttribute('type', 'matrix');
        m.setAttribute('values',
          '0 0 0 0 ' + rgb[0].toFixed(4) + ' ' +
          '0 0 0 0 ' + rgb[1].toFixed(4) + ' ' +
          '0 0 0 0 ' + rgb[2].toFixed(4) + ' ' +
          '0 0 0 1 0');
        f.appendChild(m);
        svg.appendChild(f);
      }
      document.body.appendChild(svg);
    }
    return Array.from(svg.querySelectorAll('filter'), f => f.id);
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

  /* ---------- 공통: 모달 / 토스트 ---------- */
  function openModal(id) { $(id).classList.add('open'); }
  function closeModals() { document.querySelectorAll('.modal').forEach(m => m.classList.remove('open')); }
  function initModals() {
    document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeModals));
    document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModals(); }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });
  }
  let toastTimer;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2000);
  }

  /* ---------- 실행 ---------- */
  initModals();
  renderCover();
  renderInvitation();
  renderFamily();
  renderCalendar();
  renderGallery();
  renderGuestbook();
  initReveal();
  buildSnow();
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(buildSnow, 300); });
  window.addEventListener('load', buildSnow);
})();
