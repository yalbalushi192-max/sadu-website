/* Sadu site: logic for index.html. renderVals() returns every value and click handler the page template uses. */
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { filter: 'all', done: { l1: true, l2: true, l3: false, l4: false, l5: false }, enroll: '', phon: 'en', pIdx: 0, pAns: '', pStars: 0, last: 'l2', lastDone: true, ff: { mode: 'idle', step: 0, lives: 3, q: null, wrong: [], msg: '', ok: false, end: 0 }, lc: { mode: 'idle', lang: 'en', stars: 0, target: 0, tiles: [0, 1, 2], hit: false, hint: false, wrong: [], msg: '', ok: false }, sd: { mode: 'idle', served: 0, best: 0, order: null, give: 0, msg: '', ok: false, end: 0 }, weave: [1,0,2,2,0,1, 0,3,1,1,3,0, 0,3,1,1,3,0, 1,0,2,2,0,1] };
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
    out.doneText = count + ' of 5';
    var T = {"labels": {"l1": "Meet your falcon", "l2": "Make it fly", "l3": "Teach it to dive", "l4": "Paint the desert sky", "l5": "Build the mini game"}, "t_done": "Lesson finished", "t_undo": "Progress updated", "t_all": "Week 1 complete", "b_done": "Your child finished \"%L\". %C of 5 lessons done this week.", "b_undo": "\"%L\" was marked as not done. %C of 5 lessons done this week.", "b_all": "All 5 lessons are done. %X points earned this week.", "sq": "Square "};
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
    var PH = {"en": [{"ch": "s", "sound": "/s/", "word": "sun", "gloss": "", "tip": "Teeth together and hiss like a snake."}, {"ch": "a", "sound": "/a/", "word": "ant", "gloss": "", "tip": "Open your mouth wide and say a short a."}, {"ch": "t", "sound": "/t/", "word": "tent", "gloss": "", "tip": "Tap your tongue behind your top teeth."}, {"ch": "p", "sound": "/p/", "word": "palm", "gloss": "", "tip": "Close your lips, then pop them open."}, {"ch": "i", "sound": "/i/", "word": "ink", "gloss": "", "tip": "Smile a little and say a short i."}, {"ch": "n", "sound": "/n/", "word": "nest", "gloss": "", "tip": "Tongue up behind your teeth and hum through your nose."}, {"ch": "m", "sound": "/m/", "word": "map", "gloss": "", "tip": "Lips together and hum."}, {"ch": "d", "sound": "/d/", "word": "date", "gloss": "", "tip": "Tap your tongue behind your top teeth with your voice on."}, {"ch": "g", "sound": "/g/", "word": "goat", "gloss": "", "tip": "Lift the back of your tongue with your voice on."}, {"ch": "o", "sound": "/o/", "word": "olive", "gloss": "", "tip": "Make a round mouth and say a short o."}, {"ch": "c", "sound": "/k/", "word": "camel", "gloss": "", "tip": "Lift the back of your tongue, then let the air out."}, {"ch": "k", "sound": "/k/", "word": "kite", "gloss": "", "tip": "Lift the back of your tongue, then let the air out."}], "ar": [{"ch": "ب", "sound": "بَ", "word": "بيت", "gloss": "house", "tip": "Press both lips together, then open them."}, {"ch": "ت", "sound": "تَ", "word": "تمر", "gloss": "dates", "tip": "The tip of the tongue touches behind the top teeth."}, {"ch": "س", "sound": "سَ", "word": "سمكة", "gloss": "fish", "tip": "Tongue tip near the teeth, and let the air hiss out."}, {"ch": "م", "sound": "مَ", "word": "ماء", "gloss": "water", "tip": "Lips together, and the sound comes through the nose."}, {"ch": "ن", "sound": "نَ", "word": "نخلة", "gloss": "palm tree", "tip": "Tongue tip up, and the sound comes through the nose."}, {"ch": "ر", "sound": "رَ", "word": "رمل", "gloss": "sand", "tip": "The tip of the tongue taps lightly."}, {"ch": "د", "sound": "دَ", "word": "دلّة", "gloss": "coffee pot", "tip": "Tongue tip on the top gums, gently."}, {"ch": "ك", "sound": "كَ", "word": "كتاب", "gloss": "book", "tip": "Lift the back of the tongue for a light sound."}, {"ch": "ج", "sound": "جَ", "word": "جمل", "gloss": "camel", "tip": "The middle of the tongue touches the roof of the mouth."}, {"ch": "ح", "sound": "حَ", "word": "حصان", "gloss": "horse", "tip": "From the middle of the throat, with breath."}], "yes": "Yes! \"%W\" starts with %S.", "no": "Not this one. Try again."};
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
    out.g = souqDash(this, {"items": [["Box of dates", 12], ["Bag of coffee", 18], ["Bread", 2], ["Jar of honey", 35], ["Bottle of laban", 4], ["Bag of oranges", 6], ["Bag of cardamom", 25], ["Watermelon", 9]], "line": "%Q × %N (%P SAR each)", "sar": "%N SAR", "add": "Add %N SAR", "low": "Too little. Count again.", "high": "Too much. Count again.", "yes": "Right! %C SAR change. Next customer.", "result": "You served %N customers.", "result1": "You served 1 customer.", "best": "Best so far: %N"});
    out.lc = letterCatch(this, {"yes": "Yes! \"%W\" starts with %L.", "no": "Not this one. Try again."}, PH);
    out.ff = falconFlight(this, {"feathers": "Feathers left: %N", "yes": "Yes! On to the next dune.", "no": "Not quite. Try again.", "wind": "The wind changed. Here is a new sum.", "wonText": "Feathers left: %N of 3.", "lostText": "You flew %S of %G dunes."});
    var es = this.state.enroll;
    out.enrollMsg = { text: es === 'ok' ? "Thank you. Check your inbox for the first lesson." : es === 'bad' ? "Please enter a valid email address." : '', color: es === 'ok' ? '#0B6B3A' : '#B3261E' };
    out.enroll = function () {
      var el = document.getElementById('enroll-email');
      var v = el ? String(el.value).trim() : '';
      self.setState({ enroll: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'ok' : 'bad' });
    };
    return out;
  }
}

startPage(Component, { accent: '#0B6B3A' });
