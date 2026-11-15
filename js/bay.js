// Sadu Bay: a cozy fishing game where every catch is a tiny lesson (plan: unity/COZY-FISHING-PLAN.md).
// Row → find a spot → cast → reel (tension bar + a question) → catch card. 8-slot basket, a day clock,
// sell at the dock by counting coins. Plain canvas, no libraries; English and Arabic (?lang=ar).
(function () {
  'use strict';
  var AR = /[?&]lang=ar\b/.test(location.search);
  var L = AR ? 'ar' : 'en';
  document.documentElement.lang = L; document.documentElement.dir = AR ? 'rtl' : 'ltr';

  var T = {
    en: { title: 'Sadu Bay', back: '‹ Sadu', morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening',
      row: 'Tap the water to row. Find the bubbles!', spot: 'A fishing spot! Hold Cast, then let go.', aim: 'Let go to cast!',
      wait: 'Wait for a bite…', reel: 'Hold Reel to keep the marker in the green!', full: 'Your basket is full! Row back to the dock.',
      eveningHint: 'Evening! Row back to the dock to sell your fish.', dock: 'You are at the dock.',
      cast: 'Hold to cast', reelBtn: 'Hold to reel', sell: 'Sell my fish 🪙', newSpot: 'New fishing spot!',
      spots: { shore: 'Sandy shallows', open: 'Open water', rocks: 'The rocks', reef: 'Coral reef', deep: 'Deep water' },
      spotText: 'Different fish live here. Hold Cast to try!', ok: 'OK', caught: 'You caught a fish!', keep: 'Put it in the basket',
      gone: 'The fish swam away!', goneText: 'No problem. Try another cast!', tryAgain: 'Try again',
      turtle: 'A sea turtle!', turtleText: 'We watch turtles, we never catch them. It swims away happily.', lovely: 'Lovely!',
      howMany: 'How many bubbles?', plus: '%A + %B = ?', startsWith: '%F starts with which letter?', tapColour: 'Which colour is %C?',
      coinsQ: 'How many coins for your fish?', sold: 'Well done! +%A coins', newDay: 'Start a new day', dayOver: 'The day is over!',
      dayOverText: 'Saqr rows home with the catch.', book: 'My fish', bookText: 'Fish you have found:', close: 'Close',
      colours: { red: 'red', blue: 'blue', yellow: 'yellow', green: 'green' } },
    ar: { title: 'خليج سدو', back: '› سدو', morning: 'الصباح', afternoon: 'العصر', evening: 'المساء',
      row: 'اضغط على الماء لتجدّف. ابحث عن الفقاعات!', spot: 'مكان صيد! اضغط مطولًا على «ارمِ» ثم اترك.', aim: 'اترك لترمي الصنارة!',
      wait: 'انتظر حتى تعضّ السمكة…', reel: 'اضغط مطولًا على «اسحب» ليبقى المؤشر في الأخضر!', full: 'امتلأت السلة! جدّف عائدًا إلى الرصيف.',
      eveningHint: 'جاء المساء! جدّف إلى الرصيف لتبيع السمك.', dock: 'أنت عند الرصيف.',
      cast: 'اضغط لترمي', reelBtn: 'اضغط لتسحب', sell: 'بِع السمك 🪙', newSpot: 'مكان صيد جديد!',
      spots: { shore: 'المياه الرملية الضحلة', open: 'المياه المفتوحة', rocks: 'الصخور', reef: 'الشعاب المرجانية', deep: 'المياه العميقة' },
      spotText: 'تعيش هنا أسماك مختلفة. اضغط على «ارمِ» لتجرّب!', ok: 'حسنًا', caught: 'اصطدت سمكة!', keep: 'ضعها في السلة',
      gone: 'هربت السمكة!', goneText: 'لا بأس. جرّب رمية أخرى!', tryAgain: 'حاول مرة أخرى',
      turtle: 'سلحفاة بحرية!', turtleText: 'نحن نشاهد السلاحف ولا نصطادها أبدًا. تسبح مبتعدة سعيدة.', lovely: 'جميل!',
      howMany: 'كم فقاعة؟', plus: '%A + %B = ؟', startsWith: 'بأي حرف تبدأ كلمة %F؟', tapColour: 'أي لون هو %C؟',
      coinsQ: 'كم قطعة نقود ثمن سمكك؟', sold: 'أحسنت! +%A قطع نقود', newDay: 'ابدأ يومًا جديدًا', dayOver: 'انتهى اليوم!',
      dayOverText: 'يجدّف صقر إلى البيت مع صيده.', book: 'أسماكي', bookText: 'الأسماك التي وجدتها:', close: 'إغلاق',
      colours: { red: 'الأحمر', blue: 'الأزرق', yellow: 'الأصفر', green: 'الأخضر' } }
  }[L];
  function fill(s, o) { return s.replace(/%([A-Z])/g, function (m, k) { return o[k] != null ? o[k] : m; }); }

  // ---- fish (Gulf and Omani sea life) ----
  var FISH = {
    sardine: { en: 'Sardine', ar: 'عومة', color: '#9FB7C9', value: 1, q: 'count', fact: { en: 'Sardines swim together in big groups called schools.', ar: 'تسبح أسماك العومة معًا في مجموعات كبيرة.' } },
    pomfret: { en: 'Silver pomfret', ar: 'زبيدي', color: '#D7DDE3', value: 2, q: 'sum10', fact: { en: 'Pomfret are flat and shiny, like a silver plate.', ar: 'سمك الزبيدي مسطّح ولامع مثل صحن من الفضة.' } },
    kingfish: { en: 'Kingfish', ar: 'كنعد', color: '#6E8FB0', value: 3, q: 'sum20', fact: { en: 'Kingfish are long and very fast swimmers.', ar: 'الكنعد سمك طويل يسبح بسرعة كبيرة.' } },
    grouper: { en: 'Grouper', ar: 'هامور', color: '#B9774A', value: 3, q: 'letter', letter: { en: 'G', ar: 'هـ' }, fact: { en: 'Groupers like to hide between the rocks.', ar: 'يحب الهامور الاختباء بين الصخور.' } },
    parrot: { en: 'Parrotfish', ar: 'سمكة الببغاء', color: '#3CC3B0', value: 2, q: 'colour', fact: { en: 'Parrotfish have a beak like a parrot and help keep the reef clean.', ar: 'لسمكة الببغاء منقار مثل الببغاء، وهي تساعد في تنظيف الشعاب.' } },
    crab: { en: 'Crab', ar: 'سلطعون', color: '#E8734A', value: 1, q: 'count', crab: true, fact: { en: 'Crabs walk sideways on the sand.', ar: 'يمشي السلطعون جانبيًا على الرمل.' } },
    turtle: { en: 'Sea turtle', ar: 'سلحفاة بحرية', color: '#5E9E5A', turtle: true, fact: { en: 'Sea turtles have lived in our seas for millions of years.', ar: 'تعيش السلاحف البحرية في بحارنا منذ ملايين السنين.' } }
  };
  var SPOTS = [
    { id: 'shore', x: 215, y: 525, fish: ['crab', 'crab', 'sardine'] },
    { id: 'open', x: 440, y: 230, fish: ['sardine', 'pomfret', 'pomfret'] },
    { id: 'rocks', x: 760, y: 150, fish: ['grouper', 'grouper', 'sardine'] },
    { id: 'reef', x: 575, y: 470, fish: ['parrot', 'parrot', 'turtle'] },
    { id: 'deep', x: 885, y: 430, fish: ['kingfish', 'kingfish', 'pomfret'] }
  ];
  var DOCK = { x: 170, y: 300 };
  var W = 1000, H = 620, DAY = 240;

  // ---- saved progress and the child's age (from Sadu) ----
  var SAVE_KEY = 'sadu-bay-v1', save = { coins: 0, spots: {}, seen: {} };
  try { save = Object.assign(save, JSON.parse(localStorage.getItem(SAVE_KEY)) || {}); } catch (e) {}
  function store() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }
  var age = 7;
  try { var pr = JSON.parse(localStorage.getItem('sadu-progress-v1')); if (pr && pr.age) age = pr.age; } catch (e) {}
  var young = age <= 5;

  // ---- elements ----
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('sea'), g = null, stage = $('stage'), hint = $('hint'), action = $('action');
  var meter = $('meter'), mark = meter.querySelector('.mark'), zoneEl = meter.querySelector('.zone'), fillbar = meter.querySelector('.fillbar');
  var progressEl = $('progress'), layer = $('layer'), card = $('card');
  document.title = T.title; $('title').textContent = '🚣 ' + T.title; $('back').textContent = T.back;
  $('back').href = 'learn.html' + (AR ? '?lang=ar' : '');
  $('coins').textContent = '🪙 ' + save.coins;

  function speak(text) {
    try { if (!window.speechSynthesis) return; speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text); u.lang = AR ? 'ar-SA' : 'en-GB'; u.rate = 0.9; speechSynthesis.speak(u); } catch (e) {}
  }
  var ac = null;
  function tone(f, d, type) {
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); var o = ac.createOscillator(), v = ac.createGain();
      o.type = type || 'sine'; o.frequency.value = f; v.gain.setValueAtTime(0.08, ac.currentTime); v.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d);
      o.connect(v); v.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {}
  }
  function happy() { tone(660, 0.12); setTimeout(function () { tone(880, 0.18); }, 110); }
  var rand = function (n) { return Math.floor(Math.random() * n); };
  var shuffle = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = rand(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  // ---- game state ----
  var S = {
    boat: { x: 260, y: 330, a: 0 }, target: null, keys: {},
    mode: 'row',            // row, aim, wait, reel, card
    basket: [], t: 0, dayOver: false,
    power: 0, powerDir: 1, cast: null, waitLeft: 0,
    reel: null, spot: null
  };
  var schools = SPOTS.map(function (sp, i) { return { sp: sp, a: i, fish: [0, 1, 2, 3, 4].map(function (k) { return { o: k * 1.25, r: 26 + k * 6 }; }) }; });

  // ---- questions ----
  function nearOpts(n, lo) { var set = [n]; [n + 1, n - 1, n + 2, n - 2].forEach(function (x) { if (set.length < 3 && x >= (lo || 0) && set.indexOf(x) === -1) set.push(x); }); return shuffle(set.map(String)); }
  function question(fishId) {
    var f = FISH[fishId], q;
    if (f.q === 'count') {
      var n = 2 + rand(young ? 4 : 8);
      q = { text: T.howMany, show: new Array(n + 1).join('🫧'), opts: nearOpts(n, 1), right: String(n) };
    } else if (f.q === 'sum10' || f.q === 'sum20') {
      var top = f.q === 'sum10' ? (young ? 5 : 10) : (young ? 8 : 20), a = 1 + rand(top - 1), b = 1 + rand(Math.max(1, top - a));
      q = { text: fill(T.plus, { A: a, B: b }), opts: nearOpts(a + b, 0), right: String(a + b) };
    } else if (f.q === 'letter') {
      var pool = AR ? ['هـ', 'ب', 'ت', 'س', 'م', 'ك'] : ['G', 'B', 'T', 'S', 'M', 'K'], right = f.letter[L];
      q = { text: fill(T.startsWith, { F: f[L] }), opts: shuffle([right].concat(shuffle(pool.filter(function (x) { return x !== right; })).slice(0, 2))), right: right };
    } else {
      var cols = shuffle(['red', 'blue', 'yellow', 'green']).slice(0, 3), want = cols[rand(3)];
      q = { text: fill(T.tapColour, { C: T.colours[want] }), colours: cols, opts: cols, right: want };
    }
    return q;
  }

  // ---- cards (popups) ----
  function fishSVG(f, size) {
    if (f.crab) return '<span class="big" aria-hidden="true">🦀</span>';
    if (f.turtle) return '<span class="big" aria-hidden="true">🐢</span>';
    return '<svg width="' + size + '" height="' + size * 0.6 + '" viewBox="0 0 100 60" aria-hidden="true"><path d="M78 30 L98 12 L98 48 Z" fill="' + f.color + '" stroke="#23204A" stroke-width="3" stroke-linejoin="round"/>' +
      '<ellipse cx="45" cy="30" rx="38" ry="22" fill="' + f.color + '" stroke="#23204A" stroke-width="3"/><circle cx="24" cy="25" r="5" fill="#23204A"/><circle cx="22.5" cy="23.5" r="1.6" fill="#fff"/>' +
      '<path d="M48 12 Q56 30 48 48" fill="none" stroke="#23204A" stroke-width="2.5" opacity=".35"/></svg>';
  }
  function show(html, onReady) {
    card.innerHTML = html; layer.hidden = false; S.mode = 'card'; action.hidden = true; meter.hidden = true; progressEl.hidden = true; hint.hidden = true;
    if (onReady) onReady();
    var first = card.querySelector('button'); if (first) first.focus({ preventScroll: true });
  }
  function hide() { layer.hidden = true; hint.hidden = false; S.mode = 'row'; }
  function btn(label, cls) { return '<button type="button" class="btn ' + (cls || 'go') + '">' + label + '</button>'; }
  function ask(q, onRight, onWrong) {
    var opts = q.opts.map(function (o) {
      var face = q.colours ? '<span style="display:inline-block;width:38px;height:38px;border-radius:50%;background:' + { red: '#E5534B', blue: '#3F8EF5', yellow: '#FFD23F', green: '#2E9E6B' }[o] + '"></span>' : o;
      return '<button type="button" class="btn" data-o="' + o + '" aria-label="' + (q.colours ? T.colours[o] : o) + '">' + face + '</button>';
    }).join('');
    show('<p class="q"' + (/\d\s*\+/.test(q.text) ? ' dir="ltr"' : '') + '>' + q.text + '</p>' + (q.show ? '<p class="big" style="font-size:36px;word-break:break-all">' + q.show + '</p>' : '') + '<div class="opts">' + opts + '</div>');
    speak(q.text.replace('= ?', '').replace('= ؟', ''));
    var tries = 0;
    card.querySelectorAll('[data-o]').forEach(function (b) {
      b.onclick = function () {
        if (b.getAttribute('data-o') === q.right) { b.classList.add('ok'); happy(); setTimeout(onRight, 450); }
        else { b.classList.add('no'); b.disabled = true; tone(220, 0.25, 'triangle'); tries++; if (tries >= 2 && onWrong) setTimeout(onWrong, 450); }
      };
    });
  }

  // ---- HUD ----
  function phase() { return S.t < DAY / 3 ? 'morning' : S.t < DAY * 2 / 3 ? 'afternoon' : 'evening'; }
  function hud() {
    var ph = phase();
    $('clock').textContent = (ph === 'morning' ? '🌅 ' : ph === 'afternoon' ? '☀️ ' : '🌇 ') + T[ph];
    $('creel').textContent = '🧺 ' + S.basket.length + '/8';
    $('coins').textContent = '🪙 ' + save.coins;
  }
  function nearSpot() {
    var b = S.boat, best = null;
    SPOTS.forEach(function (sp) { var d = Math.hypot(sp.x - b.x, sp.y - b.y); if (d < 80 && (!best || d < best.d)) best = { sp: sp, d: d }; });
    return best && best.sp;
  }
  function atDock() { return Math.hypot(DOCK.x + 30 - S.boat.x, DOCK.y - S.boat.y) < 90; }
  function setAction(label, cls) { action.hidden = !label; if (label) { action.textContent = label; action.className = 'btn ' + (cls || 'go'); } }
  function controls() {
    if (S.mode === 'card') return;
    if (S.mode === 'row') {
      var sp = nearSpot();
      if (atDock() && S.basket.length) { hint.textContent = T.dock; setAction(T.sell, 'warm'); return; }
      if (S.basket.length >= 8) { hint.textContent = T.full; setAction(''); return; }
      if (sp) { hint.textContent = T.spot; setAction('🎣 ' + T.cast); return; }
      hint.textContent = phase() === 'evening' && S.basket.length ? T.eveningHint : T.row; setAction('');
    }
  }

  // ---- actions ----
  function onActionDown(e) {
    e.preventDefault();
    if (S.mode === 'row') {
      if (atDock() && S.basket.length) return sell(false);
      var sp = nearSpot(); if (!sp || S.basket.length >= 8) return;
      if (!save.spots[sp.id]) {
        save.spots[sp.id] = 1; store(); tone(520, 0.2);
        return show('<span class="big" aria-hidden="true">📍</span><h2>' + T.newSpot + '</h2><p><b>' + T.spots[sp.id] + '</b></p><p>' + T.spotText + '</p>' + btn(T.ok), function () { card.querySelector('button').onclick = hide; });
      }
      S.spot = sp; S.mode = 'aim'; S.power = 0; S.powerDir = 1; hint.textContent = T.aim; setAction('🎣 ' + T.cast, 'warm');
    } else if (S.mode === 'reel') { S.reel.holding = true; }
  }
  function onActionUp() {
    if (S.mode === 'aim') {
      var sp = S.spot, p = S.power, ang = Math.atan2(sp.y - S.boat.y, sp.x - S.boat.x), dist = 40 + p * 110;
      S.cast = { x: S.boat.x + Math.cos(ang) * dist, y: S.boat.y + Math.sin(ang) * dist, t: 0 };
      // a cast that lands near the bubbles gets a bite sooner
      var miss = Math.hypot(S.cast.x - sp.x, S.cast.y - sp.y);
      S.waitLeft = 0.8 + Math.min(2.4, miss / 60) + Math.random();
      S.mode = 'wait'; hint.textContent = T.wait; setAction(''); tone(400, 0.1);
    } else if (S.mode === 'reel') { S.reel.holding = false; }
  }
  action.addEventListener('pointerdown', onActionDown);
  action.addEventListener('pointerup', onActionUp);
  action.addEventListener('pointercancel', onActionUp);
  action.addEventListener('pointerleave', function () { if (S.mode === 'reel') S.reel.holding = false; });
  window.addEventListener('keydown', function (e) {
    if (/Arrow/.test(e.key)) { S.keys[e.key] = true; S.target = null; e.preventDefault(); }
    if ((e.key === ' ' || e.key === 'Enter') && layer.hidden && !action.hidden && !e.repeat) { onActionDown(e); }
  });
  window.addEventListener('keyup', function (e) { S.keys[e.key] = false; if (e.key === ' ' || e.key === 'Enter') onActionUp(); });

  function bite() {
    var sp = S.spot, id = sp.fish[rand(sp.fish.length)];
    if (id === 'turtle') {
      S.cast = null; save.seen.turtle = 1; store(); happy();
      return show(fishSVG(FISH.turtle) + '<h2>' + T.turtle + '</h2><p>' + T.turtleText + '</p>' + btn(T.lovely), function () { card.querySelector('button').onclick = hide; speak(T.turtle); });
    }
    var zw = young ? 0.42 : 0.3;
    S.reel = { fish: id, m: 0.5, v: 0, prog: 0.15, asked: false, holding: false, zone: [0.5 - zw / 2, 0.5 + zw / 2], t: 0, out: 0 };
    S.mode = 'reel'; tone(700, 0.08); tone(900, 0.08);
    hint.textContent = T.reel; setAction('🌀 ' + T.reelBtn, 'warm');
    meter.hidden = false; progressEl.hidden = false;
    zoneEl.style.left = (S.reel.zone[0] * 100) + '%'; zoneEl.style.width = ((S.reel.zone[1] - S.reel.zone[0]) * 100) + '%';
  }
  function escape() {
    S.cast = null; S.reel = null; tone(260, 0.3, 'triangle');
    show('<span class="big" aria-hidden="true">💨</span><h2>' + T.gone + '</h2><p>' + T.goneText + '</p>' + btn(T.tryAgain), function () { card.querySelector('button').onclick = hide; });
  }
  function landed() {
    var id = S.reel.fish, f = FISH[id];
    S.cast = null; S.reel = null; S.basket.push(id); save.seen[id] = 1; store(); happy(); hud();
    show(fishSVG(f, 150) + '<h2>' + T.caught + '</h2><div class="names"><span lang="en" dir="ltr">' + f.en + '</span><span lang="ar" dir="rtl">' + f.ar + '</span></div><p>' + f.fact[L] + '</p>' +
      basketHTML() + btn(T.keep), function () { card.querySelector('.btn.go').onclick = hide; speak(f[L]); });
  }
  function basketHTML() {
    var cells = ''; for (var i = 0; i < 8; i++) { var id = S.basket[i]; cells += '<span>' + (id ? (FISH[id].crab ? '🦀' : '🐟') : '') + '</span>'; }
    return '<div class="basket" aria-label="' + S.basket.length + '/8">' + cells + '</div>';
  }
  function sell(endOfDay) {
    if (!S.basket.length) return endOfDay ? newDayCard() : null;
    var total = S.basket.reduce(function (a, id) { return a + FISH[id].value; }, 0);
    var rows = S.basket.map(function (id) { return '<div style="display:flex;gap:6px;align-items:center;justify-content:center"><span>' + (FISH[id].crab ? '🦀' : '🐟') + '</span><span>' + new Array(FISH[id].value + 1).join('🪙') + '</span></div>'; }).join('');
    var q = { text: T.coinsQ, opts: nearOpts(total, 1), right: String(total) };
    var go = function () {
      ask(q, function () {
        save.coins += total; S.basket = []; store(); hud();
        show('<span class="big" aria-hidden="true">🪙</span><h2>' + fill(T.sold, { A: total }) + '</h2>' + btn(endOfDay ? T.newDay : T.ok), function () { card.querySelector('button').onclick = function () { if (endOfDay) newDay(); hide(); }; });
      }, null);
      var p = card.querySelector('.q'); if (p) p.insertAdjacentHTML('afterend', '<div style="display:flex;flex-direction:column;gap:4px;font-size:22px">' + rows + '</div>');
    };
    if (endOfDay) show('<span class="big" aria-hidden="true">🌙</span><h2>' + T.dayOver + '</h2><p>' + T.dayOverText + '</p>' + btn(T.ok), function () { card.querySelector('button').onclick = go; });
    else go();
  }
  function newDay() { S.t = 0; S.dayOver = false; S.boat.x = 260; S.boat.y = 330; S.target = null; hud(); }
  function newDayCard() { show('<span class="big" aria-hidden="true">🌙</span><h2>' + T.dayOver + '</h2><p>' + T.dayOverText + '</p>' + btn(T.newDay), function () { card.querySelector('button').onclick = function () { newDay(); hide(); }; }); }

  // ---- "my fish" book ----
  var bookBtn = document.createElement('button');
  bookBtn.type = 'button'; bookBtn.className = 'pill'; bookBtn.style.border = '0'; bookBtn.style.cursor = 'pointer'; bookBtn.textContent = '📖 ' + T.book;
  $('coins').after(bookBtn);
  bookBtn.onclick = function () {
    if (S.mode !== 'row') return;
    var items = Object.keys(FISH).map(function (id) { var f = FISH[id], seen = !!save.seen[id];
      return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;opacity:' + (seen ? 1 : 0.3) + '">' + (seen ? fishSVG(f, 70) : '<span style="font-size:36px">❔</span>') + '<b style="font-size:14px">' + (seen ? f[L] : '?') + '</b></div>'; }).join('');
    show('<h2>📖 ' + T.book + '</h2><p>' + T.bookText + '</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:10px;width:100%">' + items + '</div>' + btn(T.close, 'light'),
      function () { card.querySelector('.btn.light').onclick = hide; });
  };

  // ---- rowing: tap the water (3D: find the point on the sea under the finger) ----
  var view = { k: 1, ox: 0, oy: 0 };
  cv.addEventListener('pointerdown', function (e) {
    if (S.mode !== 'row') return;
    var r = cv.getBoundingClientRect();
    if (three) { var w = three.pick(e.clientX, e.clientY, r); if (w) S.target = w; return; }
    S.target = { x: ((e.clientX - r.left) * (cv.width / r.width) - view.ox) / view.k, y: ((e.clientY - r.top) * (cv.height / r.height) - view.oy) / view.k };
  });

  // ---- update ----
  function inWater(x, y) {
    if (x < 115) return false;                                   // the beach
    if (x < 230 && Math.abs(y - DOCK.y) < 22) return false;      // the dock itself
    return x < W - 20 && y > 20 && y < H - 20;
  }
  function update(dt) {
    if (S.mode !== 'card' && !S.dayOver) {
      S.t += dt;
      if (S.t >= DAY && S.mode === 'row') { S.dayOver = true; return sell(true); }
    }
    var b = S.boat;
    if (S.mode === 'row') {
      var dx = 0, dy = 0;
      if (S.keys.ArrowLeft) dx -= 1; if (S.keys.ArrowRight) dx += 1; if (S.keys.ArrowUp) dy -= 1; if (S.keys.ArrowDown) dy += 1;
      if (S.target) { dx = S.target.x - b.x; dy = S.target.y - b.y; if (Math.hypot(dx, dy) < 6) { S.target = null; dx = dy = 0; } }
      var len = Math.hypot(dx, dy);
      if (len > 0) {
        var sp = 170 * dt, nx = b.x + dx / len * sp, ny = b.y + dy / len * sp;
        if (inWater(nx, ny)) { b.x = nx; b.y = ny; } else if (inWater(nx, b.y)) b.x = nx; else if (inWater(b.x, ny)) b.y = ny; else S.target = null;
        var want = Math.atan2(dy, dx), da = Math.atan2(Math.sin(want - b.a), Math.cos(want - b.a)); b.a += da * Math.min(1, dt * 8);
      }
    } else if (S.mode === 'aim') {
      S.power += S.powerDir * dt * 1.1; if (S.power > 1) { S.power = 1; S.powerDir = -1; } if (S.power < 0) { S.power = 0; S.powerDir = 1; }
      meter.hidden = false; zoneEl.style.width = '0'; fillbar.style.width = (S.power * 100) + '%'; mark.style.left = '-20px';
    } else if (S.mode === 'wait') {
      meter.hidden = true; fillbar.style.width = '0';
      S.cast.t += dt; S.waitLeft -= dt; if (S.waitLeft <= 0) bite();
    } else if (S.mode === 'reel') {
      var R = S.reel; R.t += dt;
      // the fish pulls left in waves; holding Reel pushes right
      var pull = 0.55 + 0.35 * Math.sin(R.t * 1.7) + 0.25 * Math.sin(R.t * 4.3);
      R.v += ((R.holding ? 1.25 : 0) - pull) * dt * 2.2; R.v *= 0.9;
      R.m = Math.max(0, Math.min(1, R.m + R.v * dt * 2));
      var inZone = R.m >= R.zone[0] && R.m <= R.zone[1];
      R.prog += (inZone ? 0.16 : -0.06) * dt; R.out = inZone ? 0 : R.out + dt;
      mark.style.left = (R.m * 100) + '%';
      progressEl.firstElementChild.style.width = (Math.max(0, Math.min(1, R.prog)) * 100) + '%';
      if (R.prog >= 0.5 && !R.asked) {
        R.asked = true; R.holding = false;
        var keep = R;
        ask(question(R.fish), function () { hide(); S.reel = keep; S.mode = 'reel'; keep.prog = Math.max(keep.prog, 0.55); keep.v = 0; meter.hidden = false; progressEl.hidden = false; hint.textContent = T.reel; setAction('🌀 ' + T.reelBtn, 'warm'); }, escape);
        return;
      }
      if (R.prog >= 1) { meter.hidden = true; progressEl.hidden = true; return landed(); }
      if (R.prog <= 0 || R.out > 6) { meter.hidden = true; progressEl.hidden = true; return escape(); }
    }
    controls();
  }

  // ---- drawing ----
  function blob(x, y, r, n, seed) {
    g.beginPath();
    for (var i = 0; i <= n; i++) { var a = i / n * Math.PI * 2, rr = r * (0.8 + 0.25 * Math.sin(a * 3 + seed)); g[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.8); }
    g.closePath();
  }
  function palm(x, y) {
    g.fillStyle = '#A67C52'; g.fillRect(x - 3, y - 4, 6, 16);
    g.fillStyle = '#3E9B57'; for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2; g.beginPath(); g.ellipse(x + Math.cos(a) * 12, y - 6 + Math.sin(a) * 9, 13, 5, a, 0, Math.PI * 2); g.fill(); }
  }
  function draw2D(time) {
    var cw = cv.width, ch = cv.height;
    // fit the whole bay on wide screens; on narrow (phone) screens zoom in so at least 440 units show, and follow the boat
    view.k = Math.max(Math.min(cw / W, ch / H), Math.min(ch / H, cw / 440));
    var vw = W * view.k, vh = H * view.k;
    view.ox = vw <= cw ? (cw - vw) / 2 : Math.max(cw - vw, Math.min(0, cw / 2 - S.boat.x * view.k));
    view.oy = vh <= ch ? (ch - vh) / 2 : Math.max(ch - vh, Math.min(0, ch / 2 - S.boat.y * view.k));
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = '#3C9FD6'; g.fillRect(0, 0, cw, ch);
    g.setTransform(view.k, 0, 0, view.k, view.ox, view.oy);
    // water from shallow to deep
    var wg = g.createLinearGradient(100, 0, W, 0); wg.addColorStop(0, '#8FDCE8'); wg.addColorStop(0.35, '#4FB6E0'); wg.addColorStop(1, '#2C8FCB');
    g.fillStyle = wg; g.fillRect(-200, -200, W + 400, H + 400);
    g.fillStyle = 'rgba(20,70,130,.35)'; blob(905, 440, 120, 40, 1); g.fill();                           // deep water
    g.fillStyle = 'rgba(255,140,170,.55)'; [[560, 480, 34], [610, 455, 26], [540, 440, 22], [600, 510, 20]].forEach(function (c, i) { blob(c[0], c[1], c[2], 18, i); g.fill(); });   // reef
    g.fillStyle = '#8D99A6'; [[760, 120, 30], [800, 160, 24], [725, 170, 20], [790, 100, 16]].forEach(function (c, i) { blob(c[0], c[1], c[2], 16, i + 2); g.fill(); });         // rocks
    g.fillStyle = 'rgba(255,255,255,.18)'; [[750, 112], [795, 152]].forEach(function (c) { g.beginPath(); g.ellipse(c[0] - 6, c[1] - 8, 8, 4, 0, 0, Math.PI * 2); g.fill(); });
    // waves
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.lineCap = 'round';
    for (var i = 0; i < 18; i++) { var wx = 160 + (i * 137) % 820, wy = 40 + (i * 89) % 560, s = Math.sin(time / 900 + i) * 6;
      g.beginPath(); g.arc(wx + s, wy, 10, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    // beach, palms, hut, dock
    g.fillStyle = '#F6E7C1'; g.beginPath(); g.moveTo(-200, -200); g.lineTo(110, -200);
    for (var y = -200; y <= H + 200; y += 40) g.lineTo(110 + Math.sin(y / 60) * 10, y); g.lineTo(-200, H + 200); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 4; g.beginPath(); for (var y2 = 0; y2 <= H; y2 += 20) g[y2 ? 'lineTo' : 'moveTo'](118 + Math.sin(y2 / 60 + time / 1200) * 8, y2); g.stroke();
    [[40, 90], [70, 140], [35, 470], [75, 540], [50, 380]].forEach(function (p) { palm(p[0], p[1]); });
    g.fillStyle = '#D9A066'; g.fillRect(22, 230, 62, 44); g.fillStyle = '#E5534B'; g.beginPath(); g.moveTo(14, 232); g.lineTo(53, 205); g.lineTo(92, 232); g.closePath(); g.fill();
    g.fillStyle = '#7A4E2D'; g.fillRect(46, 250, 14, 24);
    g.fillStyle = '#B07A4A'; g.fillRect(90, DOCK.y - 14, 140, 28); g.strokeStyle = '#8A5A34'; g.lineWidth = 2;
    for (var px = 98; px < 230; px += 14) { g.beginPath(); g.moveTo(px, DOCK.y - 14); g.lineTo(px, DOCK.y + 14); g.stroke(); }
    // a dhow far away
    var dx = 940 - (time / 200) % 160; g.fillStyle = '#7A4E2D'; g.beginPath(); g.ellipse(dx, 40, 22, 6, 0, 0, Math.PI); g.fill();
    g.fillStyle = '#FFF6E0'; g.beginPath(); g.moveTo(dx, 38); g.lineTo(dx + 4, 10); g.lineTo(dx + 18, 34); g.closePath(); g.fill();
    // fish schools (shadows) and fishing spots (bubbles)
    schools.forEach(function (sc) {
      sc.fish.forEach(function (f, k) { var a = time / 1400 + f.o, fx = sc.sp.x + Math.cos(a) * f.r, fy = sc.sp.y + Math.sin(a) * f.r * 0.6;
        g.save(); g.translate(fx, fy); g.rotate(a + Math.PI / 2); g.fillStyle = 'rgba(20,50,90,.28)'; g.beginPath(); g.ellipse(0, 0, 9, 4, 0, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.moveTo(-8, 0); g.lineTo(-14, -4); g.lineTo(-14, 4); g.closePath(); g.fill(); g.restore(); });
    });
    SPOTS.forEach(function (sp, i) {
      for (var k = 0; k < 5; k++) { var tt = (time / 900 + k / 5 + i * 0.3) % 1, bx = sp.x + Math.sin(k * 2.1 + i) * 14, by = sp.y + Math.cos(k * 1.7) * 10 - tt * 6;
        g.strokeStyle = 'rgba(255,255,255,' + (0.9 - tt * 0.8) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(bx, by, 3 + tt * 6, 0, Math.PI * 2); g.stroke(); }
      if (!save.spots[sp.id]) { g.fillStyle = '#FFD23F'; g.font = '700 18px Fredoka, sans-serif'; g.textAlign = 'center'; g.fillText('?', sp.x, sp.y - 26 + Math.sin(time / 300 + i) * 3); }
    });
    // fishing line and bobber
    var b = S.boat;
    if (S.cast) {
      var bob = Math.sin(time / 200) * (S.mode === 'reel' ? 4 : 1.5);
      g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(b.x, b.y); g.quadraticCurveTo((b.x + S.cast.x) / 2, (b.y + S.cast.y) / 2 + 20, S.cast.x, S.cast.y + bob); g.stroke();
      g.fillStyle = '#E5534B'; g.beginPath(); g.arc(S.cast.x, S.cast.y + bob, 6, Math.PI, 0); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(S.cast.x, S.cast.y + bob, 6, 0, Math.PI); g.fill();
      if (S.mode === 'reel') { g.strokeStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.arc(S.cast.x, S.cast.y, 12 + (time / 60) % 10, 0, Math.PI * 2); g.stroke(); }
    }
    // the boat with Saqr
    g.save(); g.translate(b.x, b.y); g.rotate(b.a);
    g.fillStyle = 'rgba(0,0,0,.15)'; g.beginPath(); g.ellipse(3, 5, 36, 16, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#9C6235'; g.beginPath(); g.moveTo(38, 0); g.quadraticCurveTo(20, -18, -30, -14); g.lineTo(-34, 0); g.lineTo(-30, 14); g.quadraticCurveTo(20, 18, 38, 0); g.fill();
    g.fillStyle = '#C98B55'; g.beginPath(); g.moveTo(30, 0); g.quadraticCurveTo(16, -11, -24, -9); g.lineTo(-26, 0); g.lineTo(-24, 9); g.quadraticCurveTo(16, 11, 30, 0); g.fill();
    var row = S.mode === 'row' && (S.target || S.keys.ArrowLeft || S.keys.ArrowRight || S.keys.ArrowUp || S.keys.ArrowDown) ? Math.sin(time / 180) * 0.5 : 0;
    g.strokeStyle = '#7A4E2D'; g.lineWidth = 3; g.beginPath(); g.moveTo(-4, -10); g.lineTo(-14 + row * 10, -30); g.moveTo(-4, 10); g.lineTo(-14 + row * 10, 30); g.stroke();
    g.restore();
    // Saqr (always upright)
    g.fillStyle = '#8A5A34'; g.beginPath(); g.arc(b.x, b.y, 11, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#F6E7C1'; g.beginPath(); g.arc(b.x, b.y + 2, 7, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#23204A'; g.beginPath(); g.arc(b.x - 3.5, b.y - 2, 1.8, 0, Math.PI * 2); g.arc(b.x + 3.5, b.y - 2, 1.8, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#FFB020'; g.beginPath(); g.moveTo(b.x - 2.5, b.y + 1); g.lineTo(b.x + 2.5, b.y + 1); g.lineTo(b.x, b.y + 5); g.closePath(); g.fill();
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.ellipse(b.x, b.y - 10, 10, 4, 0, Math.PI, 0); g.fill();             // little white cap (kuma)
    // evening light
    var ph = S.t / DAY;
    if (ph > 0.6) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = 'rgba(255,120,60,' + Math.min(0.28, (ph - 0.6) * 0.9) + ')'; g.fillRect(0, 0, cw, ch);
      if (ph > 0.85) { g.fillStyle = 'rgba(30,30,90,' + Math.min(0.3, (ph - 0.85) * 2) + ')'; g.fillRect(0, 0, cw, ch); } }
  }

  // ---- the 3D bay (three.js). Game positions (x 0–1000, y 0–620) become X = (x − 500) / 10, Z = (y − 310) / 10 ----
  function makeThree() {
    if (!window.THREE) return null;
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true }); } catch (e) { return null; }
    var P = function (x, y) { return { X: (x - 500) / 10, Z: (y - 310) / 10 }; };
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    var scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(38, 1, 0.5, 400);
    scene.fog = new THREE.Fog(0xBFE6FF, 220, 420);
    var hemi = new THREE.HemisphereLight(0xCFEFFF, 0xF3E2B6, 1.5); scene.add(hemi);
    var sun = new THREE.DirectionalLight(0xFFF1D6, 1.6); sun.position.set(-30, 60, 20); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); var sc = sun.shadow.camera; sc.left = -70; sc.right = 70; sc.top = 50; sc.bottom = -50; sc.near = 1; sc.far = 160;
    sun.shadow.bias = -0.0008; scene.add(sun); scene.add(sun.target);
    var mat = function (c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, flatShading: true, roughness: 0.85 }, o || {})); };
    var add = function (geo, m, x, y, z, parent) { var me = new THREE.Mesh(geo, m); me.position.set(x || 0, y || 0, z || 0); me.castShadow = true; me.receiveShadow = true; (parent || scene).add(me); return me; };
    var smooth = function (a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

    // seabed: shallow near the beach, deeper further out, a deep hole on the right
    var deepAt = function (x, y) { return Math.max(0, 1 - Math.hypot(x - 905, (y - 440) * 1.2) / 150); };
    var bedGeo = new THREE.PlaneGeometry(180, 120, 90, 60); bedGeo.rotateX(-Math.PI / 2);
    var bp = bedGeo.attributes.position, bedCol = [];
    for (var i = 0; i < bp.count; i++) {
      var gx = bp.getX(i) * 10 + 500, gy = bp.getZ(i) * 10 + 310, d = smooth(110, 360, gx) * 1.6 + deepAt(gx, gy) * 2.2;
      bp.setY(i, -0.35 - d + Math.sin(gx * 0.05) * Math.cos(gy * 0.04) * 0.12);
      var c = new THREE.Color(0xF7E9C0).lerp(new THREE.Color(0x4FA3D1), Math.min(1, d / 3.4)); bedCol.push(c.r, c.g, c.b);
    }
    bedGeo.setAttribute('color', new THREE.Float32BufferAttribute(bedCol, 3)); bedGeo.computeVertexNormals();
    var bed = new THREE.Mesh(bedGeo, mat(0xFFFFFF, { vertexColors: true })); bed.receiveShadow = true; scene.add(bed);

    // water: low-poly waves, clear near the shore so the reef and fish show through
    var waterGeo = new THREE.PlaneGeometry(180, 120, 72, 48); waterGeo.rotateX(-Math.PI / 2);
    var wp = waterGeo.attributes.position, base = [], waterCol = [];
    for (i = 0; i < wp.count; i++) {
      var wx = wp.getX(i) * 10 + 500, wy = wp.getZ(i) * 10 + 310, dd = Math.min(1, smooth(110, 420, wx) * 0.75 + deepAt(wx, wy) * 0.6);
      base.push(wp.getX(i), wp.getZ(i));
      var wc = new THREE.Color(0x7FF0F0).lerp(new THREE.Color(0x1E8FE0), dd); waterCol.push(wc.r, wc.g, wc.b);
    }
    waterGeo.setAttribute('color', new THREE.Float32BufferAttribute(waterCol, 3));
    var water = new THREE.Mesh(waterGeo, mat(0xFFFFFF, { vertexColors: true, transparent: true, opacity: 0.62, roughness: 0.18, metalness: 0.0 }));
    scene.add(water);

    // beach, dock, hut, palms
    var beach = add(new THREE.BoxGeometry(60, 1.4, 130), mat(0xF3E2B6), -69, 0.1, 0);
    var slope = add(new THREE.BoxGeometry(5, 1.4, 130), mat(0xEEDCAB), -38.6, -0.25, 0); slope.rotation.z = -0.32;
    var foam = add(new THREE.BoxGeometry(0.6, 0.1, 130), mat(0xFFFFFF, { transparent: true, opacity: 0.7 }), -36.4, 0.06, 0); foam.castShadow = false;
    var dk = P(160, DOCK.y), wood = mat(0xB07A4A), darkWood = mat(0x7A4E2D);
    for (var k = 0; k < 10; k++) add(new THREE.BoxGeometry(1.25, 0.25, 3), k % 2 ? wood : mat(0xA36F42), -40.5 + k * 1.4, 0.75, dk.Z);
    [[-40, -1.3], [-40, 1.3], [-33, -1.3], [-33, 1.3], [-27.3, -1.3], [-27.3, 1.3]].forEach(function (pp) { add(new THREE.CylinderGeometry(0.2, 0.2, 2.4, 6), darkWood, pp[0], -0.3, dk.Z + pp[1]); });
    var hp = P(53, 252), hut = new THREE.Group(); hut.position.set(hp.X, 0.8, hp.Z); scene.add(hut);
    add(new THREE.BoxGeometry(5.5, 3.6, 4.4), mat(0xE0B07A), 0, 1.8, 0, hut);
    var roof = add(new THREE.ConeGeometry(4.6, 2.6, 4), mat(0xE5534B), 0, 4.9, 0, hut); roof.rotation.y = Math.PI / 4;
    add(new THREE.BoxGeometry(1.3, 2.2, 0.2), darkWood, 0, 1.1, 2.25, hut);
    add(new THREE.BoxGeometry(1, 1, 0.2), mat(0x9FD8F0), -1.8, 2.2, 2.25, hut);
    var leafMat = mat(0x3E9B57), trunkMat = mat(0xA67C52);
    [[40, 90], [72, 150], [35, 470], [80, 545], [55, 385], [28, 30], [30, 600]].forEach(function (pp, n) {
      var q = P(pp[0], pp[1]), palm = new THREE.Group(); palm.position.set(q.X, 0.8, q.Z); palm.rotation.y = n * 1.3; scene.add(palm);
      var lean = 0.12 + (n % 3) * 0.05, top = new THREE.Vector3(0, 0, 0);
      for (var s2 = 0; s2 < 4; s2++) { var seg = add(new THREE.CylinderGeometry(0.28 - s2 * 0.03, 0.34 - s2 * 0.03, 1.6, 6), trunkMat, top.x, top.y + 0.8, 0, palm); seg.rotation.z = -lean * s2; top.x += Math.sin(lean * s2) * 1.6; top.y += Math.cos(lean * s2) * 1.5; }
      for (var lf = 0; lf < 6; lf++) { var leaf = add(new THREE.ConeGeometry(0.55, 3.4, 4), leafMat, top.x, top.y + 0.2, 0, palm);
        leaf.rotation.order = 'YXZ'; leaf.rotation.y = lf / 6 * Math.PI * 2; leaf.rotation.x = 1.15; leaf.translateY(1.5); leaf.scale.z = 0.35; }
      add(new THREE.SphereGeometry(0.3, 6, 5), mat(0x7A4E2D), top.x + 0.3, top.y - 0.1, 0.2, palm);
    });

    // rocks and the coral reef
    var rockMat = mat(0x8D99A6);
    [[760, 120, 3.2], [800, 162, 2.5], [725, 172, 2], [792, 98, 1.6], [830, 130, 1.2]].forEach(function (r, n) { var q = P(r[0], r[1]);
      var rock = add(new THREE.DodecahedronGeometry(r[2], 0), rockMat, q.X, 0.1 + r[2] * 0.15, q.Z); rock.rotation.set(n, n * 2, 0); rock.scale.y = 0.6; });
    var coral = [0xFF7FA3, 0xFFA45C, 0xB48CFF, 0xFF6F91];
    [[560, 480, 2], [612, 455, 1.6], [540, 440, 1.4], [600, 512, 1.3], [585, 430, 1], [528, 500, 1.1], [632, 490, 1]].forEach(function (r, n) { var q = P(r[0], r[1]);
      add(new THREE.IcosahedronGeometry(r[2], 0), mat(coral[n % 4]), q.X, -1.2, q.Z).scale.y = 0.7;
      for (var b2 = 0; b2 < 3; b2++) { var br = add(new THREE.CylinderGeometry(0.12, 0.2, 1.4, 5), mat(coral[(n + b2 + 1) % 4]), q.X + (b2 - 1) * 0.6, -0.8, q.Z + (b2 % 2) * 0.5); br.rotation.z = (b2 - 1) * 0.4; }
    });

    // fishing spots: rising bubbles, a ring on the surface, and a "?" marker until found
    var bubbleMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.8, roughness: 0.1 });
    var spotFx = SPOTS.map(function (sp) {
      var q = P(sp.x, sp.y), grp = new THREE.Group(); grp.position.set(q.X, 0, q.Z); scene.add(grp);
      var bubbles = []; for (var j = 0; j < 7; j++) { var bb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), bubbleMat.clone()); bb.userData = { o: j / 7, dx: Math.sin(j * 2.1) * 1.2, dz: Math.cos(j * 1.7) * 1.0 }; grp.add(bb); bubbles.push(bb); }
      var ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.08, 6, 24), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.6 })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.15; grp.add(ring);
      var marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.6, 0), mat(0xFFD23F, { emissive: 0x664400, emissiveIntensity: 0.4 })); marker.position.y = 3; marker.castShadow = true; grp.add(marker);
      return { sp: sp, bubbles: bubbles, ring: ring, marker: marker };
    });

    // fish swimming in schools under the water
    var fishMat = mat(0x2D5A80, { transparent: true, opacity: 0.85 });
    var fishGeo = new THREE.SphereGeometry(0.5, 6, 4); fishGeo.scale(1.3, 0.45, 0.55);
    var tailGeo = new THREE.ConeGeometry(0.35, 0.6, 4); tailGeo.rotateZ(Math.PI / 2);
    var schools3 = SPOTS.map(function (sp, n) {
      var q = P(sp.x, sp.y);
      return [0, 1, 2, 3, 4].map(function (j) { var f = new THREE.Group(); var body = new THREE.Mesh(fishGeo, fishMat); f.add(body); var tail = new THREE.Mesh(tailGeo, fishMat); tail.position.x = -0.85; f.add(tail);
        scene.add(f); return { g: f, tail: tail, cx: q.X, cz: q.Z, r: 2.4 + j * 0.6, o: j * 1.25 + n }; });
    });

    // the boat with Saqr
    var hullShape = new THREE.Shape(); hullShape.moveTo(3.9, 0); hullShape.quadraticCurveTo(2.2, 1.75, -2.9, 1.45); hullShape.lineTo(-3.3, 0); hullShape.lineTo(-2.9, -1.45); hullShape.quadraticCurveTo(2.2, -1.75, 3.9, 0);
    var hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 1.1, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.25, bevelSegments: 1, curveSegments: 8 }); hullGeo.rotateX(Math.PI / 2);
    var inner = new THREE.Shape(); inner.moveTo(3.1, 0); inner.quadraticCurveTo(1.8, 1.3, -2.5, 1.05); inner.lineTo(-2.8, 0); inner.lineTo(-2.5, -1.05); inner.quadraticCurveTo(1.8, -1.3, 3.1, 0);
    var innerGeo = new THREE.ShapeGeometry(inner); innerGeo.rotateX(-Math.PI / 2);
    var boat = new THREE.Group(); scene.add(boat);
    add(hullGeo, mat(0x9C6235), 0, 1.0, 0, boat);
    add(innerGeo, mat(0xC98B55), 0, 0.95, 0, boat);
    add(new THREE.BoxGeometry(0.5, 0.15, 2.4), darkWood, 1.2, 1.05, 0, boat);
    var oars = [-1, 1].map(function (side) { var pivot = new THREE.Group(); pivot.position.set(-0.4, 1.1, side * 1.3); boat.add(pivot);
      var oar = add(new THREE.BoxGeometry(0.16, 0.12, 3.4), darkWood, 0, 0, side * 1.6, pivot); add(new THREE.BoxGeometry(0.7, 0.08, 0.9), darkWood, 0, 0, side * 3.2, pivot); return pivot; });
    var saqr = new THREE.Group(); saqr.position.set(-0.4, 1.0, 0); boat.add(saqr);
    add(new THREE.SphereGeometry(0.95, 10, 8), mat(0x8A5A34), 0, 0.9, 0, saqr).scale.y = 1.1;
    add(new THREE.SphereGeometry(0.62, 10, 8), mat(0xF6E7C1), 0.55, 1.05, 0, saqr).scale.set(0.6, 1, 1.05);
    [-0.28, 0.28].forEach(function (z) { add(new THREE.SphereGeometry(0.13, 6, 5), mat(0x23204A), 0.86, 1.35, z, saqr); add(new THREE.SphereGeometry(0.05, 4, 3), mat(0xFFFFFF), 0.95, 1.4, z + 0.03, saqr); });
    var beak = add(new THREE.ConeGeometry(0.17, 0.42, 5), mat(0xFFB020), 1.05, 1.08, 0, saqr); beak.rotation.z = -Math.PI / 2 - 0.4;
    add(new THREE.SphereGeometry(0.62, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xFFFFFF), 0, 1.72, 0, saqr);
    [-1, 1].forEach(function (side) { var wing = add(new THREE.SphereGeometry(0.45, 6, 5), mat(0x744A2A), -0.1, 0.85, side * 0.85, saqr); wing.scale.set(1.2, 0.8, 0.35); });

    // fishing line and bobber
    var linePts = []; for (i = 0; i < 24; i++) linePts.push(new THREE.Vector3());
    var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePts), new THREE.LineBasicMaterial({ color: 0xFFFFFF })); line.frustumCulled = false; scene.add(line);
    var bobber = new THREE.Group(); scene.add(bobber);
    add(new THREE.SphereGeometry(0.4, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xE5534B), 0, 0, 0, bobber);
    add(new THREE.SphereGeometry(0.4, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(0xFFFFFF), 0, 0, 0, bobber);
    var splash = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 6, 24), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.7 })); splash.rotation.x = -Math.PI / 2; scene.add(splash);

    // a dhow sailing far away
    var dhow = new THREE.Group(); scene.add(dhow);
    var dh = add(new THREE.BoxGeometry(5, 1, 1.6), mat(0x7A4E2D), 0, 0.4, 0, dhow); dh.scale.x = 1;
    add(new THREE.CylinderGeometry(0.08, 0.08, 4.5, 5), darkWood, 0.3, 2.6, 0, dhow);
    var sailShape = new THREE.Shape(); sailShape.moveTo(0, 0); sailShape.lineTo(-2.4, 0.4); sailShape.lineTo(0.2, 4); sailShape.lineTo(0, 0);
    var sail = add(new THREE.ShapeGeometry(sailShape), mat(0xFFF6E0, { side: THREE.DoubleSide }), 0.4, 0.9, 0, dhow);

    // light through the day
    var SKY = [[0, 0xBFE6FF, 0xFFE8C0, 2.2], [0.33, 0xA8DCFF, 0xFFFFFF, 2.6], [0.66, 0xFFC9A0, 0xFFC080, 2.1], [0.85, 0xF59E7A, 0xFF9A60, 1.6], [1, 0x34406E, 0x9AA6FF, 0.8]];
    var cA = new THREE.Color(), cB = new THREE.Color();
    function daylight(p) {
      for (var n = 0; n < SKY.length - 1 && p > SKY[n + 1][0]; n++);
      var a = SKY[n], b = SKY[Math.min(n + 1, SKY.length - 1)], t = b[0] > a[0] ? (p - a[0]) / (b[0] - a[0]) : 0;
      cA.set(a[1]).lerp(cB.set(b[1]), t); scene.background = scene.background || new THREE.Color(); scene.background.copy(cA); scene.fog.color.copy(cA); hemi.color.copy(cA);
      sun.color.set(a[2]).lerp(cB.set(b[2]), t); sun.intensity = a[3] + (b[3] - a[3]) * t;
      sun.position.set(-40 + p * 80, 60 - p * 30, 25);
    }

    // camera: the whole bay on wide screens; closer and following the boat on phones
    var camTarget = new THREE.Vector3(0, 0, 2), elev = 0.95;
    function placeCamera(snap) {
      var aspect = camera.aspect, b = P(S.boat.x, S.boat.y), wide = aspect > 1.25;
      elev = wide ? 0.95 : aspect > 0.8 ? 1.05 : 1.2;
      var visibleW = wide ? 96 : 42, vf = camera.fov * Math.PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * aspect);
      var dist = wide ? Math.max(visibleW / 2 / Math.tan(hf / 2), 62 / 2 / Math.tan(vf / 2) * 0.95) : Math.min(visibleW / 2 / Math.tan(hf / 2), 30 / Math.tan(vf / 2));
      if (!wide) visibleW = 2 * dist * Math.tan(hf / 2);
      var tx = wide ? -3 : Math.max(-56 + visibleW / 2, Math.min(50 - visibleW / 2, b.X)), tz = wide ? 3 : Math.max(-22, Math.min(22, b.Z + 1));
      var k = snap ? 1 : 0.06; camTarget.x += (tx - camTarget.x) * k; camTarget.z += (tz - camTarget.z) * k;
      camera.position.set(camTarget.x, Math.sin(elev) * dist, camTarget.z + Math.cos(elev) * dist); camera.lookAt(camTarget);
    }

    var ray = new THREE.Raycaster(), sea = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3(), ndc = new THREE.Vector2();
    var first = true;
    return {
      resize: function () { var r = stage.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix(); placeCamera(true); },
      pick: function (cx, cy, r) {
        ndc.set((cx - r.left) / r.width * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera);
        if (!ray.ray.intersectPlane(sea, hit)) return null; return { x: hit.x * 10 + 500, y: hit.z * 10 + 310 };
      },
      screenOf: function (x, y) { var q = P(x, y), v = new THREE.Vector3(q.X, 0, q.Z).project(camera), r = cv.getBoundingClientRect(); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; },
      draw: function (time) {
        var t = time / 1000, b = S.boat, q = P(b.x, b.y);
        // waves
        for (var n = 0; n < wp.count; n++) { var X = base[n * 2], Z = base[n * 2 + 1]; wp.setY(n, 0.16 * Math.sin(X * 0.33 + t * 1.3) + 0.11 * Math.sin(Z * 0.47 + t * 1.7) + 0.05 * Math.sin((X + Z) * 0.9 + t * 2.3)); }
        wp.needsUpdate = true; waterGeo.computeVertexNormals();
        // boat follows the game, bobbing on the waves; oars move while rowing
        boat.position.set(q.X, 0.12 * Math.sin(t * 1.6) - 0.85, q.Z); boat.rotation.set(0.04 * Math.sin(t * 1.3), -b.a, 0.04 * Math.sin(t * 1.1));
        var rowing = S.mode === 'row' && (S.target || S.keys.ArrowLeft || S.keys.ArrowRight || S.keys.ArrowUp || S.keys.ArrowDown);
        oars.forEach(function (o, n2) { var sw = rowing ? Math.sin(t * 6) * 0.55 : 0.25; o.rotation.y = (n2 ? -1 : 1) * sw; o.rotation.x = (n2 ? -1 : 1) * (rowing ? 0.2 + Math.cos(t * 6) * 0.15 : 0.3); });
        saqr.rotation.y = S.mode === 'reel' ? Math.sin(t * 8) * 0.12 : 0; saqr.position.y = 1.0 + (S.mode === 'reel' ? Math.abs(Math.sin(t * 8)) * 0.1 : 0);
        // spots
        spotFx.forEach(function (fx, n3) {
          fx.bubbles.forEach(function (bb) { var u = (t * 0.6 + bb.userData.o) % 1; bb.position.set(bb.userData.dx * (1 + u * 0.3), -0.6 + u * 1.3, bb.userData.dz); bb.scale.setScalar(0.5 + u * 1.2); bb.material.opacity = 0.85 * (1 - u); });
          var pulse = (t * 0.5 + n3 * 0.2) % 1; fx.ring.scale.setScalar(0.8 + pulse * 0.8); fx.ring.material.opacity = 0.55 * (1 - pulse);
          fx.marker.visible = !save.spots[fx.sp.id]; fx.marker.rotation.y = t * 1.5; fx.marker.position.y = 3 + Math.sin(t * 2 + n3) * 0.35;
        });
        // fish
        schools3.forEach(function (sc2) { sc2.forEach(function (f) { var a = t * 0.7 + f.o; f.g.position.set(f.cx + Math.cos(a) * f.r, -0.9, f.cz + Math.sin(a) * f.r * 0.7); f.g.rotation.y = -a - Math.PI / 2; f.tail.rotation.y = Math.sin(t * 10 + f.o) * 0.5; }); });
        // line and bobber
        line.visible = bobber.visible = splash.visible = !!S.cast;
        if (S.cast) {
          var c = P(S.cast.x, S.cast.y), bob = Math.sin(t * 5) * (S.mode === 'reel' ? 0.25 : 0.08);
          var tip = new THREE.Vector3(q.X + Math.cos(b.a) * 0.6, 2.6 + boat.position.y + 0.85, q.Z + Math.sin(b.a) * 0.6), end = new THREE.Vector3(c.X, 0.2 + bob, c.Z);
          for (var m = 0; m < 24; m++) { var u = m / 23; linePts[m].lerpVectors(tip, end, u); linePts[m].y -= Math.sin(u * Math.PI) * 0.8; }
          line.geometry.setFromPoints(linePts); bobber.position.copy(end);
          var sp2 = (t * (S.mode === 'reel' ? 1.6 : 0.5)) % 1; splash.position.set(c.X, 0.2, c.Z); splash.scale.setScalar(0.5 + sp2 * 1.5); splash.material.opacity = 0.7 * (1 - sp2);
        }
        // dhow
        var dx = 46 - ((t * 0.8) % 110); dhow.position.set(dx, -0.1 + Math.sin(t) * 0.1, -36); dhow.rotation.y = Math.PI;
        daylight(Math.min(1, S.t / DAY));
        placeCamera(first); first = false;
        renderer.render(scene, camera);
      }
    };
  }
  var three = makeThree();
  if (!three) { g = cv.getContext('2d'); }
  function draw(time) { if (three) three.draw(time); else draw2D(time); }

  // ---- loop ----
  function resize() { if (three) return three.resize(); var r = stage.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); }
  window.addEventListener('resize', resize); resize();
  var last = performance.now(), hudT = 0;
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    update(dt); draw(now);
    hudT += dt; if (hudT > 0.5) { hudT = 0; hud(); }
    requestAnimationFrame(frame);
  }
  hud(); controls();
  requestAnimationFrame(frame);
  // for automated tests
  window.__bay = { three: !!three, screenOf: function (x, y) { return three ? three.screenOf(x, y) : null; }, view: view, S: S, SPOTS: SPOTS, DOCK: DOCK, save: save, FISH: FISH, bite: function () { bite(); } };
})();
