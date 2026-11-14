/* Sadu site: Falcon Flight game, shared by both pages.
   The falcon has to cross GOAL dunes to reach the oasis. Each right answer
   to a sum carries it one dune further. A wrong answer, or running out of
   time before the wind changes, costs one of three feathers.
   falconFlight(page, TXT) returns the values and click handlers the
   template uses under {{ ff.… }}. TXT holds the words for one language. */
window.falconFlight = function (page, TXT) {
  'use strict';
  var GOAL = 8, LIVES = 3, WIND = 12; // dunes to cross, feathers, seconds per sum
  var TRACK = 76;                     // how far across the scene the falcon travels, in percent
  var CHOICE_BG = ['#FFC93C', '#FF6FA8', '#2ED3A6'];
  var ff = page.state.ff;

  function rand(n) { return Math.floor(Math.random() * n); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = rand(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function update(u) { page.setState({ ff: Object.assign({}, page.state.ff, u) }); }
  function posOf(step) { return (step / GOAL) * TRACK; }

  // sums get a little harder as the falcon gets further
  function newSum(step) {
    var a, b, op = '+';
    if (step < 3) { a = 1 + rand(9); b = 1 + rand(9); }
    else if (step < 6) {
      if (rand(2)) { a = 5 + rand(10); b = 2 + rand(8); } else { op = '−'; a = 8 + rand(12); b = 1 + rand(a - 1); }
    } else {
      if (rand(2)) { a = 12 + rand(28); b = 3 + rand(7); } else { op = '−'; a = 20 + rand(30); b = 3 + rand(9); }
    }
    var ans = op === '+' ? a + b : a - b;
    var choices = [ans];
    while (choices.length < 3) {
      var d = ans + [-10, -2, -1, 1, 2, 10][rand(6)];
      if (d >= 0 && choices.indexOf(d) === -1) choices.push(d);
    }
    return { text: a + ' ' + op + ' ' + b + ' = ?', ans: ans, choices: shuffle(choices) };
  }

  // slide the falcon from one dune to the next (the page redraw alone would make it jump)
  function slide(from, to) {
    var el = document.getElementById('ff-bird');
    if (!el) return;
    el.style.transition = 'none';
    el.style.left = 'calc(2% + ' + from + '%)';
    void el.offsetWidth;
    el.style.transition = 'left .7s ease-in-out';
    el.style.left = 'calc(2% + ' + to + '%)';
  }

  function tick() {
    var s = page.state.ff, left = s.end - Date.now();
    if (s.mode !== 'play') { clearInterval(page._ffTimer); return; }
    if (left <= 0) {
      if (s.lives <= 1) {
        clearInterval(page._ffTimer);
        update({ mode: 'lost', lives: 0, msg: '' });
      } else {
        update({ lives: s.lives - 1, q: newSum(s.step), wrong: [], ok: false, msg: TXT.wind, end: Date.now() + WIND * 1000 });
      }
      return;
    }
    // update the wind bar in place, so the page is not redrawn several times a second
    var b = document.getElementById('ff-wind');
    if (b) b.style.width = (left / (WIND * 10)) + '%';
  }

  var left = ff.mode === 'play' ? Math.max(0, ff.end - Date.now()) : 0;
  var q = ff.q || { text: '', ans: 0, choices: [] };
  var out = {
    idle: ff.mode === 'idle',
    playing: ff.mode === 'play',
    won: ff.mode === 'won',
    lost: ff.mode === 'lost',
    scene: ff.mode !== 'idle',
    pos: String(posOf(ff.step)),
    step: ff.step + ' / ' + GOAL,
    sum: q.text,
    barW: (left / (WIND * 10)) + '%',
    feathersLabel: TXT.feathers.replace('%N', String(ff.lives)),
    msg: ff.msg,
    msgColor: ff.ok ? '#0B6B3A' : '#B3261E',
    wonText: TXT.wonText.replace('%N', String(ff.lives)),
    lostText: TXT.lostText.replace('%S', String(ff.step)).replace('%G', String(GOAL))
  };
  out.feathers = [];
  for (var i = 0; i < LIVES; i++) out.feathers.push({ bg: i < ff.lives ? '#FF7A45' : '#EADFC8' });
  out.choices = q.choices.map(function (v, k) {
    var faded = ff.wrong.indexOf(v) !== -1;
    return { label: String(v), bg: CHOICE_BG[k], op: faded ? '.35' : '1', tap: function () {
      var s = page.state.ff;
      if (s.mode !== 'play' || s.wrong.indexOf(v) !== -1) return;
      if (v === s.q.ans) {
        var step = s.step + 1;
        if (step >= GOAL) {
          clearInterval(page._ffTimer);
          update({ mode: 'won', step: step, msg: '' });
        } else {
          update({ step: step, q: newSum(step), wrong: [], ok: true, msg: TXT.yes, end: Date.now() + WIND * 1000 });
        }
        slide(posOf(s.step), posOf(step));
      } else if (s.lives <= 1) {
        clearInterval(page._ffTimer);
        update({ mode: 'lost', lives: 0, msg: '' });
      } else {
        update({ lives: s.lives - 1, wrong: s.wrong.concat(v), ok: false, msg: TXT.no });
      }
    } };
  });
  out.start = function () {
    clearInterval(page._ffTimer);
    update({ mode: 'play', step: 0, lives: LIVES, q: newSum(0), wrong: [], msg: '', ok: false, end: Date.now() + WIND * 1000 });
    page._ffTimer = setInterval(tick, 200);
  };
  return out;
};
