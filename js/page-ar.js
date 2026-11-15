/* Sadu site: logic for ar.html. renderVals() returns every value and click handler the page template uses. */
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { filter: 'all', done: { l1: true, l2: true, l3: false, l4: false, l5: false }, enroll: '', phon: 'ar', pIdx: 0, pAns: '', pStars: 0, last: 'l2', lastDone: true, ff: { mode: 'idle', step: 0, lives: 3, q: null, wrong: [], msg: '', ok: false, end: 0 }, lc: { mode: 'idle', lang: 'ar', stars: 0, target: 0, tiles: [0, 1, 2], hit: false, hint: false, wrong: [], msg: '', ok: false }, sd: { mode: 'idle', served: 0, best: 0, order: null, give: 0, msg: '', ok: false, end: 0 }, weave: [1,0,2,2,0,1, 0,3,1,1,3,0, 0,3,1,1,3,0, 1,0,2,2,0,1] };
  }
  renderVals() {
    var self = this;
    var accent = this.props.accent ?? '#0B6B3A';
    var f = this.state.filter;
    var keys = ['all', 'math', 'science', 'lang', 'art', 'code'];
    var pill = {}, pick = {}, show = {};
    keys.forEach(function (k) {
      var on = f === k;
      pill[k] = { on: on ? 'true' : 'false', bg: on ? '#23204A' : '#FFFFFF', fg: on ? '#FFFFFF' : '#23204A' };
      pick[k] = function () { self.setState({ filter: k }); };
      show[k] = f === 'all' || on;
    });
    var done = this.state.done;
    var out = { accent: accent, pill: pill, pick: pick, show: show };
    var count = 0;
    ['l1', 'l2', 'l3', 'l4', 'l5'].forEach(function (id) {
      var d = !!done[id];
      if (d) count += 1;
      out[id] = {
        done: d,
        bg: d ? '#D9F8EE' : '#FBF3E4',
        dot: d ? '#0E7C66' : '#FFFFFF',
        toggle: function () {
          var next = Object.assign({}, self.state.done);
          next[id] = !next[id];
          self.setState({ done: next, last: id, lastDone: next[id] });
        }
      };
    });
    var pctNum = Math.round((count / 5) * 100);
    out.pct = pctNum + '%';
    out.pctNum = String(pctNum);
    out.xp = String(count * 40);
    out.doneText = count + ' من 5';
    var T = {"labels": {"l1": "تعرّف على صقرك", "l2": "اجعله يطير", "l3": "علّمه الانقضاض", "l4": "لوّن سماء الصحراء", "l5": "اصنع اللعبة الصغيرة"}, "t_done": "اكتمل درس", "t_undo": "تم تحديث التقدّم", "t_all": "اكتمل الأسبوع 1", "b_done": "أنهى طفلك درس «%L». أُنجز %C من 5 دروس هذا الأسبوع.", "b_undo": "أُلغي تحديد درس «%L». أُنجز %C من 5 دروس هذا الأسبوع.", "b_all": "اكتملت الدروس الخمسة. كسب طفلك %X نقطة هذا الأسبوع.", "sq": "مربع "};
    var last = this.state.last, lastDone = this.state.lastDone;
    var fill = function (str) { return str.replace('%L', T.labels[last]).replace('%C', String(count)).replace('%X', String(count * 40)); };
    out.note = count === 5 ? { title: T.t_all, body: fill(T.b_all) } : lastDone ? { title: T.t_done, body: fill(T.b_done) } : { title: T.t_undo, body: fill(T.b_undo) };
    var colours = ['#F4E9D3', '#B3261E', '#0B6B3A', '#FFC93C', '#23204A'];
    var weave = this.state.weave;
    out.cells = weave.map(function (v, i) {
      return { bg: colours[v], label: T.sq + (i + 1), tap: function () {
        var next = self.state.weave.slice(); next[i] = (next[i] + 1) % colours.length; self.setState({ weave: next });
      } };
    });
    out.clearWeave = function () { self.setState({ weave: weave.map(function () { return 0; }) }); };
    var PH = {"en": [{"ch": "s", "sound": "/s/", "word": "sun", "gloss": "شمس", "tip": "ضُمَّ أسنانك وأخرِج صفيرًا مثل الأفعى."}, {"ch": "a", "sound": "/a/", "word": "ant", "gloss": "نملة", "tip": "افتح فمك واسعًا وانطق صوتًا قصيرًا."}, {"ch": "t", "sound": "/t/", "word": "tent", "gloss": "خيمة", "tip": "اطرق بلسانك خلف أسنانك العليا."}, {"ch": "p", "sound": "/p/", "word": "palm", "gloss": "نخلة", "tip": "أطبِق شفتيك ثم افتحهما بنفخة."}, {"ch": "i", "sound": "/i/", "word": "ink", "gloss": "حبر", "tip": "ابتسم قليلًا وانطق صوتًا قصيرًا."}, {"ch": "n", "sound": "/n/", "word": "nest", "gloss": "عش", "tip": "ارفع لسانك خلف أسنانك وأخرِج الصوت من أنفك."}, {"ch": "m", "sound": "/m/", "word": "map", "gloss": "خريطة", "tip": "أطبِق شفتيك وهَمهِم."}, {"ch": "d", "sound": "/d/", "word": "date", "gloss": "تمرة", "tip": "اطرق بلسانك خلف أسنانك العليا مع صوت."}, {"ch": "g", "sound": "/g/", "word": "goat", "gloss": "ماعز", "tip": "ارفع آخر لسانك مع صوت."}, {"ch": "o", "sound": "/o/", "word": "olive", "gloss": "زيتون", "tip": "دوِّر فمك وانطق صوتًا قصيرًا."}, {"ch": "c", "sound": "/k/", "word": "camel", "gloss": "جمل", "tip": "ارفع آخر لسانك ثم أخرِج الهواء."}, {"ch": "k", "sound": "/k/", "word": "kite", "gloss": "طائرة ورقية", "tip": "ارفع آخر لسانك ثم أخرِج الهواء."}], "ar": [{"ch": "ب", "sound": "بَ", "word": "بيت", "gloss": "", "tip": "أطبِق الشفتين ثم افتحهما."}, {"ch": "ت", "sound": "تَ", "word": "تمر", "gloss": "", "tip": "طرف اللسان يلمس خلف الأسنان العليا."}, {"ch": "س", "sound": "سَ", "word": "سمكة", "gloss": "", "tip": "طرف اللسان قرب الأسنان، واترك الهواء يخرج بصفير."}, {"ch": "م", "sound": "مَ", "word": "ماء", "gloss": "", "tip": "أطبِق الشفتين وأخرِج الصوت من الأنف."}, {"ch": "ن", "sound": "نَ", "word": "نخلة", "gloss": "", "tip": "ارفع طرف اللسان وأخرِج الصوت من الأنف."}, {"ch": "ر", "sound": "رَ", "word": "رمل", "gloss": "", "tip": "طرف اللسان يهتزّ بخفّة."}, {"ch": "د", "sound": "دَ", "word": "دلّة", "gloss": "", "tip": "طرف اللسان على لثة الأسنان العليا بلطف."}, {"ch": "ك", "sound": "كَ", "word": "كتاب", "gloss": "", "tip": "ارفع آخر اللسان وأخرِج صوتًا خفيفًا."}, {"ch": "ج", "sound": "جَ", "word": "جمل", "gloss": "", "tip": "وسط اللسان يلمس سقف الفم."}, {"ch": "ح", "sound": "حَ", "word": "حصان", "gloss": "", "tip": "من وسط الحلق مع النفَس."}], "yes": "أحسنت! «%W» تبدأ بصوت %S.", "no": "ليست هذه. حاول مرة أخرى."};
    var pl = this.state.phon, pi = this.state.pIdx, pa = this.state.pAns;
    var set = PH[pl], cur = set[pi];
    var ph = { dir: pl === 'ar' ? 'rtl' : 'ltr', cur: cur, stars: String(this.state.pStars) };
    ph.enOn = pl === 'en' ? 'true' : 'false'; ph.arOn = pl === 'ar' ? 'true' : 'false';
    ph.enBg = pl === 'en' ? '#23204A' : '#FFFFFF'; ph.enFg = pl === 'en' ? '#FFFFFF' : '#23204A';
    ph.arBg = pl === 'ar' ? '#23204A' : '#FFFFFF'; ph.arFg = pl === 'ar' ? '#FFFFFF' : '#23204A';
    ph.setEn = function () { self.setState({ phon: 'en', pIdx: 0, pAns: '' }); };
    ph.setAr = function () { self.setState({ phon: 'ar', pIdx: 0, pAns: '' }); };
    ph.letters = set.map(function (l, i) {
      var on = i === pi;
      return { ch: l.ch, on: on ? 'true' : 'false', bg: on ? '#0B6B3A' : '#FBF3E4', fg: on ? '#FFFFFF' : '#23204A', pick: function () { self.setState({ pIdx: i, pAns: '' }); } };
    });
    var order = [[0, 2, 4], [2, 0, 4], [4, 2, 0]][pi % 3];
    ph.choices = order.map(function (off) {
      var l = set[(pi + off) % set.length], right = off === 0;
      return { word: l.word, bg: right && pa === 'ok' ? '#D9F8EE' : '#FBF3E4', tap: function () {
        if (right) { self.setState({ pAns: 'ok', pStars: self.state.pStars + (pa === 'ok' ? 0 : 1) }); } else { self.setState({ pAns: 'bad' }); }
      } };
    });
    ph.msg = pa === 'ok' ? PH.yes.replace('%W', cur.word).replace('%S', cur.sound) : pa === 'bad' ? PH.no : '';
    ph.msgColor = pa === 'ok' ? '#0B6B3A' : '#B3261E';
    ph.next = function () { self.setState({ pIdx: (pi + 1) % set.length, pAns: '' }); };
    ph.hear = function () {
      try {
        var u = new SpeechSynthesisUtterance(cur.word);
        var want = pl === 'ar' ? ['ar-sa', 'ar'] : ['en-gb', 'en'];
        var voices = window.speechSynthesis.getVoices() || [];
        var norm = function (v) { return String(v.lang || '').toLowerCase().replace('_', '-'); };
        var best = voices.filter(function (v) { return norm(v) === want[0]; })[0] || voices.filter(function (v) { return norm(v).indexOf(want[1]) === 0; })[0];
        if (best) { u.voice = best; }
        u.lang = pl === 'ar' ? 'ar-SA' : 'en-GB'; u.rate = 0.8;
        window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
      } catch (e) {}
    };
    out.ph = ph;
    out.g = souqDash(this, {"items": [["علبة تمر", 12], ["كيس قهوة", 18], ["خبز", 2], ["برطمان عسل", 35], ["علبة لبن", 4], ["كيس برتقال", 6], ["كيس هيل", 25], ["بطيخة", 9]], "line": "%Q × %N (سعر الواحد %P ريال)", "sar": "%N ريال", "add": "أضِف %N ريال", "low": "أقل من المطلوب. عُدَّ مرة أخرى.", "high": "أكثر من المطلوب. عُدَّ مرة أخرى.", "yes": "صحيح! الباقي %C ريال. الزبون التالي.", "result": "عدد الزبائن الذين خدمتهم: %N", "result1": "عدد الزبائن الذين خدمتهم: %N", "best": "أفضل نتيجة: %N"});
    out.lc = letterCatch(this, {"yes": "أحسنت! «%W» تبدأ بحرف %L.", "no": "ليس هذا. حاول مرة أخرى."}, PH);
    out.ff = falconFlight(this, {"feathers": "الريش الباقي: %N", "yes": "صحيح! إلى الكثيب التالي.", "no": "ليست صحيحة. حاول مرة أخرى.", "wind": "تغيّرت الريح. هذه مسألة جديدة.", "wonText": "الريش الباقي: %N من 3.", "lostText": "قطعتَ %S من %G كثبان."});
    // the real courses (js/courses.js), for the Courses section
    out.realCourses = (window.SADU_COURSES || []).map(function (c) {
      var t = function (o) { return o == null ? '' : typeof o === 'string' ? o : o['ar'] || o.en; };
      return { name: t(c.name), age: t(c.age), count: c.lessons.length, color: c.color, tint: c.tint || '#F1ECE0',
        sample: c.lessons.slice(0, 3).map(function (l) { return t(l.title); }).join(' · ') };
    });
    var es = this.state.enroll;
    out.enrollMsg = { text: es === 'ok' ? "شكرًا لك. تفقّد بريدك للحصول على الدرس الأول." : es === 'bad' ? "الرجاء إدخال بريد إلكتروني صحيح." : '', color: es === 'ok' ? '#0B6B3A' : '#B3261E' };
    out.enroll = function () {
      var el = document.getElementById('enroll-email');
      var v = el ? String(el.value).trim() : '';
      self.setState({ enroll: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'ok' : 'bad' });
    };
    return out;
  }
}

startPage(Component, { accent: '#0B6B3A' });
