/* babuuu. 3周年記念 キャンペーン会場の設定。【仮】と書いた値は先方確認後に差し替える
   url が空のキャンペーンは「準備中」で表示され、ボタンは押せない */
window.ANNIV_DATA = {
  demo: true, // 本番は false（「見本データ」の帯が消える）
  // 推しアイテム総選挙（GOLDの特設会場）。日付は総選挙ページの shop-data.js と同じ値にそろえる
  senkyo: {
    url: './oshi/', // 【仮】総選挙ページの公開URL。例 https://www.rakuten.ne.jp/gold/babuuu/3rd/oshi/
    start: '2026-12-03T00:00:00+09:00', // 【仮】
    end: '2026-12-25T23:59:59+09:00', // 【仮】
    firstUpdate: '2026-12-07T12:00:00+09:00', // 【仮】途中経過の初回
    finalDate: '2026-12-26T12:00:00+09:00', // 【仮】結果発表
    couponStart: '2027-01-01T00:00:00+09:00', // 投票ありがとうクーポン(100円OFF)の利用期間
    couponEnd: '2027-01-05T23:59:59+09:00',
    winners: 12
  },
  /* ほかのキャンペーン（目次とPC左メニューに使う名前）。中身は index.html の各セクションに直接書いてある
     期間は各セクションの data-start / data-end で、開催前・開催中・終了の表示が自動で切り替わる */
  others: [
    { no: 2, color: 'blue', title: 'ディズニーグッズ<br>プレゼント', menu: 'ディズニーグッズ プレゼント' },
    { no: 3, color: 'yellow', title: '新生児<br>応援', menu: '新生児 応援キャンペーン' },
    { no: 4, color: 'pink', title: '初めてのトライ<br>応援', menu: '初めてのトライ 応援キャンペーン' }
  ]
};
