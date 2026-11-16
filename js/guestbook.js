(function () {
  'use strict';
  const g = window.CONFIG.guestbook;
  const sb = g.supabase || {};
  const useServer = !!(sb.url && sb.key);
  const TABLE = sb.table || 'guestbook';
  const LIMIT = g.showCount || 5;

  const fmtDate = iso => {
    const d = new Date(iso);
    return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
  };

  /* ---------- 서버 (Supabase REST API) ---------- */
  const endpoint = sb.url ? sb.url.replace(/\/+$/, '') + '/rest/v1/' + TABLE : '';
  const headers = { apikey: sb.key, 'Content-Type': 'application/json' };

  async function serverList() {
    const q = '?select=name,message,created_at&is_public=eq.true&order=created_at.desc&limit=' + LIMIT;
    const res = await fetch(endpoint + q, { headers, cache: 'no-store' });
    if (!res.ok) throw new Error('list ' + res.status);
    return (await res.json()).map(r => ({ name: r.name, msg: r.message, date: fmtDate(r.created_at) }));
  }

  async function serverAdd(name, msg, isPublic) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: Object.assign({ Prefer: 'return=minimal' }, headers),
      body: JSON.stringify({ name, message: msg, is_public: isPublic })
    });
    if (!res.ok) throw new Error('add ' + res.status);
  }

  /* ---------- 로컬 (브라우저 저장) ---------- */
  function localAll() {
    try { return JSON.parse(localStorage.getItem(g.storageKey) || '[]'); } catch (e) { return []; }
  }
  async function localList() {
    return localAll().filter(it => it.isPublic).slice(0, LIMIT)
      .map(it => ({ name: it.name, msg: it.msg, date: fmtDate(it.date) }));
  }
  async function localAdd(name, msg, isPublic) {
    const items = localAll();
    items.unshift({ name, msg, isPublic, date: new Date().toISOString() });
    try { localStorage.setItem(g.storageKey, JSON.stringify(items)); } catch (e) {}
  }

  window.GuestbookStore = {
    listPublic: useServer ? serverList : localList,
    add: useServer ? serverAdd : localAdd
  };
})();
