/* babuuu. 3周年記念 キャンペーン会場 v3
   各キャンペーン(.cp)の data-start / data-end を見て「◯/◯ スタート」「ただいま開催中」「終了しました」を切り替える */
(function () {
  'use strict';
  const WEEK = '日月火水木金土';

  /** @param {string} iso @returns {string} 日本時間の「月/日(曜)」 */
  function md(iso) {
    const d = new Date(new Date(iso).getTime() + 9 * 3600 * 1000);
    return (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '(' + WEEK[d.getUTCDay()] + ')';
  }

  const now = Date.now();
  document.querySelectorAll('.cp[data-start]').forEach((sec) => {
    const start = new Date(sec.dataset.start).getTime();
    const end = new Date(sec.dataset.end).getTime();
    let text = 'ただいま開催中';
    let state = 'open';
    if (now < start) { text = md(sec.dataset.start) + ' スタート'; state = 'before'; }
    else if (now > end) { text = 'このキャンペーンは終了しました'; state = 'closed'; }
    sec.dataset.state = state;
    const label = sec.querySelector('.cp__state');
    if (label) label.textContent = text;
  });
})();

/* ===== おたのしみの仕掛け ===== */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* FVの動物：タップ（クリック）で吹き出しのあいさつ */
  document.querySelectorAll('.guest').forEach((g) => {
    let timer = 0;
    g.addEventListener('click', () => {
      g.classList.remove('is-hi');
      void g.offsetWidth; // アニメーションをもう一度動かす
      g.classList.add('is-hi');
      clearTimeout(timer);
      timer = setTimeout(() => g.classList.remove('is-hi'), 1800);
    });
  });

  /* パーティーのプレゼント交換：箱を選ぶと、動物がおすすめ商品を持ってくる */
  const data = window.PICKS;
  const out = document.getElementById('swapOut');
  const boxes = Array.from(document.querySelectorAll('.box'));
  if (data && out && boxes.length) {
    const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ESC[c]);
    let last = -1;
    const pick = () => {
      let i = Math.floor(Math.random() * data.items.length);
      if (data.items.length > 1 && i === last) i = (i + 1) % data.items.length;
      last = i;
      return data.items[i];
    };
    const reset = () => {
      boxes.forEach((b) => { b.classList.remove('is-open'); b.disabled = false; });
      out.hidden = true;
    };
    const show = (box, it, face) => {
      box.classList.remove('is-shake');
      box.classList.add('is-open');
      box.style.setProperty('--face', 'url("images/il/face-' + face + '.png")');
      out.innerHTML =
        '<p class="swap__hi"><img src="images/il/face-' + face + '.png" alt="" width="64" height="64"><span>これ、おすすめだよ！</span></p>' +
        '<a class="swap__card" href="' + esc(it.url) + '" target="_blank" rel="noopener">' +
        '<img src="' + esc(it.img) + '" alt="' + esc(it.name) + '" width="600" height="600">' +
        '<span class="swap__b"><em class="rec__cp rec__cp--' + esc(it.cp) + '">キャンペーン' + esc(it.cp) + ' 対象</em>' +
        '<span class="swap__brand">' + esc(it.brand) + '</span><span class="swap__name">' + esc(it.name) + '</span>' +
        '<span class="swap__price"><b>' + esc(it.price) + '</b>円<small>税込・送料無料</small></span>' +
        '<span class="swap__go">商品ページを見る</span></span></a>' +
        '<button class="swap__again" type="button">もう一回えらぶ</button>';
      out.hidden = false;
      out.classList.remove('is-in');
      void out.offsetWidth;
      out.classList.add('is-in');
      out.querySelector('.swap__again').addEventListener('click', reset);
    };
    boxes.forEach((box) => box.addEventListener('click', () => {
      if (box.disabled) return;
      const it = pick();
      const face = data.faces[Math.floor(Math.random() * data.faces.length)];
      boxes.forEach((b) => { b.disabled = true; });
      box.classList.add('is-shake');
      setTimeout(() => show(box, it, face), reduce ? 0 : 650);
    }));
  }

  /* スクロールで少しずつ登場（JSが動くときだけ隠してから出す） */
  if (!reduce && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.cp__head, .gift, .eq, .items__h, .boxes, .soon__in, .tile');
    document.documentElement.classList.add('js-rv');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }), { threshold: 0.15 });
    targets.forEach((t) => { t.classList.add('rv'); io.observe(t); });
  }
})();
