/* Sadu site: the courses and lessons shown on learn.html.
   Every text is written twice: { en: 'English', ar: 'عربي' }.

   A course has: id, name, age, ages ([youngest, oldest], used to show the right courses for the
   child's age), color (strong), tint (light), tip (an activity for home, shown in the
   learning plan when the subject needs practice), icon (SVG path) and lessons.
   A lesson has: id, title, teach (the short explanation) and either
     questions: a fixed list, or
     make: a function that returns a fresh list each time (used for maths).
   A lesson may also have hint: a clue Saqr gives after a wrong answer (a question's own hint wins).
   A question has:
     q     the question text
     hint  optional clue for this question only
     kind  optional activity instead of three answers:
           'count'  drag n dates into the basket (needs n)
           'trace'  trace the letter or shape in show with a finger (outline: true traces a shape's edge)
           'match'  match pairs: pairs is a list of [left, right]
     say   optional word Saqr says out loud (phonics: "listen, then choose"); shown as text if the
           device has no voice
     show  optional big word, letter or sum shown under the question
     gloss optional meaning of "show", for readers of the other language
     seq   optional row of colours (for pattern questions)
     opts  three answers. The FIRST one is the right answer; they are shuffled on screen.
           An answer is a text, a { en, ar } pair, or a colour name from SADU_COLOURS. */
(function () {
  'use strict';

  window.SADU_COLOURS = {
    red: { hex: '#B3261E', en: 'red', ar: 'أحمر' },
    yellow: { hex: '#FFC93C', en: 'yellow', ar: 'أصفر' },
    blue: { hex: '#3FA9F5', en: 'blue', ar: 'أزرق' },
    green: { hex: '#0B6B3A', en: 'green', ar: 'أخضر' },
    orange: { hex: '#FF7A45', en: 'orange', ar: 'برتقالي' },
    purple: { hex: '#7B5CD6', en: 'purple', ar: 'بنفسجي' },
    navy: { hex: '#23204A', en: 'dark blue', ar: 'كحلي' },
    cream: { hex: '#F4E9D3', en: 'cream', ar: 'بيج' },
    pink: { hex: '#FF9EC4', en: 'pink', ar: 'وردي' },
    white: { hex: '#FFFFFF', en: 'white', ar: 'أبيض' },
    black: { hex: '#1B1A2E', en: 'black', ar: 'أسود' },
    grey: { hex: '#9A98A8', en: 'grey', ar: 'رمادي' }
  };

  function rand(n) { return Math.floor(Math.random() * n); }
  function c(name) { return { colour: name }; }

  // builds one maths question with two wrong answers close to the right one
  function sum(text, ans, hint) {
    var opts = [String(ans)];
    while (opts.length < 3) {
      var d = ans + [-10, -2, -1, 1, 2, 10][rand(6)];
      if (d >= 0 && opts.indexOf(String(d)) === -1) opts.push(String(d));
    }
    return { q: { en: 'What is the answer?', ar: 'ما الجواب؟' }, show: text, opts: opts, hint: hint };
  }
  function four(make) {
    return function () {
      var list = [], seen = {};
      while (list.length < 4) { var q = make(); if (!seen[q.show]) { seen[q.show] = true; list.push(q); } }
      return list;
    };
  }

  var WHICH_STARTS = { en: 'Which word starts with this letter?', ar: 'أي كلمة تبدأ بهذا الحرف؟' };
  var RHYMES = { en: 'Which word rhymes with this one?', ar: 'أي كلمة لها القافية نفسها؟' };
  var OPPOSITE = { en: 'What is the opposite of this word?', ar: 'ما عكس هذه الكلمة؟' };
  var WHICH_NUMBER = { en: 'Which number is this?', ar: 'أي عدد هذا؟' };
  var NEXT = { en: 'What comes next in the pattern?', ar: 'ما الذي يأتي بعد ذلك في النقشة؟' };
  var WHICH_SIGN = { en: 'Which sign goes in the gap?', ar: 'أي إشارة تضعها مكان علامة الاستفهام؟' };
  var MISSING = { en: 'Which number is missing?', ar: 'ما العدد الناقص؟' };
  var ENDS_WITH = { en: 'Which word ends with this letter?', ar: 'أي كلمة تنتهي بهذا الحرف؟' };
  var SAME_MIDDLE = { en: 'Which word has the same middle sound?', ar: 'أي كلمة فيها صوت الوسط نفسه؟' };
  var MANY = { en: 'Which word means more than one?', ar: 'أي كلمة تعني أكثر من واحد؟' };
  var TWO = { en: 'Which word means two of these?', ar: 'كيف نقول اثنين من هذا؟' };
  var SHAPE = { en: 'What is this shape called?', ar: 'ما اسم هذا الشكل؟' };

  // compares two numbers: the right sign comes first, the other two follow
  function compare() {
    var a = 10 + rand(90), b = rand(6) === 0 ? a : 10 + rand(90);
    var right = a > b ? '>' : a < b ? '<' : '=';
    var sameTens = Math.floor(a / 10) === Math.floor(b / 10);
    return { q: WHICH_SIGN, show: a + ' ? ' + b, opts: [right].concat(['>', '<', '='].filter(function (x) { return x !== right; })),
      hint: sameTens ? { en: 'The tens are the same, so look at the ones. The open side faces the bigger number.', ar: 'العشرات متساوية، فانظر إلى الآحاد. الجهة المفتوحة تتّجه نحو العدد الأكبر.' }
        : { en: 'Look at the tens first. The open side faces the number with more tens.', ar: 'انظر إلى العشرات أولًا. الجهة المفتوحة تتّجه نحو العدد الذي عشراته أكثر.' } };
  }
  // a sum with one number hidden
  function missing() {
    var a = 2 + rand(9), b = 1 + rand(9), t = a + b, kind = rand(3);
    var show = kind === 0 ? a + ' + ? = ' + t : kind === 1 ? '? + ' + b + ' = ' + t : t + ' − ? = ' + a;
    var from = kind === 1 ? b : a;
    var hint = kind === 2 ? { en: 'Count back from ' + t + ' to ' + a + '. How many steps?', ar: 'عُدّ من ' + t + ' نزولًا إلى ' + a + '. كم خطوة؟' }
      : { en: 'Count on from ' + from + ' to ' + t + '. How many steps?', ar: 'عُدّ من ' + from + ' إلى ' + t + '. كم خطوة؟' };
    var q = sum(show, kind === 1 ? a : b, hint);
    q.q = MISSING;
    return q;
  }

  var HEAR_FIRST = { en: 'Listen. Which sound does the word start with?', ar: 'استمع. بأي صوت تبدأ الكلمة؟' };
  var HEAR_LAST = { en: 'Listen. Which sound is at the end of the word?', ar: 'استمع. ما الصوت في آخر الكلمة؟' };
  var BLEND = { en: 'Say each sound, then blend them. Which picture is it?', ar: 'انطق كل صوت ثم اجمعها. أي صورة هي؟' };
  var HEAR_AR = { en: 'Listen. Which letter does the Arabic word start with?', ar: 'استمع. بأي حرف تبدأ الكلمة؟' };
  var BLEND_AR = { en: 'Join the Arabic letters into a word. Which picture is it?', ar: 'اجمع الحروف لتصنع كلمة. أي صورة هي؟' };
  var TRACE = { en: 'Trace the letter with your finger.', ar: 'مرّر إصبعك فوق الحرف.' };
  var TRACE_SHAPE = { en: 'Trace around the shape with your finger.', ar: 'مرّر إصبعك حول الشكل.' };
  var MATCH_WORDS = { en: 'Match each word to its picture.', ar: 'صِل كل كلمة بصورتها.' };
  var MATCH_HOME = { en: 'Match each animal to its home.', ar: 'صِل كل حيوان ببيته.' };
  var MATCH_FOOD = { en: 'Match each animal to its food.', ar: 'صِل كل حيوان بطعامه.' };
  function countDates() {
    var list = [], used = {};
    while (list.length < 4) {
      var n = 3 + rand(8);
      if (!used[n]) { used[n] = true; list.push({ kind: 'count', n: n, q: { en: 'Put ' + n + ' dates in the basket.', ar: 'ضع ' + n + ' تمرات في السلة.' } }); }
    }
    return list;
  }
  function hear(word, letters, q) { return { q: q || HEAR_FIRST, say: word, opts: letters }; }

  window.SADU_COURSES = [
    {
      id: 'phonics', name: { en: 'Phonics', ar: 'الأصوات والحروف' }, age: { en: 'Ages 3 to 7', ar: 'من 3 إلى 7 سنوات' }, ages: [3, 7],
      color: '#B9A8FF', tint: '#E4DDFF',
      tip: { en: 'Say letter sounds, not letter names: "sss" for s, "mmm" for m. On walks, ask: which sound does "palm" start with?', ar: 'انطق صوت الحرف لا اسمه: «سَ» لا «سين». وفي النزهة اسأل: بأي صوت تبدأ كلمة «نخلة»؟' },
      icon: 'M7 10a5 5 0 1 1 10 0c0 3.5-3.5 4-3.5 7a2.5 2.5 0 0 1-5 0M10 10a2 2 0 1 1 4 0',
      lessons: [
        { id: 'phonics-1', title: { en: 'First sounds: s a t p', ar: 'أول صوت: s a t p' },
          teach: { en: 'Letters make sounds. s says "sss" like a snake, a says "a" as in ant, t says "t" as in tent, and p says "p" as in palm. Listen to the start of a word to hear its first sound.', ar: 'لكل حرف إنجليزي صوت. s صوته «سْ» مثل صفير الأفعى، و a صوته «أَ» كما في ant، و t صوته «تْ» كما في tent، و p صوته «بْ» بنفخة كما في palm. استمع إلى بداية الكلمة لتسمع أول صوت فيها.' },
          hint: { en: 'Say the word slowly with Saqr. What sound do your lips and tongue make first?', ar: 'انطق الكلمة ببطء مع صقر. ما أول صوت تصنعه شفتاك ولسانك؟' },
          questions: [hear('sun', ['s', 't', 'p']), hear('ant', ['a', 's', 'p']), hear('tent', ['t', 'a', 's']), hear('palm', ['p', 't', 'a'])] },
        { id: 'phonics-2', title: { en: 'First sounds: i n m d', ar: 'أول صوت: i n m d' },
          teach: { en: 'i says "i" as in ink, n says "nnn" as in nest, m says "mmm" as in map, and d says "d" as in date. Hum m with your lips closed; for n, your tongue goes up behind your teeth.', ar: 'i صوته «إِ» كما في ink، و n صوته «نْ» كما في nest، و m صوته «مْ» كما في map، و d صوته «دْ» كما في date. نطلق m والشفتان مغلقتان، وفي n يرتفع اللسان خلف الأسنان.' },
          hint: { en: 'Is your mouth closed (m), is your tongue up (n or d), or are you smiling (i)?', ar: 'هل فمك مغلق (m)، أم لسانك مرفوع (n أو d)، أم أنت تبتسم (i)؟' },
          questions: [hear('ink', ['i', 'n', 'm']), hear('nest', ['n', 'm', 'd']), hear('map', ['m', 'n', 'i']), hear('date', ['d', 'i', 'm'])] },
        { id: 'phonics-3', title: { en: 'First sounds: g o c k', ar: 'أول صوت: g o c k' },
          teach: { en: 'g says "g" as in goat, o says "o" as in olive, and both c and k say "k", as in camel and kite. The back of your tongue lifts for g, c and k.', ar: 'g صوته «غْ» قريب من «گ» كما في goat، و o صوته «أُ» كما في olive، والحرفان c و k صوتهما «كْ» كما في camel و kite. يرتفع آخر اللسان مع g و c و k.' },
          hint: { en: 'Is your mouth round (o)? Does your voice buzz (g), or is it just air (c or k)?', ar: 'هل فمك مستدير (o)؟ هل يهتزّ صوتك (g)، أم يخرج هواء فقط (c أو k)؟' },
          questions: [hear('goat', ['g', 'o', 'k']), hear('olive', ['o', 'g', 'c']), hear('camel', ['c', 'o', 'g']), hear('kite', ['k', 'g', 'o'])] },
        { id: 'phonics-4', title: { en: 'Last sounds', ar: 'آخر صوت' },
          teach: { en: 'Words have a sound at the end too. Say cat slowly: c-a-t. The last sound is t. Stretch the word and listen to how it finishes.', ar: 'للكلمة صوت في آخرها أيضًا. انطق cat ببطء: c-a-t. آخر صوت هو t. مُدّ الكلمة واستمع إلى نهايتها.' },
          hint: { en: 'Say the word very slowly and stop on the last sound. What is your mouth doing?', ar: 'انطق الكلمة ببطء شديد وتوقّف عند آخر صوت. ماذا يفعل فمك؟' },
          questions: [hear('cat', ['t', 'c', 'a'], HEAR_LAST), hear('pen', ['n', 'p', 'd'], HEAR_LAST), hear('cup', ['p', 'c', 'm'], HEAR_LAST), hear('bus', ['s', 'b', 't'], HEAR_LAST)] },
        { id: 'phonics-5', title: { en: 'Blend and read', ar: 'اجمع الأصوات واقرأ' },
          teach: { en: 'To read a word, say each sound, then push the sounds together. c · a · t becomes cat! Say them faster and faster until you hear the word.', ar: 'لتقرأ كلمة، انطق كل صوت ثم اجمع الأصوات معًا. c · a · t تصير cat! انطقها أسرع فأسرع حتى تسمع الكلمة.' },
          hint: { en: 'Point to each letter and say its sound. Now say them again, faster.', ar: 'أشِر إلى كل حرف وانطق صوته. ثم انطقها مرة أخرى أسرع.' },
          questions: [
            { q: BLEND, show: 'c · a · t', opts: ['🐱', '🐶', '☀️'] },
            { q: BLEND, show: 's · u · n', opts: ['☀️', '🐟', '🐱'] },
            { q: BLEND, show: 'p · i · g', opts: ['🐷', '🐶', '🐟'] },
            { q: BLEND, show: 'd · o · g', opts: ['🐶', '🐷', '☀️'] }
          ] },
        { id: 'phonics-6', title: { en: 'Arabic sounds', ar: 'أصوات الحروف العربية' },
          teach: { en: 'Arabic letters make sounds too: ب says "ba", ت says "ta", ن says "na" and ر says "ra". Listen to the start of the Arabic word to find its first letter.', ar: 'لكل حرف صوت: الباء «بَ»، والتاء «تَ»، والنون «نَ»، والراء «رَ». استمع إلى بداية الكلمة لتعرف أول حرف فيها.' },
          hint: { en: 'Say the word slowly with Saqr and listen to the very first sound.', ar: 'انطق الكلمة ببطء مع صقر واستمع إلى أول صوت فيها.' },
          questions: [hear('بيت', ['ب', 'ت', 'ن'], HEAR_AR), hear('تمر', ['ت', 'ب', 'ر'], HEAR_AR), hear('نخلة', ['ن', 'ر', 'ب'], HEAR_AR), hear('رمل', ['ر', 'ن', 'ت'], HEAR_AR)] },
        { id: 'phonics-7', title: { en: 'Arabic blending', ar: 'تجميع الحروف' },
          teach: { en: 'Arabic letters join together to make a word. ق · م · ر join to make قمر (moon). Say each letter\'s sound, then say them together.', ar: 'تتّصل الحروف العربية لتصنع كلمة. ق · م · ر تتّصل فتصير «قمر». انطق صوت كل حرف، ثم انطقها معًا.' },
          hint: { en: 'Say the sound of each letter, then join them quickly.', ar: 'انطق صوت كل حرف، ثم صِلها بسرعة.' },
          questions: [
            { q: BLEND_AR, show: 'ق · م · ر', opts: ['🌙', '☀️', '🐟'] },
            { q: BLEND_AR, show: 'ش · م · س', opts: ['☀️', '🌙', '🏠'] },
            { q: BLEND_AR, show: 'س · م · ك', opts: ['🐟', '🏠', '🌙'] },
            { q: BLEND_AR, show: 'ب · ي · ت', opts: ['🏠', '🐟', '☀️'] }
          ] },
        { id: 'phonics-8', title: { en: 'First sounds: r h b f', ar: 'أول صوت: r h b f' },
          teach: { en: 'r says "rrr" as in rabbit, h says "h" like a little breath as in hat, b says "b" as in bus, and f says "fff" as in fish. For f, your top teeth touch your bottom lip.', ar: 'r صوته «رْ» كما في rabbit، و h صوته «هْ» كنفَس خفيف كما في hat، و b صوته «بْ» كما في bus، و f صوته «فْ» كما في fish. في f تلمس أسنانك العليا شفتك السفلى.' },
          hint: { en: 'Is it a breath (h), teeth on your lip (f), lips together (b), or a growl (r)?', ar: 'هل هو نفَس (h)، أم أسنان على الشفة (f)، أم شفتان مطبقتان (b)، أم صوت يتدحرج (r)؟' },
          questions: [hear('rabbit', ['r', 'h', 'b']), hear('hat', ['h', 'f', 'r']), hear('bus', ['b', 'r', 'f']), hear('fish', ['f', 'b', 'h'])] },
        { id: 'phonics-9', title: { en: 'Two letters, one sound', ar: 'حرفان وصوت واحد' },
          teach: { en: 'Some sounds are made by two letters together. sh says "shhh" as in ship, ch says "ch" as in chip, th puts your tongue between your teeth as in thumb, and ck says "k" at the end of duck.', ar: 'بعض الأصوات الإنجليزية يصنعها حرفان معًا. sh صوته «ش» كما في ship، و ch صوته «تش» كما في chip، وفي th يخرج اللسان بين الأسنان كما في thumb، و ck صوته «ك» في آخر duck.' },
          hint: { en: 'Is it a quiet "shhh", a sneezy "ch", or is your tongue between your teeth (th)?', ar: 'هل هو «ش» هادئ، أم «تش» كالعطسة، أم لسانك بين أسنانك (th)؟' },
          questions: [hear('ship', ['sh', 'ch', 'th']), hear('chip', ['ch', 'sh', 'th']), hear('thumb', ['th', 'sh', 'ch']), hear('duck', ['ck', 'sh', 'th'], HEAR_LAST)] },
        { id: 'phonics-10', title: { en: 'Arabic short vowels', ar: 'الحركات القصيرة' },
          teach: { en: 'Arabic has three short vowel marks. A fatha (a small line above) says "a": بَ is "ba". A kasra (a line below) says "i": بِ is "bi". A damma (a small و above) says "u": بُ is "bu".', ar: 'للحروف ثلاث حركات قصيرة: الفتحة (خط صغير فوق الحرف) تعطي صوت «ـَ» مثل بَ، والكسرة (خط تحت الحرف) تعطي صوت «ـِ» مثل بِ، والضمة (واو صغيرة فوق الحرف) تعطي صوت «ـُ» مثل بُ.' },
          hint: { en: 'Listen to the first sound: is your mouth open (fatha), smiling (kasra) or round (damma)?', ar: 'استمع إلى أول صوت: هل فمك مفتوح (فتحة)، أم مبتسم (كسرة)، أم مستدير (ضمة)؟' },
          questions: [hear('بَطّة', ['بَ', 'بِ', 'بُ']), hear('بِنت', ['بِ', 'بَ', 'بُ']), hear('بُرتقال', ['بُ', 'بَ', 'بِ']), hear('سُكّر', ['سُ', 'سَ', 'سِ'])] }
      ]
    },
    {
      id: 'math', name: { en: 'Maths', ar: 'الرياضيات' }, age: { en: 'Ages 6 to 10', ar: 'من 6 إلى 10 سنوات' }, ages: [6, 10],
      color: '#FFC93C', tint: '#FFE9A8',
      tip: { en: 'Count and share things at home: dates at snack time, steps on the stairs. Ask: how many more to make 10?', ar: 'عُدّوا الأشياء في البيت وتقاسموها: التمر وقت الوجبة، ودرجات السلّم. واسأل: كم نحتاج لنصل إلى 10؟' },
      icon: 'M6 4v6M3 7h6M15 7h6M4 15l5 5M9 15l-5 5M15 16h6M15 20h6',
      lessons: [
        { id: 'math-1', title: { en: 'Adding', ar: 'الجمع' },
          teach: { en: 'Adding means putting groups together. 3 dates and 2 dates make 5 dates. A quick way: start from the bigger number and count on.', ar: 'الجمع هو ضمّ مجموعتين معًا. 3 تمرات و2 تمرتان تساوي 5 تمرات. طريقة سريعة: ابدأ من العدد الأكبر ثم عُدّ للأمام.' },
          make: four(function () {
            var a = 2 + rand(11), b = 1 + rand(8), big = Math.max(a, b), small = Math.min(a, b);
            return sum(a + ' + ' + b, a + b, { en: 'Start at ' + big + ' and count on ' + small + ' more.', ar: 'ابدأ من ' + big + ' وعُدّ ' + small + ' للأمام.' });
          }) },
        { id: 'math-2', title: { en: 'Taking away', ar: 'الطرح' },
          teach: { en: 'Taking away means some are removed. 9 birds sit on a wall, 4 fly off, and 5 stay. A quick way: start from the first number and count back.', ar: 'الطرح هو أن نأخذ جزءًا من المجموعة. 9 طيور على الجدار، طار منها 4، فبقي 5. طريقة سريعة: ابدأ من العدد الأول ثم عُدّ للخلف.' },
          make: four(function () {
            var a = 6 + rand(15), b = 1 + rand(Math.min(9, a - 1));
            return sum(a + ' − ' + b, a - b, { en: 'Start at ' + a + ' and count back ' + b + '.', ar: 'ابدأ من ' + a + ' وعُدّ ' + b + ' للخلف.' });
          }) },
        { id: 'math-3', title: { en: 'Times 2, 5 and 10', ar: 'الضرب في 2 و5 و10' },
          teach: { en: 'Multiplying is adding the same number again and again. 3 × 5 means three fives: 5 + 5 + 5 = 15.', ar: 'الضرب هو جمع العدد نفسه عدة مرات. 3 × 5 تعني ثلاث خمسات: 5 + 5 + 5 = 15.' },
          make: four(function () {
            var a = 1 + rand(10), b = [2, 5, 10][rand(3)], rep = [];
            for (var i = 0; i < a; i++) rep.push(b);
            return sum(a + ' × ' + b, a * b, { en: 'Add ' + b + ', ' + a + (a === 1 ? ' time: ' : ' times: ') + rep.join(' + '), ar: 'اجمع: ' + rep.join(' + ') });
          }) },
        { id: 'math-4', title: { en: 'Bigger or smaller', ar: 'أكبر أم أصغر' },
          teach: { en: 'The sign > means "is bigger than" and < means "is smaller than". The open side always faces the bigger number, like a hungry mouth: 52 > 47. If both numbers are the same, use =. Look at the tens first, then the ones.', ar: 'الإشارة > تعني «أكبر من»، والإشارة < تعني «أصغر من». الجهة المفتوحة تتّجه دائمًا نحو العدد الأكبر، كأنها فمٌ جائع: 52 > 47. وإذا كان العددان متساويين نضع =. انظر إلى العشرات أولًا، ثم إلى الآحاد.' },
          make: four(compare) },
        { id: 'math-5', title: { en: 'The missing number', ar: 'العدد الناقص' },
          teach: { en: 'Sometimes a number is hidden. In 7 + ? = 12, ask: what do I add to 7 to make 12? Count on from 7: 8, 9, 10, 11, 12. That is 5 steps, so the missing number is 5.', ar: 'أحيانًا يختبئ عدد. في 7 + ? = 12 اسأل نفسك: كم أضيف إلى 7 لأحصل على 12؟ عُدّ من 7: 8، 9، 10، 11، 12. هذه 5 خطوات، فالعدد الناقص هو 5.' },
          make: four(missing) },
        { id: 'math-6', title: { en: 'Count the dates', ar: 'عُدّ التمر' },
          teach: { en: 'Counting means saying one number for each thing. Touch each date as you count it: 1, 2, 3… The last number you say tells you how many there are.', ar: 'العدّ أن نقول عددًا واحدًا لكل شيء. المس كل تمرة وأنت تعدّها: 1، 2، 3… وآخر عدد تقوله يخبرك كم تمرة عندك.' },
          make: countDates }
      ]
    },
    {
      id: 'science', name: { en: 'Science', ar: 'العلوم' }, age: { en: 'Ages 6 to 10', ar: 'من 6 إلى 10 سنوات' }, ages: [6, 10],
      color: '#2ED3A6', tint: '#B9F3E2',
      tip: { en: 'Ask why questions together: why does ice melt, why do we see the Moon at night? Let your child guess first.', ar: 'اطرحا معًا أسئلة «لماذا»: لماذا يذوب الثلج؟ لماذا نرى القمر ليلًا؟ دع طفلك يخمّن أولًا.' },
      icon: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9',
      lessons: [
        { id: 'science-1', title: { en: 'What plants need', ar: 'ماذا يحتاج النبات؟' },
          teach: { en: 'A plant is alive. To grow, it needs water, sunlight and air. Its roots drink water from the soil, and its leaves catch the sunlight.', ar: 'النبات كائن حي. لكي ينمو يحتاج إلى الماء وضوء الشمس والهواء. جذوره تشرب الماء من التربة، وأوراقه تلتقط ضوء الشمس.' },
          hint: { en: 'Think about where each part is. The roots are under the soil.', ar: 'فكّر أين يوجد كل جزء من النبات. الجذور تحت التربة.' },
          questions: [
            { q: { en: 'Which part of a plant takes in water from the soil?', ar: 'أي جزء من النبات يمتصّ الماء من التربة؟' }, opts: [{ en: 'the roots', ar: 'الجذور' }, { en: 'the flowers', ar: 'الأزهار' }, { en: 'the fruit', ar: 'الثمار' }] },
            { q: { en: 'What do the leaves catch?', ar: 'ماذا تلتقط الأوراق؟' }, opts: [{ en: 'sunlight', ar: 'ضوء الشمس' }, { en: 'sand', ar: 'الرمل' }, { en: 'stones', ar: 'الحجارة' }] },
            { q: { en: 'You plant a date seed. What does it need to start growing?', ar: 'زرعتَ نواة تمر. ماذا تحتاج لتبدأ في النمو؟' }, opts: [{ en: 'water', ar: 'الماء' }, { en: 'salt', ar: 'الملح' }, { en: 'paint', ar: 'الألوان' }] },
            { q: { en: 'Which of these is alive?', ar: 'أي من هذه كائن حي؟' }, opts: [{ en: 'a palm tree', ar: 'النخلة' }, { en: 'a stone', ar: 'الحجر' }, { en: 'a cup', ar: 'الكوب' }] }
          ] },
        { id: 'science-2', title: { en: 'Desert animals', ar: 'حيوانات الصحراء' },
          teach: { en: 'The desert is hot and dry, so its animals have clever bodies. A camel stores fat in its hump and can go many days without drinking. Many small animals rest in the shade by day and come out at night, when it is cooler.', ar: 'الصحراء حارّة وجافّة، ولذلك لحيواناتها أجسام تساعدها. الجمل يخزّن الدهن في سنامه ويستطيع البقاء أيامًا كثيرة بلا شرب. وكثير من الحيوانات الصغيرة تستريح في الظل نهارًا وتخرج ليلًا حين يبرد الجو.' },
          hint: { en: 'Think about the hot, dry desert. What helps an animal stay cool and safe?', ar: 'فكّر في الصحراء الحارّة الجافّة. ما الذي يساعد الحيوان على البقاء باردًا وآمنًا؟' },
          questions: [
            { q: { en: 'What does a camel store in its hump?', ar: 'ماذا يخزّن الجمل في سنامه؟' }, opts: [{ en: 'fat', ar: 'الدهن' }, { en: 'water', ar: 'الماء' }, { en: 'sand', ar: 'الرمل' }] },
            { q: { en: 'Why do many desert animals come out at night?', ar: 'لماذا تخرج حيوانات صحراوية كثيرة في الليل؟' }, opts: [{ en: 'It is cooler', ar: 'لأن الجو أبرد' }, { en: 'It is brighter', ar: 'لأن الضوء أقوى' }, { en: 'It rains more', ar: 'لأن المطر أكثر' }] },
            { q: { en: 'What helps a camel walk on soft sand?', ar: 'ما الذي يساعد الجمل على المشي فوق الرمل الناعم؟' }, opts: [{ en: 'wide feet', ar: 'أقدامه العريضة' }, { en: 'a long tail', ar: 'ذيله الطويل' }, { en: 'small ears', ar: 'أذناه الصغيرتان' }] },
            { q: { en: 'A camel has long eyelashes. What do they keep out?', ar: 'للجمل رموش طويلة. ممَّ تحمي عينيه؟' }, opts: [{ en: 'sand', ar: 'الرمل' }, { en: 'sound', ar: 'الصوت' }, { en: 'smells', ar: 'الروائح' }] }
          ] },
        { id: 'science-3', title: { en: 'Day, night and the Moon', ar: 'الليل والنهار والقمر' },
          teach: { en: 'The Earth spins like a top. The side facing the Sun has day, and the other side has night. The Moon does not make its own light: it shines because sunlight bounces off it. Its shape seems to change through the month.', ar: 'الأرض تدور حول نفسها. الجهة المقابلة للشمس يكون فيها نهار، والجهة الأخرى يكون فيها ليل. القمر لا يصنع ضوءًا، بل يلمع لأن ضوء الشمس ينعكس عنه. ويبدو شكله متغيّرًا خلال الشهر.' },
          hint: { en: 'Remember: the Earth spins, and the Moon shines with light from the Sun.', ar: 'تذكّر: الأرض تدور حول نفسها، والقمر يلمع بضوء الشمس.' },
          questions: [
            { q: { en: 'Why do we have day and night?', ar: 'لماذا يتعاقب الليل والنهار؟' }, opts: [{ en: 'The Earth spins', ar: 'لأن الأرض تدور حول نفسها' }, { en: 'The Sun switches off', ar: 'لأن الشمس تنطفئ' }, { en: 'The Moon covers the Sun', ar: 'لأن القمر يغطّي الشمس' }] },
            { q: { en: 'Where does the Moon\'s light come from?', ar: 'من أين يأتي ضوء القمر؟' }, opts: [{ en: 'the Sun', ar: 'من الشمس' }, { en: 'the stars', ar: 'من النجوم' }, { en: 'inside the Moon', ar: 'من داخل القمر' }] },
            { q: { en: 'How long does the Moon take to go through all its shapes?', ar: 'كم يحتاج القمر ليمرّ بكل أشكاله؟' }, opts: [{ en: 'about a month', ar: 'شهرًا تقريبًا' }, { en: 'about a day', ar: 'يومًا تقريبًا' }, { en: 'about a year', ar: 'سنة تقريبًا' }] },
            { q: { en: 'It is day where you are. What is it on the opposite side of the Earth?', ar: 'الوقت عندك نهار. ما الوقت في الجهة المقابلة من الأرض؟' }, opts: [{ en: 'night', ar: 'ليل' }, { en: 'day as well', ar: 'نهار أيضًا' }, { en: 'always summer', ar: 'صيف دائمًا' }] }
          ] },
        { id: 'science-4', title: { en: 'Ice, water and steam', ar: 'الجليد والماء والبخار' },
          teach: { en: 'Water can be solid, liquid or gas. Cold water freezes into hard ice. Warm ice melts back into water. Very hot water boils and turns into steam. On a sunny day, puddles slowly disappear because the water evaporates into the air.', ar: 'الماء يكون صلبًا أو سائلًا أو غازًا. الماء البارد جدًّا يتجمّد فيصير جليدًا صلبًا. والجليد يذوب في الدفء فيعود ماءً. والماء الساخن جدًّا يغلي ويتحوّل إلى بخار. وفي يوم مشمس تختفي البِرَك ببطء لأن الماء يتبخّر في الهواء.' },
          hint: { en: 'Cold makes water hard like ice. Heat melts ice and turns water into steam.', ar: 'البرودة تجعل الماء صلبًا كالجليد. والحرارة تذيب الجليد وتحوّل الماء إلى بخار.' },
          questions: [
            { q: { en: 'You leave an ice cube in the sun. What happens?', ar: 'تركتَ مكعّب ثلج في الشمس. ماذا يحدث؟' }, opts: [{ en: 'It melts', ar: 'يذوب' }, { en: 'It grows', ar: 'يكبر' }, { en: 'It turns to sand', ar: 'يصير رملًا' }] },
            { q: { en: 'What comes out of a kettle of boiling water?', ar: 'ماذا يخرج من إبريق ماء يغلي؟' }, opts: [{ en: 'steam', ar: 'البخار' }, { en: 'ice', ar: 'الجليد' }, { en: 'sand', ar: 'الرمل' }] },
            { q: { en: 'You put water in the freezer. What does it become?', ar: 'وضعتَ ماءً في الفريزر. إلامَ يتحوّل؟' }, opts: [{ en: 'ice', ar: 'جليد' }, { en: 'steam', ar: 'بخار' }, { en: 'juice', ar: 'عصير' }] },
            { q: { en: 'Wet clothes dry in the sun. Where does the water go?', ar: 'الملابس المبلّلة تجفّ في الشمس. أين يذهب الماء؟' }, opts: [{ en: 'into the air', ar: 'إلى الهواء' }, { en: 'into the clothes', ar: 'إلى داخل الملابس' }, { en: 'into the Sun', ar: 'إلى الشمس' }] }
          ] },
        { id: 'science-5', title: { en: 'Our five senses', ar: 'الحواس الخمس' },
          teach: { en: 'We learn about the world with five senses. We see with our eyes, hear with our ears, smell with our nose, taste with our tongue and feel with our skin.', ar: 'نتعرّف إلى العالم بخمس حواس: نرى بالعينين، ونسمع بالأذنين، ونشمّ بالأنف، ونتذوّق باللسان، ونلمس بالجلد.' },
          hint: { en: 'Point to the part of your body you would use.', ar: 'أشِر إلى جزء جسمك الذي تستخدمه.' },
          questions: [
            { q: { en: 'Which part of your body smells the coffee?', ar: 'أي جزء من جسمك يشمّ رائحة القهوة؟' }, opts: [{ en: 'the nose', ar: 'الأنف' }, { en: 'the ears', ar: 'الأذنان' }, { en: 'the hands', ar: 'اليدان' }] },
            { q: { en: 'You hear the call to prayer. Which sense is that?', ar: 'تسمع الأذان. ما الحاسّة التي تستخدمها؟' }, opts: [{ en: 'hearing', ar: 'السمع' }, { en: 'taste', ar: 'التذوّق' }, { en: 'smell', ar: 'الشمّ' }] },
            { q: { en: 'A date tastes sweet. What tells you that?', ar: 'التمرة طعمها حلو. ما الذي يخبرك بذلك؟' }, opts: [{ en: 'the tongue', ar: 'اللسان' }, { en: 'the eyes', ar: 'العينان' }, { en: 'the hair', ar: 'الشعر' }] },
            { q: { en: 'The sand feels hot under your feet. Which sense is that?', ar: 'تشعر بحرارة الرمل تحت قدميك. ما هذه الحاسّة؟' }, opts: [{ en: 'touch', ar: 'اللمس' }, { en: 'sight', ar: 'البصر' }, { en: 'hearing', ar: 'السمع' }] }
          ] },
        { id: 'science-6', title: { en: 'Animal match', ar: 'مطابقة الحيوانات' },
          teach: { en: 'Every animal has a home and food that suit it. Camels live in the desert, fish live in the sea and bees live in a hive. Cows eat grass and bees drink from flowers.', ar: 'لكل حيوان بيت وطعام يناسبانه. الجِمال تعيش في الصحراء، والسمك في البحر، والنحل في الخلية. والبقرة تأكل العشب، والنحلة تمتصّ رحيق الأزهار.' },
          hint: { en: 'Think: where would this animal be happy? What would it like to eat?', ar: 'فكّر: أين يكون هذا الحيوان سعيدًا؟ وماذا يحبّ أن يأكل؟' },
          questions: [
            { kind: 'match', q: MATCH_HOME, pairs: [['🐪', { en: 'desert', ar: 'الصحراء' }], ['🐟', { en: 'sea', ar: 'البحر' }], ['🐦', { en: 'nest', ar: 'العش' }]] },
            { kind: 'match', q: MATCH_HOME, pairs: [['🐝', { en: 'hive', ar: 'الخلية' }], ['🐄', { en: 'farm', ar: 'المزرعة' }], ['🐜', { en: 'anthill', ar: 'بيت النمل' }]] },
            { kind: 'match', q: MATCH_FOOD, pairs: [['🐄', { en: 'grass', ar: 'العشب' }], ['🐝', { en: 'flowers', ar: 'الأزهار' }], ['🐒', { en: 'bananas', ar: 'الموز' }]] },
            { kind: 'match', q: MATCH_FOOD, pairs: [['🐪', { en: 'dry plants', ar: 'النباتات الجافّة' }], ['🐱', { en: 'fish', ar: 'السمك' }], ['🐰', { en: 'carrots', ar: 'الجزر' }]] }
          ] }
      ]
    },
    {
      id: 'english', name: { en: 'English', ar: 'اللغة الإنجليزية' }, age: { en: 'Ages 5 to 9', ar: 'من 5 إلى 9 سنوات' }, ages: [5, 9],
      color: '#3FA9F5', tint: '#C4E4FC',
      tip: { en: 'Play I spy with first sounds: I spy something starting with s. Read a short English picture book together.', ar: 'العبا لعبة «أرى شيئًا يبدأ بصوت s». واقرآ معًا قصة إنجليزية قصيرة مصوّرة.' },
      icon: 'M4 5h16v11H10l-5 4v-4H4zM8 9h8M8 12h5',
      lessons: [
        { id: 'english-1', title: { en: 'First sounds', ar: 'أول صوت في الكلمة' },
          teach: { en: 'Every word starts with a sound. Say the word slowly and listen to the very first sound: sss-un starts with s.', ar: 'كل كلمة إنجليزية تبدأ بصوت. انطق الكلمة ببطء واستمع إلى أول صوت: كلمة sun تبدأ بحرف s.' },
          hint: { en: 'Say each word slowly. Which one starts with the same sound as the letter?', ar: 'انطق كل كلمة ببطء. أيّها تبدأ بصوت الحرف نفسه؟' },
          questions: [
            { q: WHICH_STARTS, show: 's', opts: ['sun', 'map', 'tent'] },
            { q: WHICH_STARTS, show: 'm', opts: ['map', 'pin', 'dog'] },
            { q: WHICH_STARTS, show: 't', opts: ['tent', 'ant', 'nest'] },
            { q: WHICH_STARTS, show: 'p', opts: ['pin', 'sun', 'goat'] }
          ] },
        { id: 'english-2', title: { en: 'Rhyming words', ar: 'كلمات على القافية نفسها' },
          teach: { en: 'Rhyming words sound the same at the end. Cat and hat rhyme. Sun and run rhyme.', ar: 'بعض الكلمات الإنجليزية تنتهي بالصوت نفسه. مثل cat و hat، ومثل sun و run.' },
          hint: { en: 'Say both words out loud. Do they end with the same sound?', ar: 'انطق الكلمتين بصوت عالٍ. هل تنتهيان بالصوت نفسه؟' },
          questions: [
            { q: RHYMES, show: 'cat', opts: ['hat', 'dog', 'cup'] },
            { q: RHYMES, show: 'sun', opts: ['run', 'sit', 'map'] },
            { q: RHYMES, show: 'bed', opts: ['red', 'bag', 'big'] },
            { q: RHYMES, show: 'pin', opts: ['tin', 'pot', 'pen'] }
          ] },
        { id: 'english-3', title: { en: 'Opposites', ar: 'الكلمة وعكسها' },
          teach: { en: 'Opposites are words that mean completely different things, like big and small, or day and night.', ar: 'لكل كلمة عكس، مثل big (كبير) و small (صغير)، ومثل day (نهار) و night (ليل).' },
          hint: { en: 'The opposite is the word that means something very different.', ar: 'العكس هو الكلمة التي معناها مختلف تمامًا.' },
          questions: [
            { q: OPPOSITE, show: 'hot', gloss: { en: '', ar: 'حارّ' }, opts: ['cold', 'fast', 'tall'] },
            { q: OPPOSITE, show: 'up', gloss: { en: '', ar: 'فوق' }, opts: ['down', 'soft', 'wet'] },
            { q: OPPOSITE, show: 'open', gloss: { en: '', ar: 'مفتوح' }, opts: ['shut', 'happy', 'new'] },
            { q: OPPOSITE, show: 'day', gloss: { en: '', ar: 'نهار' }, opts: ['night', 'sun', 'week'] }
          ] },
        { id: 'english-4', title: { en: 'One and many', ar: 'المفرد والجمع' },
          teach: { en: 'For more than one, we usually add s: one cat, two cats. Words that end in s, x, sh or ch add es: one box, two boxes.', ar: 'في الإنجليزية نضيف غالبًا حرف s لنقول أكثر من واحد: cat (قطة) تصير cats (قطط). والكلمات التي تنتهي بـ s أو x أو sh أو ch نضيف لها es: box (صندوق) تصير boxes.' },
          hint: { en: 'Most words just add s. Words that end in s or x add es.', ar: 'معظم الكلمات نضيف لها s فقط. والكلمات التي تنتهي بـ s أو x نضيف لها es.' },
          questions: [
            { q: MANY, show: 'cat', gloss: { en: '', ar: 'قطة' }, opts: ['cats', 'cates', 'catz'] },
            { q: MANY, show: 'dog', gloss: { en: '', ar: 'كلب' }, opts: ['dogs', 'doges', 'dogss'] },
            { q: MANY, show: 'box', gloss: { en: '', ar: 'صندوق' }, opts: ['boxes', 'boxs', 'boxies'] },
            { q: MANY, show: 'bus', gloss: { en: '', ar: 'حافلة' }, opts: ['buses', 'buss', 'busis'] }
          ] },
        { id: 'english-5', title: { en: 'Middle sounds', ar: 'الصوت في وسط الكلمة' },
          teach: { en: 'Short words like cat have a sound in the middle: c-a-t. Say the word slowly and listen to the middle. Cat and bag both have the a sound in the middle.', ar: 'الكلمات القصيرة مثل cat لها صوت في الوسط: c-a-t. انطق الكلمة ببطء واستمع إلى وسطها. كلمتا cat و bag فيهما صوت a نفسه في الوسط.' },
          hint: { en: 'Say the word slowly, sound by sound: c-a-t. Listen to the middle sound.', ar: 'انطق الكلمة ببطء صوتًا صوتًا: c-a-t. واستمع إلى الصوت في الوسط.' },
          questions: [
            { q: SAME_MIDDLE, show: 'cat', opts: ['bag', 'pin', 'dog'] },
            { q: SAME_MIDDLE, show: 'pin', opts: ['sit', 'cup', 'hat'] },
            { q: SAME_MIDDLE, show: 'dog', opts: ['hot', 'bed', 'run'] },
            { q: SAME_MIDDLE, show: 'sun', opts: ['cup', 'ten', 'fig'] }
          ] },
        { id: 'english-6', title: { en: 'Words and pictures', ar: 'كلمات وصور' },
          teach: { en: 'Read each word and find its picture. Tap a word, then tap the picture that goes with it.', ar: 'اقرأ كل كلمة إنجليزية وابحث عن صورتها. اضغط على الكلمة، ثم على الصورة المناسبة لها.' },
          hint: { en: 'Say the word out loud, sound by sound, and think of what it looks like.', ar: 'انطق الكلمة بصوت عالٍ، صوتًا صوتًا، وفكّر كيف يبدو شكلها.' },
          questions: [
            { kind: 'match', q: MATCH_WORDS, pairs: [['cat', '🐱'], ['dog', '🐶'], ['fish', '🐟']] },
            { kind: 'match', q: MATCH_WORDS, pairs: [['sun', '☀️'], ['moon', '🌙'], ['star', '⭐']] },
            { kind: 'match', q: MATCH_WORDS, pairs: [['apple', '🍎'], ['banana', '🍌'], ['grapes', '🍇']] },
            { kind: 'match', q: MATCH_WORDS, pairs: [['car', '🚗'], ['boat', '⛵'], ['plane', '✈️']] }
          ] }
      ]
    },
    {
      id: 'arabic', name: { en: 'Arabic', ar: 'اللغة العربية' }, age: { en: 'Ages 3 to 8', ar: 'من 3 إلى 8 سنوات' }, ages: [3, 8],
      color: '#FF6FA8', tint: '#FFD0E2',
      tip: { en: 'Point to letters on signs and packets, and ask for a word that starts or ends with the same letter.', ar: 'أشِر إلى الحروف على اللافتات والعلب، واطلب كلمة تبدأ أو تنتهي بالحرف نفسه.' },
      icon: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M9 8h6',
      lessons: [
        { id: 'arabic-1', title: { en: 'First letter', ar: 'أول حرف في الكلمة' },
          teach: { en: 'Every Arabic word starts with a letter. The word بيت (house) starts with the letter ب. Say the word and listen to the first sound.', ar: 'كل كلمة تبدأ بحرف. كلمة «بيت» تبدأ بحرف الباء. انطق الكلمة واستمع إلى أول صوت فيها.' },
          hint: { en: 'Say each word slowly and listen to its first sound.', ar: 'انطق كل كلمة ببطء واستمع إلى أول صوت فيها.' },
          questions: [
            { q: WHICH_STARTS, show: 'ب', opts: ['بيت', 'تمر', 'سمكة'] },
            { q: WHICH_STARTS, show: 'م', opts: ['ماء', 'نخلة', 'كتاب'] },
            { q: WHICH_STARTS, show: 'ج', opts: ['جمل', 'رمل', 'دلّة'] },
            { q: WHICH_STARTS, show: 'ك', opts: ['كتاب', 'حصان', 'بيت'] }
          ] },
        { id: 'arabic-2', title: { en: 'Opposites', ar: 'الكلمة وعكسها' },
          teach: { en: 'Many words have an opposite. The opposite of كبير (big) is صغير (small), and the opposite of ليل (night) is نهار (day).', ar: 'لكل كلمة عكس. عكس «كبير» هو «صغير»، وعكس «ليل» هو «نهار».' },
          hint: { en: 'The opposite is the word that means something very different.', ar: 'العكس هو الكلمة التي معناها مختلف تمامًا.' },
          questions: [
            { q: OPPOSITE, show: 'كبير', gloss: { en: 'big', ar: '' }, opts: ['صغير', 'سريع', 'جميل'] },
            { q: OPPOSITE, show: 'حارّ', gloss: { en: 'hot', ar: '' }, opts: ['بارد', 'طويل', 'جديد'] },
            { q: OPPOSITE, show: 'فوق', gloss: { en: 'above', ar: '' }, opts: ['تحت', 'أمام', 'داخل'] },
            { q: OPPOSITE, show: 'ليل', gloss: { en: 'night', ar: '' }, opts: ['نهار', 'قمر', 'نجم'] }
          ] },
        { id: 'arabic-3', title: { en: 'Numbers in words', ar: 'الأعداد بالكلمات' },
          teach: { en: 'Counting in Arabic: واحد 1, اثنان 2, ثلاثة 3, أربعة 4, خمسة 5, ستة 6, سبعة 7, ثمانية 8, تسعة 9, عشرة 10.', ar: 'نعدّ هكذا: واحد 1، اثنان 2، ثلاثة 3، أربعة 4، خمسة 5، ستة 6، سبعة 7، ثمانية 8، تسعة 9، عشرة 10.' },
          hint: { en: 'Count on your fingers: one, two, three, four, five…', ar: 'عُدّ على أصابعك: واحد، اثنان، ثلاثة، أربعة، خمسة…' },
          questions: [
            { q: WHICH_NUMBER, show: 'خمسة', opts: ['5', '3', '7'] },
            { q: WHICH_NUMBER, show: 'ثلاثة', opts: ['3', '8', '6'] },
            { q: WHICH_NUMBER, show: 'سبعة', opts: ['7', '4', '9'] },
            { q: WHICH_NUMBER, show: 'عشرة', opts: ['10', '2', '6'] }
          ] },
        { id: 'arabic-4', title: { en: 'Last letter', ar: 'آخر حرف في الكلمة' },
          teach: { en: 'Every word ends with a letter too. The word قمر (moon) ends with the letter ر. Say the word slowly and listen to the very last sound.', ar: 'كل كلمة تنتهي بحرف أيضًا. كلمة «قمر» تنتهي بحرف الراء. انطق الكلمة ببطء واستمع إلى آخر صوت فيها.' },
          hint: { en: 'Say each word slowly and listen to its last sound.', ar: 'انطق كل كلمة ببطء واستمع إلى آخر صوت فيها.' },
          questions: [
            { q: ENDS_WITH, show: 'ر', opts: ['قمر', 'بيت', 'شمس'] },
            { q: ENDS_WITH, show: 'ب', opts: ['كلب', 'قلم', 'ورد'] },
            { q: ENDS_WITH, show: 'ل', opts: ['جمل', 'كتاب', 'بحر'] },
            { q: ENDS_WITH, show: 'م', opts: ['قلم', 'سمك', 'باب'] }
          ] },
        { id: 'arabic-5', title: { en: 'One and two', ar: 'المفرد والمثنّى' },
          teach: { en: 'To say two of something in Arabic, add ان to the end of the word: قلم (pen) becomes قلمان (two pens). More than two is a different word: أقلام (pens).', ar: 'لنقول اثنين من شيء نضيف «ان» إلى آخر الكلمة: «قلم» تصير «قلمان». وإذا كانت أكثر من اثنين نستعمل الجمع: «أقلام».' },
          hint: { en: 'Two of something ends with ان.', ar: 'المثنّى ينتهي بـ «ان».' },
          questions: [
            { q: TWO, show: 'قلم', gloss: { en: 'pen', ar: '' }, opts: ['قلمان', 'أقلام', 'قلمي'] },
            { q: TWO, show: 'بيت', gloss: { en: 'house', ar: '' }, opts: ['بيتان', 'بيوت', 'بيتي'] },
            { q: TWO, show: 'ولد', gloss: { en: 'boy', ar: '' }, opts: ['ولدان', 'أولاد', 'ولدي'] },
            { q: TWO, show: 'جمل', gloss: { en: 'camel', ar: '' }, opts: ['جملان', 'جِمال', 'جملي'] }
          ] },
        { id: 'arabic-6', title: { en: 'Write the letters', ar: 'اكتب الحروف' },
          teach: { en: 'Use your finger (or the mouse) to go over the grey letter. Start at the top and follow its whole shape slowly. Do not forget the dots!', ar: 'مرّر إصبعك (أو الفأرة) فوق الحرف الرمادي. ابدأ من الأعلى واتبع شكله كله ببطء، ولا تنسَ النقاط!' },
          hint: { en: 'Go slowly over all of the grey letter, from one end to the other.', ar: 'مرّ ببطء فوق الحرف الرمادي كله، من أوله إلى آخره.' },
          questions: [{ kind: 'trace', q: TRACE, show: 'ب' }, { kind: 'trace', q: TRACE, show: 'ج' }, { kind: 'trace', q: TRACE, show: 'م' }, { kind: 'trace', q: TRACE, show: 'ك' }] }
      ]
    },
    {
      id: 'art', name: { en: 'Art', ar: 'الفنون' }, age: { en: 'Ages 3 to 10', ar: 'من 3 إلى 10 سنوات' }, ages: [3, 10],
      color: '#FF7A45', tint: '#FFD3C0',
      tip: { en: 'Mix paints or food colouring together, and look for repeating patterns on rugs, tiles and clothes.', ar: 'امزجا الألوان أو ألوان الطعام، وابحثا عن النقوش المتكرّرة في السجاد والبلاط والملابس.' },
      icon: 'M20 4l-9 9M14 4l6 6M11 13c-3 0-4 2-4 4s-2 3-3 3c4 1 9 0 9-5',
      lessons: [
        { id: 'art-1', title: { en: 'Mixing colours', ar: 'مزج الألوان' },
          teach: { en: 'Red, yellow and blue are the primary colours. Mix two of them and you get a new colour: red and yellow make orange, yellow and blue make green, blue and red make purple.', ar: 'الأحمر والأصفر والأزرق هي الألوان الأساسية. إذا مزجنا لونين منها حصلنا على لون جديد: الأحمر مع الأصفر يعطي البرتقالي، والأصفر مع الأزرق يعطي الأخضر، والأزرق مع الأحمر يعطي البنفسجي.' },
          hint: { en: 'Red and yellow make orange. Yellow and blue make green. Blue and red make purple.', ar: 'الأحمر مع الأصفر برتقالي، والأصفر مع الأزرق أخضر، والأزرق مع الأحمر بنفسجي.' },
          questions: [
            { q: { en: 'What do red and yellow make?', ar: 'ماذا ينتج من مزج الأحمر والأصفر؟' }, seq: ['red', 'yellow'], opts: [c('orange'), c('green'), c('purple')] },
            { q: { en: 'What do yellow and blue make?', ar: 'ماذا ينتج من مزج الأصفر والأزرق؟' }, seq: ['yellow', 'blue'], opts: [c('green'), c('orange'), c('purple')] },
            { q: { en: 'What do blue and red make?', ar: 'ماذا ينتج من مزج الأزرق والأحمر؟' }, seq: ['blue', 'red'], opts: [c('purple'), c('green'), c('orange')] },
            { q: { en: 'Which of these is a primary colour?', ar: 'أي من هذه لون أساسي؟' }, opts: [c('blue'), c('green'), c('orange')] }
          ] },
        { id: 'art-2', title: { en: 'Warm and cool colours', ar: 'الألوان الحارّة والباردة' },
          teach: { en: 'Warm colours remind us of the sun and fire: red, orange and yellow. Cool colours remind us of water and plants: blue, green and purple.', ar: 'الألوان الحارّة تذكّرنا بالشمس والنار: الأحمر والبرتقالي والأصفر. والألوان الباردة تذكّرنا بالماء والنبات: الأزرق والأخضر والبنفسجي.' },
          hint: { en: 'Warm colours look like fire and the sun. Cool colours look like water and leaves.', ar: 'الألوان الحارّة تشبه النار والشمس، والألوان الباردة تشبه الماء والأوراق.' },
          questions: [
            { q: { en: 'Which is a warm colour?', ar: 'أي من هذه لون حارّ؟' }, opts: [c('red'), c('blue'), c('green')] },
            { q: { en: 'Which is a cool colour?', ar: 'أي من هذه لون بارد؟' }, opts: [c('blue'), c('orange'), c('yellow')] },
            { q: { en: 'Which colour suits a hot desert sun?', ar: 'أي لون يناسب شمس الصحراء الحارّة؟' }, opts: [c('orange'), c('blue'), c('green')] },
            { q: { en: 'Which colour feels like cool water?', ar: 'أي لون يذكّرنا بالماء البارد؟' }, opts: [c('blue'), c('red'), c('orange')] }
          ] },
        { id: 'art-3', title: { en: 'Patterns', ar: 'النقوش المتكرّرة' },
          teach: { en: 'A pattern repeats in the same order. Sadu weaving uses repeating stripes and triangles. Find the part that repeats and you know what comes next.', ar: 'النقشة تتكرّر بالترتيب نفسه. في نسيج السدو خطوط ومثلثات متكرّرة. ابحث عن الجزء الذي يتكرّر لتعرف ما الذي يأتي بعده.' },
          hint: { en: 'Say the colours out loud. Which part repeats?', ar: 'قل أسماء الألوان بصوت عالٍ. أي جزء يتكرّر؟' },
          questions: [
            { q: NEXT, seq: ['red', 'green', 'red', 'green'], opts: [c('red'), c('green'), c('yellow')] },
            { q: NEXT, seq: ['yellow', 'yellow', 'blue', 'yellow', 'yellow'], opts: [c('blue'), c('yellow'), c('red')] },
            { q: NEXT, seq: ['red', 'cream', 'navy', 'red', 'cream'], opts: [c('navy'), c('red'), c('cream')] },
            { q: NEXT, seq: ['green', 'yellow', 'green', 'yellow', 'green'], opts: [c('yellow'), c('green'), c('red')] }
          ] },
        { id: 'art-4', title: { en: 'Shapes in Sadu', ar: 'الأشكال في السدو' },
          teach: { en: 'Sadu weavers build their patterns from simple shapes. A triangle has 3 sides, a square has 4 equal sides, a diamond is a square standing on one corner, and a circle is round with no corners.', ar: 'تصنع النسّاجات نقوش السدو من أشكال بسيطة. المثلث له 3 أضلاع، والمربع له 4 أضلاع متساوية، والمعيّن مربّع يقف على أحد رؤوسه، والدائرة مستديرة بلا زوايا.' },
          hint: { en: 'Count the sides and the corners of the shape.', ar: 'عُدّ أضلاع الشكل وزواياه.' },
          questions: [
            { q: SHAPE, show: '▲', opts: [{ en: 'triangle', ar: 'مثلث' }, { en: 'square', ar: 'مربع' }, { en: 'circle', ar: 'دائرة' }] },
            { q: SHAPE, show: '◆', opts: [{ en: 'diamond', ar: 'معيّن' }, { en: 'circle', ar: 'دائرة' }, { en: 'triangle', ar: 'مثلث' }] },
            { q: { en: 'How many sides does a square have?', ar: 'كم ضلعًا للمربع؟' }, show: '■', opts: ['4', '3', '5'] },
            { q: { en: 'Which shape has no corners?', ar: 'أي شكل ليس له زوايا؟' }, opts: [{ en: 'circle', ar: 'الدائرة' }, { en: 'square', ar: 'المربع' }, { en: 'triangle', ar: 'المثلث' }] }
          ] },
        { id: 'art-5', title: { en: 'Light and dark', ar: 'الفاتح والغامق' },
          teach: { en: 'Add white to a colour and it gets lighter: red and white make pink. Add black and it gets darker. Black and white mixed together make grey.', ar: 'إذا أضفنا الأبيض إلى لون صار أفتح: الأحمر مع الأبيض يعطي الوردي. وإذا أضفنا الأسود صار اللون أغمق. والأسود مع الأبيض يعطيان الرمادي.' },
          hint: { en: 'White makes a colour lighter. Black makes it darker.', ar: 'الأبيض يجعل اللون أفتح، والأسود يجعله أغمق.' },
          questions: [
            { q: { en: 'What do red and white make?', ar: 'ماذا ينتج من مزج الأحمر والأبيض؟' }, seq: ['red', 'white'], opts: [c('pink'), c('purple'), c('orange')] },
            { q: { en: 'What do black and white make?', ar: 'ماذا ينتج من مزج الأسود والأبيض؟' }, seq: ['black', 'white'], opts: [c('grey'), c('yellow'), c('blue')] },
            { q: { en: 'Which colour is the darkest?', ar: 'أي لون هو الأغمق؟' }, opts: [c('navy'), c('yellow'), c('cream')] },
            { q: { en: 'Which colour is the lightest?', ar: 'أي لون هو الأفتح؟' }, opts: [c('cream'), c('navy'), c('green')] }
          ] },
        { id: 'art-6', title: { en: 'Draw the shapes', ar: 'ارسم الأشكال' },
          teach: { en: 'Go around the grey shape with your finger. A triangle has three straight sides, a square has four, and a circle goes round and round.', ar: 'مرّر إصبعك حول الشكل الرمادي. للمثلث ثلاثة أضلاع مستقيمة، وللمربع أربعة، والدائرة تدور حول نفسها.' },
          hint: { en: 'Follow the grey line all the way round until you get back to the start.', ar: 'اتبع الخط الرمادي حتى آخره، إلى أن تعود إلى البداية.' },
          questions: [{ kind: 'trace', q: TRACE_SHAPE, show: '▲', outline: true }, { kind: 'trace', q: TRACE_SHAPE, show: '■', outline: true }, { kind: 'trace', q: TRACE_SHAPE, show: '●', outline: true }, { kind: 'trace', q: TRACE_SHAPE, show: '◆', outline: true }] }
      ]
    }
  ];
})();
