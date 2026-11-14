/* Sadu site: Letter Catch game, shared by both pages.
   A word is spoken and shown. Three letter tiles float down slowly and the
   child taps the letter the word starts with. There is no timer and nothing
   to lose: tiles that reach the bottom come round again.
   letterCatch(page, TXT, PH) returns the values and click handlers the
   template uses under {{ lc.… }}. TXT holds the words for one language and
   PH is the phonics list ({ en: [...], ar: [...] }) from the page script. */
window.letterCatch = function (page, TXT, PH) {
  'use strict';
  var H = 340, SIZE = 84, SPEED = 38; // field height, tile size, pixels per second
  var LEFT = [16.67, 50, 83.33];
  var TILE_BG = ['#FFC93C', '#FF6FA8', '#2ED3A6'];
  var lc = page.state.lc;
  // tile positions live outside the page state, so moving them does not redraw the page
  var anim = page._lc || (page._lc = { y: [0, 0, 0], raf: 0, last: 0, timer: 0 });
  var still = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function rand(n) { return Math.floor(Math.random() * n); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = rand(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function update(u) { page.setState({ lc: Object.assign({}, page.state.lc, u) }); }

  function speak(word, lang) {
    try {
      var u = new SpeechSynthesisUtterance(word);
      var want = lang === 'ar' ? ['ar-sa', 'ar'] : ['en-gb', 'en'];
      var voices = window.speechSynthesis.getVoices() || [];
      var norm = function (v) { return String(v.lang || '').toLowerCase().replace('_', '-'); };
      var best = voices.filter(function (v) { return norm(v) === want[0]; })[0] || voices.filter(function (v) { return norm(v).indexOf(want[1]) === 0; })[0];
      if (best) { u.voice = best; }
      u.lang = lang === 'ar' ? 'ar-SA' : 'en-GB'; u.rate = 0.8;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function newRound(lang, avoid) {
    var n = PH[lang].length, target;
    do { target = rand(n); } while (target === avoid);
    var picks = [target];
    while (picks.length < 3) { var d = rand(n); if (picks.indexOf(d) === -1) picks.push(d); }
    shuffle(picks);
    var starts = shuffle([0, 50, 100]); // all three are on screen from the start
    for (var k = 0; k < 3; k++) anim.y[k] = still ? (H - SIZE) / 2 - 20 : starts[k];
    speak(PH[lang][target].word, lang);
    return { target: target, tiles: picks, hit: false, hint: false, wrong: [], msg: '', ok: false };
  }

  function frame(ts) {
    if (page.state.lc.mode !== 'play') { anim.raf = 0; return; }
    var dt = Math.min(0.1, Math.max(0, (ts - anim.last) / 1000));
    anim.last = ts;
    var nodes = document.querySelectorAll('[data-lc]');
    for (var k = 0; k < 3; k++) {
      if (!still) { anim.y[k] += SPEED * dt; if (anim.y[k] > H) anim.y[k] = -SIZE; }
      if (nodes[k]) nodes[k].style.transform = 'translateY(' + anim.y[k].toFixed(1) + 'px)';
    }
    anim.raf = requestAnimationFrame(frame);
  }

  var set = PH[lc.lang], cur = set[lc.target], on = lc.lang;
  var out = {
    idle: lc.mode === 'idle',
    playing: lc.mode === 'play',
    dir: on === 'ar' ? 'rtl' : 'ltr',
    word: cur.word,
    gloss: cur.gloss,
    stars: String(lc.stars),
    showHint: lc.hint && !lc.hit,
    hintCh: cur.ch,
    msg: lc.msg,
    msgColor: lc.ok ? '#0B6B3A' : '#B3261E',
    enOn: on === 'en' ? 'true' : 'false', arOn: on === 'ar' ? 'true' : 'false',
    enBg: on === 'en' ? '#23204A' : '#FFFFFF', enFg: on === 'en' ? '#FFFFFF' : '#23204A',
    arBg: on === 'ar' ? '#23204A' : '#FFFFFF', arFg: on === 'ar' ? '#FFFFFF' : '#23204A'
  };
  var setLang = function (l) {
    return function () {
      clearTimeout(anim.timer);
      if (page.state.lc.mode === 'play') { update(Object.assign({ lang: l }, newRound(l, -1))); } else { update({ lang: l, target: 0, tiles: [0, 1, 2], wrong: [] }); }
    };
  };
  out.setEn = setLang('en');
  out.setAr = setLang('ar');
  out.tiles = lc.tiles.map(function (idx, k) {
    var right = idx === lc.target, solved = lc.hit && right;
    var faded = (lc.hit && !right) || lc.wrong.indexOf(idx) !== -1;
    return {
      ch: set[idx].ch,
      left: LEFT[k],
      y: anim.y[k].toFixed(1),
      bg: solved ? '#0B6B3A' : TILE_BG[k],
      fg: solved ? '#FFFFFF' : '#23204A',
      op: faded ? '.35' : '1',
      tap: function () {
        var s = page.state.lc;
        if (s.mode !== 'play' || s.hit) return;
        if (idx === s.target) {
          update({ hit: true, ok: true, stars: s.stars + 1, msg: TXT.yes.replace('%W', cur.word).replace('%L', cur.ch) });
          clearTimeout(anim.timer);
          anim.timer = setTimeout(function () {
            var c = page.state.lc;
            if (c.mode === 'play') update(newRound(c.lang, c.target));
          }, 1800);
        } else {
          update({ ok: false, hint: true, msg: TXT.no, wrong: s.wrong.concat(idx) });
        }
      }
    };
  });
  out.hear = function () { speak(cur.word, on); };
  out.start = function () {
    clearTimeout(anim.timer);
    anim.last = performance.now();
    update(Object.assign({ mode: 'play', stars: 0 }, newRound(page.state.lc.lang, -1)));
    if (!anim.raf) anim.raf = requestAnimationFrame(frame);
  };
  out.stop = function () {
    clearTimeout(anim.timer);
    try { window.speechSynthesis.cancel(); } catch (e) {}
    update({ mode: 'idle', msg: '', hint: false, hit: false, wrong: [] });
  };
  return out;
};
