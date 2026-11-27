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
