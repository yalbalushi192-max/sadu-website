/* Sadu site: Souq Dash game, shared by both pages.
   A customer buys one or two things and pays with a note. The player taps
   notes and coins to give the right change, for as many customers as
   possible before the time runs out.
   souqDash(page, TXT) returns the values and click handlers the template
   uses under {{ g.… }}. TXT holds the words for one language. */
window.souqDash = function (page, TXT) {
  'use strict';
  var SECONDS = 90;
  var COINS = [{ v: 1, bg: '#FFC93C' }, { v: 5, bg: '#B9A8FF' }, { v: 10, bg: '#FFD3C0' }, { v: 50, bg: '#B9F3E2' }];
  var sd = page.state.sd;

  function rand(n) { return Math.floor(Math.random() * n); }
  function set(update) { page.setState({ sd: Object.assign({}, page.state.sd, update) }); }

  function newOrder() {
    var pool = TXT.items.slice(), lines = [], total = 0, want = 1 + rand(2);
    while (lines.length < want && pool.length) {
      var item = pool.splice(rand(pool.length), 1)[0];
      var qty = 1 + rand(3);
      while (qty > 0 && total + item[1] * qty > 95) qty -= 1;
      if (qty === 0) continue;
      lines.push({ qty: qty, name: item[0], price: item[1] });
      total += item[1] * qty;
    }
    var notes = [10, 50, 100].filter(function (n) { return n > total; });
    var paid = notes[notes.length > 1 && rand(3) === 0 ? 1 : 0];
    return { lines: lines, total: total, paid: paid };
  }

  function tick() {
    var s = page.state.sd, left = s.end - Date.now();
    if (s.mode !== 'play') { clearInterval(page._sdTimer); return; }
    if (left <= 0) {
      clearInterval(page._sdTimer);
      set({ mode: 'over', best: Math.max(s.best, s.served) });
      return;
    }
    // update the clock in place, so the page is not redrawn four times a second
    var t = document.getElementById('sd-time'), b = document.getElementById('sd-bar');
    if (t) t.textContent = String(Math.ceil(left / 1000));
    if (b) b.style.width = (left / (SECONDS * 10)) + '%';
  }

  var left = sd.mode === 'play' ? Math.max(0, sd.end - Date.now()) : 0;
  var order = sd.order || { lines: [], total: 0, paid: 0 };
  var g = {
    idle: sd.mode === 'idle',
    playing: sd.mode === 'play',
    over: sd.mode === 'over',
    served: String(sd.served),
    time: String(Math.ceil(left / 1000)),
    barW: (left / (SECONDS * 10)) + '%',
    paid: TXT.sar.replace('%N', String(order.paid)),
    give: TXT.sar.replace('%N', String(sd.give)),
    msg: sd.msg,
    msgColor: sd.ok ? '#0B6B3A' : '#B3261E',
    result: (sd.served === 1 ? TXT.result1 : TXT.result).replace('%N', String(sd.served)),
    best: TXT.best.replace('%N', String(sd.best))
  };
  g.lines = order.lines.map(function (l) {
    return { text: TXT.line.replace('%Q', String(l.qty)).replace('%N', l.name).replace('%P', String(l.price)) };
  });
  g.coins = COINS.map(function (c) {
    return { label: String(c.v), aria: TXT.add.replace('%N', String(c.v)), bg: c.bg, tap: function () {
      set({ give: page.state.sd.give + c.v, msg: '' });
    } };
  });
  g.clear = function () { set({ give: 0, msg: '' }); };
  g.start = function () {
    clearInterval(page._sdTimer);
    set({ mode: 'play', served: 0, order: newOrder(), give: 0, msg: '', ok: false, end: Date.now() + SECONDS * 1000 });
    page._sdTimer = setInterval(tick, 250);
  };
  g.submit = function () {
    var s = page.state.sd, change = s.order.paid - s.order.total;
    if (s.mode !== 'play') return;
    if (s.give === change) {
      set({ served: s.served + 1, order: newOrder(), give: 0, ok: true, msg: TXT.yes.replace('%C', String(change)) });
    } else {
      set({ ok: false, msg: s.give < change ? TXT.low : TXT.high });
    }
  };
  return g;
};
