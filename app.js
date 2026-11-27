/* babuuu. 3周年記念 キャンペーン会場。設定は campaign-data.js */
(function () {
  'use strict';
  const data = window.ANNIV_DATA;
  const $ = (id) => document.getElementById(id);
  const FLAG_COLORS = ['#FF6B97', '#FFCB2E', '#6FC0E4', '#EC5586', '#FFFFFF'];
  const COLORS = {
    pink: { c: '#EC5586', cl: '#FFE4EC' },
    yellow: { c: '#E0A800', cl: '#FFF6D6' },
    blue: { c: '#2E9BD0', cl: '#CDEAF6' }
  };
  const BOARD_TINTS = ['pink', 'blue', 'yellow'];
  const WEEK = '日月火水木金土';

  /** @param {string} iso @returns {{md:string, wd:string, hm:string}} 日本時間の月日・曜日・時刻 */
  function jst(iso) {
    const d = new Date(new Date(iso).getTime() + 9 * 3600 * 1000);
    const hm = String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
    return { md: (d.getUTCMonth() + 1) + '/' + d.getUTCDate(), wd: WEEK[d.getUTCDay()], hm };
  }
  const dayHtml = (iso) => { const t = jst(iso); return '<b>' + t.md + '</b>(' + t.wd + ')'; };

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function tint(node, name) {
    const t = COLORS[name] || COLORS.pink;
    node.style.setProperty('--c', t.c);
    node.style.setProperty('--cl', t.cl);
    return node;
  }

  function addFlags() {
    document.querySelectorAll('.flags').forEach((box) => {
      const count = Math.max(10, Math.round(box.offsetWidth / 40));
      for (let i = 0; i < count; i++) {
        const f = el('i');
        f.style.setProperty('--f', FLAG_COLORS[i % FLAG_COLORS.length]);
        f.style.setProperty('--i', i);
        box.append(f);
      }
    });
  }

  /** 総選挙の期間と状態（開催前／投票受付中／結果発表） */
  function renderSenkyo() {
    const s = data.senkyo;
    const now = Date.now();
    const term = dayHtml(s.start) + ' 〜 ' + dayHtml(s.end);
    document.querySelectorAll('.js-senkyo-term').forEach((n) => { n.innerHTML = term; });
    document.querySelectorAll('.js-senkyo').forEach((a) => {
      if (s.url) { a.href = s.url; } else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); }
    });
    $('winners').textContent = s.winners;
    let state = '';
    if (now < new Date(s.start).getTime()) state = jst(s.start).md + ' 0:00 投票スタート';
    else if (now <= new Date(s.end).getTime()) state = 'ただいま投票受付中';
    else if (now < new Date(s.finalDate).getTime()) state = '投票は終了しました';
    else state = '結果発表中';
    $('senkyoState').textContent = state;
    $('senkyoSched').innerHTML = '<span class="nw">途中経過 ' + jst(s.firstUpdate).md + '(' + jst(s.firstUpdate).wd + ')から</span>　<span class="nw">結果発表 ' + jst(s.finalDate).md + '(' + jst(s.finalDate).wd + ')</span>';
    $('senkyoNote').textContent = '投票すると、' + jst(s.couponStart).md + '〜' + jst(s.couponEnd).md + 'に店内で使えるクーポンを獲得できます';
    const board = $('board');
    for (let i = 0; i < 12; i++) {
      const p = tint(el('span', 'post', '<b>' + (i + 1) + '</b>'), BOARD_TINTS[i % 3]);
      p.style.setProperty('--i', i);
      board.append(p);
    }
  }

  /** キャンペーン02〜：内容が決まったものは大きく、未定は「準備中」の箱 */
  function renderOthers() {
    if (!$('boxes')) return;
    data.others.forEach((c) => {
      const no = String(c.no).padStart(2, '0');
      const isOpen = Boolean(c.title);
      const box = tint(el('article', 'box' + (isOpen ? ' box--open' : '')), c.color);
      box.id = 'c' + c.no;
      box.append(el('p', 'cno', '<span>キャンペーン</span><b>' + no + '</b>'));
      if (!isOpen) {
        const g = el('div', 'gift', '<b>?</b>');
        g.style.setProperty('--d', (c.no * -0.8) + 's');
        box.append(g, el('p', 'box__t', '準備中'), el('p', 'box__s', 'おたのしみに'));
      } else {
        box.append(el('h3', 'box__t', c.title));
        if (c.lead) box.append(el('p', 'box__s', c.lead));
        if (c.term) box.append(el('p', 'box__term', c.term));
        if (c.url) {
          const a = el('a', 'box__go', '詳しくはこちら');
          a.href = c.url;
          box.append(a);
        }
      }
      $('boxes').append(box);
    });
  }

  /** 各キャンペーンの「開催前／開催中／終了」の表示（data-start / data-end） */
  function renderStates() {
    const now = Date.now();
    document.querySelectorAll('.cp[data-start]').forEach((sec) => {
      const start = new Date(sec.dataset.start).getTime();
      const end = new Date(sec.dataset.end).getTime();
      const label = sec.querySelector('.js-state');
      let text = 'ただいま開催中';
      let state = 'open';
      if (now < start) { text = jst(sec.dataset.start).md + ' スタート'; state = 'before'; }
      else if (now > end) { text = 'このキャンペーンは終了しました'; state = 'closed'; }
      sec.dataset.state = state;
      if (label) label.textContent = text;
    });
  }

  /** FVの目次とPC左メニュー */
  function renderNav() {
    const items = [{ no: 1, color: 'pink', title: '推しアイテム総選挙', main: true }].concat(data.others);
    items.forEach((c) => {
      const no = String(c.no).padStart(2, '0');
      const isSoon = !c.main && !c.title;
      const label = c.main ? '推しアイテム<br>総選挙' : (c.title || '準備中');
      const tile = tint(el('a', 'tile' + (c.main ? ' tile--main' : '') + (isSoon ? ' tile--soon' : ''), '<span class="tile__no">' + no + '</span><span class="tile__t">' + label + '</span>'), c.color);
      tile.href = '#c' + c.no;
      $('fvNav').append(tile);
      const g = tint(el('a', isSoon ? 'is-soon' : '', '<b>' + no + '</b><span>' + (c.main ? '推しアイテム総選挙' : (c.menu || c.title || '準備中')) + '</span>'), c.color);
      g.href = '#c' + c.no;
      $('sideNav').append(g);
    });
  }

  $('demo').hidden = !data.demo;
  renderNav();
  renderSenkyo();
  renderOthers();
  renderStates();
  addFlags();
})();
