/* Sadu site: the courses and lessons shown on learn.html.
   Every text is written twice: { en: 'English', ar: 'عربي' }.

   A course has: id, name, age, ages ([youngest, oldest], used to show the right courses for the
   child's age), color (strong), tint (light), tip (an activity for home, shown in the
   learning plan when the subject needs practice), icon (SVG path), stickers (one won per finished
   lesson, in lesson order) and lessons.
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
  // difficulty for lessons that make their own questions: 0 easier, 1 normal, 2 harder (set by learn.js from the child's last try)
  function hard(easy, normal, harder) { var d = window.SADU_DIFF; return d === 0 ? easy : d === 2 ? harder : normal; }
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
    var lo = hard(1, 10, 100), span = hard(20, 90, 900), a = lo + rand(span), b = rand(6) === 0 ? a : lo + rand(span);
    var right = a > b ? '>' : a < b ? '<' : '=';
    var sameTens = Math.floor(a / 10) === Math.floor(b / 10);
    return { q: WHICH_SIGN, show: a + ' ? ' + b, opts: [right].concat(['>', '<', '='].filter(function (x) { return x !== right; })),
      hint: sameTens ? { en: 'The tens are the same, so look at the ones. The open side faces the bigger number.', ar: 'العشرات متساوية، فانظر إلى الآحاد. الجهة المفتوحة تتّجه نحو العدد الأكبر.' }
        : { en: 'Look at the tens first. The open side faces the number with more tens.', ar: 'انظر إلى العشرات أولًا. الجهة المفتوحة تتّجه نحو العدد الذي عشراته أكثر.' } };
  }
  // a sum with one number hidden
  function missing() {
    var a = 2 + rand(hard(5, 9, 18)), b = 1 + rand(hard(5, 9, 18)), t = a + b, kind = rand(3);
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
  var HEAR_LONG = { en: 'Listen. Which long sound is in the word?', ar: 'استمع. أي صوت طويل في الكلمة؟' };
  var HEAR_SOUND = { en: 'Listen. Which sound do you hear?', ar: 'استمع. أي صوت تسمع؟' };
  var DOTS = { en: 'How many dots does this letter have?', ar: 'كم نقطة لهذا الحرف؟' };
  var HEAR_RHYME = { en: 'Listen. Which word rhymes with it?', ar: 'استمع. أي كلمة على قافيتها؟' };
  var HEAR_COUNT = { en: 'Listen. How many sounds are in the word?', ar: 'استمع. كم صوتًا في الكلمة؟' };
  var HEAR_WHICH = { en: 'Listen. Which word did you hear?', ar: 'استمع. أي كلمة سمعت؟' };
  var SHADDA = { en: 'Which letter has the shadda (ّ)?', ar: 'أي حرف عليه الشدّة؟' };
  var LETTERS = { en: 'How many letters are in this word?', ar: 'كم حرفًا في هذه الكلمة؟' };
  function hear(word, letters, q) { return { q: q || HEAR_FIRST, say: word, opts: letters }; }

  window.SADU_COURSES = [
    {
      id: 'phonics', stickers: ['🦜', '🐝', '🐸', '🦉', '🐱', '🐇', '🚢', '🪁', '🌕', '🥁', '🦊', '🌧️', '🎩', '👆', '👀'], name: { en: 'English Phonics', ar: 'الأصوات الإنجليزية' }, age: { en: 'Ages 3 to 7', ar: 'من 3 إلى 7 سنوات' }, ages: [3, 7],
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
        { id: 'phonics-8', title: { en: 'First sounds: r h b f', ar: 'أول صوت: r h b f' },
          teach: { en: 'r says "rrr" as in rabbit, h says "h" like a little breath as in hat, b says "b" as in bus, and f says "fff" as in fish. For f, your top teeth touch your bottom lip.', ar: 'r صوته «رْ» كما في rabbit، و h صوته «هْ» كنفَس خفيف كما في hat، و b صوته «بْ» كما في bus، و f صوته «فْ» كما في fish. في f تلمس أسنانك العليا شفتك السفلى.' },
          hint: { en: 'Is it a breath (h), teeth on your lip (f), lips together (b), or a growl (r)?', ar: 'هل هو نفَس (h)، أم أسنان على الشفة (f)، أم شفتان مطبقتان (b)، أم صوت يتدحرج (r)؟' },
          questions: [hear('rabbit', ['r', 'h', 'b']), hear('hat', ['h', 'f', 'r']), hear('bus', ['b', 'r', 'f']), hear('fish', ['f', 'b', 'h'])] },
        { id: 'phonics-9', title: { en: 'Two letters, one sound', ar: 'حرفان وصوت واحد' },
          teach: { en: 'Some sounds are made by two letters together. sh says "shhh" as in ship, ch says "ch" as in chip, th puts your tongue between your teeth as in thumb, and ck says "k" at the end of duck.', ar: 'بعض الأصوات الإنجليزية يصنعها حرفان معًا. sh صوته «ش» كما في ship، و ch صوته «تش» كما في chip، وفي th يخرج اللسان بين الأسنان كما في thumb، و ck صوته «ك» في آخر duck.' },
          hint: { en: 'Is it a quiet "shhh", a sneezy "ch", or is your tongue between your teeth (th)?', ar: 'هل هو «ش» هادئ، أم «تش» كالعطسة، أم لسانك بين أسنانك (th)؟' },
          questions: [hear('ship', ['sh', 'ch', 'th']), hear('chip', ['ch', 'sh', 'th']), hear('thumb', ['th', 'sh', 'ch']), hear('duck', ['ck', 'sh', 'th'], HEAR_LAST)] },
        { id: 'phonics-11', title: { en: 'First sounds: l w y j', ar: 'أول صوت: l w y j' },
          teach: { en: 'l says "lll" as in lemon, w says "w" as in web, y says "y" as in yo-yo, and j says "j" as in jam.', ar: 'l صوته «لْ» كما في lemon، و w صوته «وْ» كما في web، و y صوته «يْ» كما في yo-yo، و j صوته «جْ» كما في jam.' },
          hint: { en: 'Is your tongue up (l), are your lips round (w), or are you smiling (y)?', ar: 'هل لسانك مرفوع (l)، أم شفتاك مستديرتان (w)، أم أنت تبتسم (y)؟' },
          questions: [hear('lemon', ['l', 'w', 'j']), hear('web', ['w', 'y', 'l']), hear('yo-yo', ['y', 'j', 'w']), hear('jam', ['j', 'l', 'y'])] },
        { id: 'phonics-12', title: { en: 'Long sounds: ee and oo', ar: 'أصوات طويلة: ee و oo' },
          teach: { en: 'Two letters can make one long sound. ee says "eee" as in bee and tree. oo says "ooo" as in moon and zoo.', ar: 'قد يصنع حرفان صوتًا طويلًا واحدًا: ee صوته «إيـ» طويل كما في bee و tree، و oo صوته «أو» طويل كما في moon و zoo.' },
          hint: { en: 'Do you smile (ee) or make a round mouth (oo)?', ar: 'هل تبتسم (ee) أم تجعل فمك مستديرًا (oo)؟' },
          questions: [hear('bee', ['ee', 'oo', 'sh'], HEAR_LONG), hear('moon', ['oo', 'ee', 'ch'], HEAR_LONG), hear('tree', ['ee', 'oo', 'th'], HEAR_LONG), hear('zoo', ['oo', 'ee', 'sh'], HEAR_LONG)] },
        { id: 'phonics-13', title: { en: 'Blend four sounds', ar: 'اجمع أربعة أصوات' },
          teach: { en: 'Longer words have four sounds. Say each one, then push them together: f · r · o · g becomes frog!', ar: 'الكلمات الأطول فيها أربعة أصوات. انطق كل صوت ثم اجمعها: f · r · o · g تصير frog!' },
          hint: { en: 'Point to each letter and say its sound, then say them faster.', ar: 'أشِر إلى كل حرف وانطق صوته، ثم انطقها أسرع.' },
          questions: [{ q: BLEND, show: 'f · r · o · g', opts: ['🐸', '🦀', '🥁'] }, { q: BLEND, show: 'c · r · a · b', opts: ['🦀', '🐸', '🚩'] }, { q: BLEND, show: 'd · r · u · m', opts: ['🥁', '🚩', '🦀'] }, { q: BLEND, show: 'f · l · a · g', opts: ['🚩', '🥁', '🐸'] }] },
        { id: 'phonics-21', title: { en: 'Sounds: v z qu x', ar: 'أصوات: v z qu x' },
          teach: { en: 'v says "vvv" as in van, z says "zzz" like a bee in zip, qu says "kw" as in queen, and x says "ks" at the end of fox.', ar: 'v صوته «فْ» مهتزّ كما في van، و z صوته «زْ» كما في zip، و qu صوته «كو» كما في queen، و x صوته «كس» في آخر fox.' },
          hint: { en: 'Does it buzz (z), vibrate on your lip (v), or sound like "kw" (qu)?', ar: 'هل يطنّ (z)، أم يهتزّ على الشفة (v)، أم يشبه «كو» (qu)؟' },
          questions: [hear('van', ['v', 'z', 'qu']), hear('zip', ['z', 'v', 'x']), hear('queen', ['qu', 'v', 'z']), hear('fox', ['x', 'v', 'z'], HEAR_LAST)] },
        { id: 'phonics-22', title: { en: 'Long sounds: ai oa igh ar', ar: 'أصوات طويلة: ai oa igh ar' },
          teach: { en: 'More letter teams: ai says "ay" as in rain, oa says "oh" as in boat, igh says "eye" as in night, and ar says "ar" as in car.', ar: 'فرق حروف أخرى: ai صوته «اي» كما في rain، و oa صوته «أو» كما في boat، و igh صوته «آي» كما في night، و ar صوته «آر» كما في car.' },
          hint: { en: 'Say the word slowly and listen to the long sound in the middle.', ar: 'انطق الكلمة ببطء واستمع إلى الصوت الطويل في وسطها.' },
          questions: [hear('rain', ['ai', 'oa', 'igh'], HEAR_LONG), hear('boat', ['oa', 'ai', 'ar'], HEAR_LONG), hear('night', ['igh', 'ai', 'oa'], HEAR_LONG), hear('car', ['ar', 'oa', 'igh'], HEAR_LONG)] },
        { id: 'phonics-23', title: { en: 'Listen and rhyme', ar: 'استمع والقافية' },
          teach: { en: 'Listen to the word Saqr says, then find the word that ends with the same sound. Cat rhymes with hat.', ar: 'استمع إلى الكلمة التي يقولها صقر، ثم ابحث عن الكلمة التي تنتهي بالصوت نفسه. cat على قافية hat.' },
          hint: { en: 'Say both words out loud. Do they end the same?', ar: 'انطق الكلمتين بصوت عالٍ. هل تنتهيان بالصوت نفسه؟' },
          questions: [hear('cat', ['hat', 'dog', 'sun'], HEAR_RHYME), hear('pig', ['wig', 'pot', 'pen'], HEAR_RHYME), hear('bun', ['sun', 'bat', 'bed'], HEAR_RHYME), hear('ten', ['hen', 'tin', 'top'], HEAR_RHYME)] },
        { id: 'phonics-24', title: { en: 'Count the sounds', ar: 'عُدّ الأصوات' },
          teach: { en: 'Words are made of sounds. Cat has three sounds: c-a-t. Ship has three too: sh-i-p, because sh is one sound. Tap one finger for each sound.', ar: 'الكلمات مكوّنة من أصوات. cat فيها ثلاثة أصوات: c-a-t. و ship فيها ثلاثة أيضًا: sh-i-p، لأن sh صوت واحد. انقر بإصبع لكل صوت.' },
          hint: { en: 'Tap a finger for each sound as you say the word.', ar: 'انقر بإصبع لكل صوت وأنت تنطق الكلمة.' },
          questions: [hear('cat', ['3', '2', '4'], HEAR_COUNT), hear('ship', ['3', '4', '2'], HEAR_COUNT), hear('frog', ['4', '3', '5'], HEAR_COUNT), hear('up', ['2', '3', '1'], HEAR_COUNT)] },
        { id: 'phonics-25', title: { en: 'Tricky words', ar: 'كلمات خادعة' },
          teach: { en: 'Some words do not follow the sound rules, so we learn them by sight: the, was, said, they. Look at them carefully!', ar: 'بعض الكلمات الإنجليزية لا تتبع قواعد الأصوات، فنحفظ شكلها: the و was و said و they. انظر إليها جيدًا!' },
          hint: { en: 'Look at the first and last letters of each word.', ar: 'انظر إلى أول حرف وآخر حرف في كل كلمة.' },
          questions: [hear('the', ['the', 'he', 'to'], HEAR_WHICH), hear('was', ['was', 'saw', 'we'], HEAR_WHICH), hear('said', ['said', 'sad', 'sea'], HEAR_WHICH), hear('they', ['they', 'the', 'then'], HEAR_WHICH)] }
      ]
    },
    {
      id: 'arabic-phonics', stickers: ['🏠', '🍊', '🌙', '🔍', '☀️', '⛺', '🔑', '🎵', '🦅', '🐘', '✈️', '🦒', '✨', '🔢', '📖'], name: { en: 'Arabic Phonics', ar: 'الأصوات العربية' },
      age: { en: 'Ages 3 to 7', ar: 'من 3 إلى 7 سنوات' }, ages: [3, 7],
      color: '#F6A04D', tint: '#FFE3C4',
      tip: { en: 'Say each letter with its vowel sound: بَ is "ba", بِ is "bi", بُ is "bu". Point to letters on signs and packets and ask which sound they make.', ar: 'انطق كل حرف مع حركته: بَ، بِ، بُ. وأشِر إلى الحروف على اللافتات والعلب واسأل عن صوتها.' },
      icon: 'M4 5h16v11H10l-5 4v-4H4zM9 10h.01M12 10h.01M15 10h.01',
      lessons: [
        { id: 'phonics-6', title: { en: 'Arabic sounds', ar: 'أصوات الحروف العربية' },
          teach: { en: 'Arabic letters make sounds too: ب says "ba", ت says "ta", ن says "na" and ر says "ra". Listen to the start of the Arabic word to find its first letter.', ar: 'لكل حرف صوت: الباء «بَ»، والتاء «تَ»، والنون «نَ»، والراء «رَ». استمع إلى بداية الكلمة لتعرف أول حرف فيها.' },
          hint: { en: 'Say the word slowly with Saqr and listen to the very first sound.', ar: 'انطق الكلمة ببطء مع صقر واستمع إلى أول صوت فيها.' },
          questions: [hear('بيت', ['ب', 'ت', 'ن'], HEAR_AR), hear('تمر', ['ت', 'ب', 'ر'], HEAR_AR), hear('نخلة', ['ن', 'ر', 'ب'], HEAR_AR), hear('رمل', ['ر', 'ن', 'ت'], HEAR_AR)] },
        { id: 'phonics-10', title: { en: 'Arabic short vowels', ar: 'الحركات القصيرة' },
          teach: { en: 'Arabic has three short vowel marks. A fatha (a small line above) says "a": بَ is "ba". A kasra (a line below) says "i": بِ is "bi". A damma (a small و above) says "u": بُ is "bu".', ar: 'للحروف ثلاث حركات قصيرة: الفتحة (خط صغير فوق الحرف) تعطي صوت «ـَ» مثل بَ، والكسرة (خط تحت الحرف) تعطي صوت «ـِ» مثل بِ، والضمة (واو صغيرة فوق الحرف) تعطي صوت «ـُ» مثل بُ.' },
          hint: { en: 'Listen to the first sound: is your mouth open (fatha), smiling (kasra) or round (damma)?', ar: 'استمع إلى أول صوت: هل فمك مفتوح (فتحة)، أم مبتسم (كسرة)، أم مستدير (ضمة)؟' },
          questions: [hear('بَطّة', ['بَ', 'بِ', 'بُ']), hear('بِنت', ['بِ', 'بَ', 'بُ']), hear('بُرتقال', ['بُ', 'بَ', 'بِ']), hear('سُكّر', ['سُ', 'سَ', 'سِ'])] },
        { id: 'phonics-7', title: { en: 'Arabic blending', ar: 'تجميع الحروف' },
          teach: { en: 'Arabic letters join together to make a word. ق · م · ر join to make قمر (moon). Say each letter\'s sound, then say them together.', ar: 'تتّصل الحروف العربية لتصنع كلمة. ق · م · ر تتّصل فتصير «قمر». انطق صوت كل حرف، ثم انطقها معًا.' },
          hint: { en: 'Say the sound of each letter, then join them quickly.', ar: 'انطق صوت كل حرف، ثم صِلها بسرعة.' },
          questions: [
            { q: BLEND_AR, show: 'ق · م · ر', opts: ['🌙', '☀️', '🐟'] },
            { q: BLEND_AR, show: 'ش · م · س', opts: ['☀️', '🌙', '🏠'] },
            { q: BLEND_AR, show: 'س · م · ك', opts: ['🐟', '🏠', '🌙'] },
            { q: BLEND_AR, show: 'ب · ي · ت', opts: ['🏠', '🐟', '☀️'] }
          ] },
        { id: 'phonics-14', title: { en: 'Letters with dots', ar: 'الحروف والنقاط' },
          teach: { en: 'Some Arabic letters have the same shape and differ only by their dots: ب has one dot below, ت has two dots above, and ث has three dots above.', ar: 'بعض الحروف لها الشكل نفسه وتختلف بالنقاط فقط: الباء نقطة واحدة تحتها، والتاء نقطتان فوقها، والثاء ثلاث نقاط فوقها.' },
          hint: { en: 'Count the dots carefully, above and below.', ar: 'عُدّ النقاط جيدًا، فوق الحرف وتحته.' },
          questions: [{ q: DOTS, show: 'ب', opts: ['1', '2', '3'] }, { q: DOTS, show: 'ت', opts: ['2', '1', '3'] }, { q: DOTS, show: 'ث', opts: ['3', '2', '1'] }, { q: DOTS, show: 'ن', opts: ['1', '3', '2'] }] },
        { id: 'phonics-15', title: { en: 'Sounds: س ش ص', ar: 'أصوات: س ش ص' },
          teach: { en: 'س is a light hiss as in سمكة, ش is "sh" as in شمس, and ص is a heavy, deep "s" as in صقر.', ar: 'السين صفير خفيف كما في «سمكة»، والشين كما في «شمس»، والصاد صوت ثقيل عميق كما في «صقر».' },
          hint: { en: 'Is it a light hiss (س), a "shh" (ش) or a deep, heavy sound (ص)?', ar: 'هل هو صفير خفيف (س)، أم «ش» (ش)، أم صوت ثقيل عميق (ص)؟' },
          questions: [hear('سمكة', ['س', 'ش', 'ص'], HEAR_AR), hear('شمس', ['ش', 'س', 'ص'], HEAR_AR), hear('صقر', ['ص', 'س', 'ش'], HEAR_AR), hear('سيارة', ['س', 'ص', 'ش'], HEAR_AR)] },
        { id: 'phonics-16', title: { en: 'Sounds: ح خ ع', ar: 'أصوات: ح خ ع' },
          teach: { en: 'These sounds come from the throat. ح is a soft breath as in حصان, خ is a rough sound as in خيمة, and ع is deep in the throat as in عين.', ar: 'هذه الأصوات تخرج من الحلق: الحاء نفَس ناعم كما في «حصان»، والخاء صوت خشن كما في «خيمة»، والعين من عمق الحلق كما في «عين».' },
          hint: { en: 'Is it a soft breath (ح), a rough sound (خ) or deep in the throat (ع)?', ar: 'هل هو نفَس ناعم (ح)، أم صوت خشن (خ)، أم من عمق الحلق (ع)؟' },
          questions: [hear('حصان', ['ح', 'خ', 'ع'], HEAR_AR), hear('خيمة', ['خ', 'ح', 'ع'], HEAR_AR), hear('عين', ['ع', 'ح', 'خ'], HEAR_AR), hear('خروف', ['خ', 'ع', 'ح'], HEAR_AR)] },
        { id: 'phonics-17', title: { en: 'ق or ك?', ar: 'ق أم ك؟' },
          teach: { en: 'ق comes from the very back of the mouth, deep and strong, as in قمر. ك is lighter and further forward, as in كلب.', ar: 'القاف تخرج من أقصى الفم، قوية وعميقة، كما في «قمر». والكاف أخفّ وأقرب إلى الأمام، كما في «كلب».' },
          hint: { en: 'Is the sound deep at the back (ق) or lighter (ك)?', ar: 'هل الصوت عميق في الخلف (ق) أم أخفّ (ك)؟' },
          questions: [hear('قمر', ['ق', 'ك', 'غ'], HEAR_AR), hear('كلب', ['ك', 'ق', 'غ'], HEAR_AR), hear('قلم', ['ق', 'غ', 'ك'], HEAR_AR), hear('كتاب', ['ك', 'غ', 'ق'], HEAR_AR)] },
        { id: 'phonics-18', title: { en: 'Long vowels: ا و ي', ar: 'المدود: ا و ي' },
          teach: { en: 'Long vowels stretch a sound. ا makes a long "aa": با. و makes a long "oo": بو. ي makes a long "ee": بي.', ar: 'حروف المدّ تُطيل الصوت: الألف تمدّ الفتحة «با»، والواو تمدّ الضمة «بو»، والياء تمدّ الكسرة «بي».' },
          hint: { en: 'Listen to the long sound: "aa" (ا), "oo" (و) or "ee" (ي)?', ar: 'استمع إلى الصوت الطويل: «آ» (ا)، أم «أو» (و)، أم «إي» (ي)؟' },
          questions: [hear('با', ['با', 'بو', 'بي'], HEAR_SOUND), hear('بو', ['بو', 'با', 'بي'], HEAR_SOUND), hear('بي', ['بي', 'بو', 'با'], HEAR_SOUND), hear('سا', ['سا', 'سي', 'سو'], HEAR_SOUND)] },
        { id: 'phonics-19', title: { en: 'Arabic last sounds', ar: 'آخر صوت في الكلمة' },
          teach: { en: 'Listen to how an Arabic word ends. قمر ends with ر, and باب ends with ب.', ar: 'استمع إلى نهاية الكلمة: «قمر» تنتهي بالراء، و«باب» تنتهي بالباء.' },
          hint: { en: 'Say the word slowly and stop on the last sound.', ar: 'انطق الكلمة ببطء وتوقّف عند آخر صوت.' },
          questions: [hear('قمر', ['ر', 'ق', 'م'], HEAR_LAST), hear('باب', ['ب', 'ا', 'ت'], HEAR_LAST), hear('جمل', ['ل', 'ج', 'م'], HEAR_LAST), hear('سمك', ['ك', 'س', 'م'], HEAR_LAST)] },
        { id: 'phonics-20', title: { en: 'More Arabic blending', ar: 'تجميع حروف أكثر' },
          teach: { en: 'Join the letters to read new words: ف · ي · ل makes فيل (elephant) and ب · ا · ب makes باب (door).', ar: 'صِل الحروف لتقرأ كلمات جديدة: ف · ي · ل تصير «فيل»، و ب · ا · ب تصير «باب».' },
          hint: { en: 'Say each letter with its sound, then join them quickly.', ar: 'انطق كل حرف بصوته، ثم صِلها بسرعة.' },
          questions: [{ q: BLEND_AR, show: 'ف · ي · ل', opts: ['🐘', '🚪', '🌹'] }, { q: BLEND_AR, show: 'ب · ا · ب', opts: ['🚪', '🐘', '🐝'] }, { q: BLEND_AR, show: 'و · ر · د', opts: ['🌹', '🐝', '🚪'] }, { q: BLEND_AR, show: 'ن · ح · ل', opts: ['🐝', '🌹', '🐘'] }] },
        { id: 'phonics-26', title: { en: 'Sounds: ط or ت', ar: 'ط أم ت؟' },
          teach: { en: 'ط is a heavy, strong "t" as in طائرة. ت is a light "t" as in تفاحة.', ar: 'الطاء صوت ثقيل قوي كما في «طائرة»، والتاء صوت خفيف كما في «تفاحة».' },
          hint: { en: 'Is the sound heavy (ط) or light (ت)?', ar: 'هل الصوت ثقيل (ط) أم خفيف (ت)؟' },
          questions: [hear('طائرة', ['ط', 'ت', 'د'], HEAR_AR), hear('تفاحة', ['ت', 'ط', 'د'], HEAR_AR), hear('طاولة', ['ط', 'د', 'ت'], HEAR_AR), hear('تمر', ['ت', 'د', 'ط'], HEAR_AR)] },
        { id: 'phonics-27', title: { en: 'Sounds: ذ ز ظ', ar: 'أصوات: ذ ز ظ' },
          teach: { en: 'ذ is soft, with the tongue between the teeth, as in ذهب. ز buzzes like a bee, as in زرافة. ظ is like ذ but heavy, as in ظرف.', ar: 'الذال ناعمة ويخرج اللسان بين الأسنان كما في «ذهب»، والزاي تطنّ مثل النحلة كما في «زرافة»، والظاء مثل الذال لكنها ثقيلة كما في «ظرف».' },
          hint: { en: 'Is your tongue between your teeth (ذ or ظ), or do you buzz (ز)?', ar: 'هل لسانك بين أسنانك (ذ أو ظ)، أم تطنّ (ز)؟' },
          questions: [hear('ذهب', ['ذ', 'ز', 'ظ'], HEAR_AR), hear('زرافة', ['ز', 'ذ', 'ظ'], HEAR_AR), hear('ظرف', ['ظ', 'ذ', 'ز'], HEAR_AR), hear('زيتون', ['ز', 'ظ', 'ذ'], HEAR_AR)] },
        { id: 'phonics-28', title: { en: 'The shadda (ّ)', ar: 'الشدّة' },
          teach: { en: 'The shadda (ّ) is a small mark that doubles a letter: in دلّة the ل is said twice, دَلْلَة.', ar: 'الشدّة (ّ) علامة صغيرة تضاعف الحرف: في «دلّة» ننطق اللام مرتين «دَلْلَة».' },
          hint: { en: 'Look for the small "w" shape above a letter.', ar: 'ابحث عن العلامة الصغيرة التي تشبه حرف w فوق الحرف.' },
          questions: [{ q: SHADDA, show: 'دلّة', opts: ['ل', 'د', 'ة'] }, { q: SHADDA, show: 'سكّر', opts: ['ك', 'س', 'ر'] }, { q: SHADDA, show: 'قطّة', opts: ['ط', 'ق', 'ة'] }, { q: SHADDA, show: 'أمّ', opts: ['م', 'أ', 'ب'] }] },
        { id: 'phonics-29', title: { en: 'Count the letters', ar: 'عُدّ الحروف' },
          teach: { en: 'Arabic letters join together, but each one still counts. شمس has three letters: ش م س. كتاب has four: ك ت ا ب.', ar: 'الحروف العربية تتّصل، لكن كل حرف يُعدّ وحده. «شمس» فيها ثلاثة حروف: ش م س. و«كتاب» فيها أربعة: ك ت ا ب.' },
          hint: { en: 'Point to each letter as you count, including ا and ة.', ar: 'أشِر إلى كل حرف وأنت تعدّ، ومعها الألف والتاء المربوطة.' },
          questions: [{ q: LETTERS, show: 'شمس', opts: ['3', '4', '2'] }, { q: LETTERS, show: 'كتاب', opts: ['4', '3', '5'] }, { q: LETTERS, show: 'نخلة', opts: ['4', '3', '5'] }, { q: LETTERS, show: 'أسد', opts: ['3', '2', '4'] }] },
        { id: 'phonics-30', title: { en: 'Read short words', ar: 'اقرأ كلمات قصيرة' },
          teach: { en: 'Listen to the word Saqr says, then find it. Look at the first letter to help you: باب starts with ب.', ar: 'استمع إلى الكلمة التي يقولها صقر، ثم ابحث عنها. انظر إلى أول حرف ليساعدك: «باب» تبدأ بالباء.' },
          hint: { en: 'Which word starts with the first sound you heard?', ar: 'أي كلمة تبدأ بأول صوت سمعته؟' },
          questions: [hear('باب', ['باب', 'نار', 'قمر'], HEAR_WHICH), hear('شمس', ['شمس', 'قمر', 'بحر'], HEAR_WHICH), hear('وردة', ['وردة', 'سمكة', 'نخلة'], HEAR_WHICH), hear('جمل', ['جمل', 'فيل', 'أسد'], HEAR_WHICH)] }
      ]
    },
    {
      id: 'math', stickers: ['🧮', '🔢', '🎯', '⚖️', '🧩', '👯', '🔟', '🍀', '🍰', '🦘', '🍕', '🔷', '🕒', '🛒', '🧺'], name: { en: 'Maths', ar: 'الرياضيات' }, age: { en: 'Ages 6 to 10', ar: 'من 6 إلى 10 سنوات' }, ages: [6, 10],
      color: '#FFC93C', tint: '#FFE9A8',
      tip: { en: 'Count and share things at home: dates at snack time, steps on the stairs. Ask: how many more to make 10?', ar: 'عُدّوا الأشياء في البيت وتقاسموها: التمر وقت الوجبة، ودرجات السلّم. واسأل: كم نحتاج لنصل إلى 10؟' },
      icon: 'M6 4v6M3 7h6M15 7h6M4 15l5 5M9 15l-5 5M15 16h6M15 20h6',
      lessons: [
        { id: 'math-1', title: { en: 'Adding', ar: 'الجمع' },
          teach: { en: 'Adding means putting groups together. 3 dates and 2 dates make 5 dates. A quick way: start from the bigger number and count on.', ar: 'الجمع هو ضمّ مجموعتين معًا. 3 تمرات و2 تمرتان تساوي 5 تمرات. طريقة سريعة: ابدأ من العدد الأكبر ثم عُدّ للأمام.' },
          make: four(function () {
            var a = 2 + rand(hard(6, 11, 25)), b = 1 + rand(hard(5, 8, 15)), big = Math.max(a, b), small = Math.min(a, b);
            return sum(a + ' + ' + b, a + b, { en: 'Start at ' + big + ' and count on ' + small + ' more.', ar: 'ابدأ من ' + big + ' وعُدّ ' + small + ' للأمام.' });
          }) },
        { id: 'math-2', title: { en: 'Taking away', ar: 'الطرح' },
          teach: { en: 'Taking away means some are removed. 9 birds sit on a wall, 4 fly off, and 5 stay. A quick way: start from the first number and count back.', ar: 'الطرح هو أن نأخذ جزءًا من المجموعة. 9 طيور على الجدار، طار منها 4، فبقي 5. طريقة سريعة: ابدأ من العدد الأول ثم عُدّ للخلف.' },
          make: four(function () {
            var a = 6 + rand(hard(8, 15, 35)), b = 1 + rand(Math.min(hard(5, 9, 19), a - 1));
            return sum(a + ' − ' + b, a - b, { en: 'Start at ' + a + ' and count back ' + b + '.', ar: 'ابدأ من ' + a + ' وعُدّ ' + b + ' للخلف.' });
          }) },
        { id: 'math-3', title: { en: 'Times 2, 5 and 10', ar: 'الضرب في 2 و5 و10' },
          teach: { en: 'Multiplying is adding the same number again and again. 3 × 5 means three fives: 5 + 5 + 5 = 15.', ar: 'الضرب هو جمع العدد نفسه عدة مرات. 3 × 5 تعني ثلاث خمسات: 5 + 5 + 5 = 15.' },
          make: four(function () {
            var a = 1 + rand(hard(5, 10, 12)), b = [2, 5, 10][rand(3)], rep = [];
            for (var i = 0; i < a; i++) rep.push(b);
            return sum(a + ' × ' + b, a * b, { en: 'Add ' + b + ', ' + a + (a === 1 ? ' time: ' : ' times: ') + rep.join(' + '), ar: 'اجمع: ' + rep.join(' + ') });
          }) },
        { id: 'math-4', title: { en: 'Bigger or smaller', ar: 'أكبر أم أصغر' },
          teach: { en: 'The sign > means "is bigger than" and < means "is smaller than". The open side always faces the bigger number, like a hungry mouth: 52 > 47. If both numbers are the same, use =. Look at the tens first, then the ones.', ar: 'الإشارة > تعني «أكبر من»، والإشارة < تعني «أصغر من». الجهة المفتوحة تتّجه دائمًا نحو العدد الأكبر، كأنها فمٌ جائع: 52 > 47. وإذا كان العددان متساويين نضع =. انظر إلى العشرات أولًا، ثم إلى الآحاد.' },
          make: four(compare) },
        { id: 'math-5', title: { en: 'The missing number', ar: 'العدد الناقص' },
          teach: { en: 'Sometimes a number is hidden. In 7 + ? = 12, ask: what do I add to 7 to make 12? Count on from 7: 8, 9, 10, 11, 12. That is 5 steps, so the missing number is 5.', ar: 'أحيانًا يختبئ عدد. في 7 + ? = 12 اسأل نفسك: كم أضيف إلى 7 لأحصل على 12؟ عُدّ من 7: 8، 9، 10، 11، 12. هذه 5 خطوات، فالعدد الناقص هو 5.' },
          make: four(missing) },
        { id: 'math-7', title: { en: 'Doubles', ar: 'الضِّعف' },
          teach: { en: 'A double is a number added to itself. Double 4 is 4 + 4 = 8. Your two hands are a double: 5 + 5 = 10.', ar: 'الضِّعف هو أن نجمع العدد مع نفسه. ضِعف 4 هو 4 + 4 = 8. ويداك ضِعف: 5 + 5 = 10.' },
          make: four(function () { var a = 1 + rand(hard(5, 10, 25)); return sum(a + ' + ' + a, a + a, { en: 'Count on ' + a + ' more from ' + a + '.', ar: 'عُدّ ' + a + ' للأمام بدءًا من ' + a + '.' }); }) },
        { id: 'math-8', title: { en: 'Make 10', ar: 'كوِّن 10' },
          teach: { en: 'Pairs of numbers that make 10 are very useful: 1 + 9, 2 + 8, 3 + 7, 4 + 6 and 5 + 5. Use your ten fingers to find the partner.', ar: 'أزواج الأعداد التي مجموعها 10 مفيدة جدًّا: 1 + 9، و2 + 8، و3 + 7، و4 + 6، و5 + 5. استعمل أصابعك العشرة لتجد الشريك.' },
          make: four(function () { var a = 1 + rand(9), q = sum(a + ' + ? = 10', 10 - a, { en: 'Hold up ' + a + ' fingers. How many are still down?', ar: 'ارفع ' + a + ' أصابع. كم إصبعًا بقي مضمومًا؟' }); q.q = MISSING; return q; }) },
        { id: 'math-9', title: { en: 'Times 3 and 4', ar: 'الضرب في 3 و4' },
          teach: { en: 'Times 3 means three of the same group, and times 4 means four groups. 4 × 3 is four threes: 3 + 3 + 3 + 3 = 12.', ar: 'الضرب في 3 يعني ثلاث مجموعات متساوية، والضرب في 4 يعني أربع مجموعات. 4 × 3 تعني أربع ثلاثات: 3 + 3 + 3 + 3 = 12.' },
          make: four(function () { var a = 1 + rand(10), b = 3 + rand(2), rp = []; for (var i = 0; i < a; i++) rp.push(b); return sum(a + ' × ' + b, a * b, { en: 'Add ' + b + ', ' + a + (a === 1 ? ' time: ' : ' times: ') + rp.join(' + '), ar: 'اجمع: ' + rp.join(' + ') }); }) },
        { id: 'math-10', title: { en: 'Sharing equally', ar: 'القسمة بالتساوي' },
          teach: { en: 'Sharing equally means everyone gets the same. 12 dates shared by 3 children: each child gets 4, because 3 × 4 = 12. We write it 12 ÷ 3 = 4.', ar: 'القسمة بالتساوي تعني أن يأخذ الجميع العدد نفسه. 12 تمرة بين 3 أطفال: يأخذ كل طفل 4، لأن 3 × 4 = 12. ونكتبها 12 ÷ 3 = 4.' },
          make: four(function () { var b = 2 + rand(4), a = 1 + rand(6); return sum((a * b) + ' ÷ ' + b, a, { en: 'Which number times ' + b + ' makes ' + (a * b) + '?', ar: 'أي عدد إذا ضربناه في ' + b + ' يعطي ' + (a * b) + '؟' }); }) },
        { id: 'math-6', title: { en: 'Count the dates', ar: 'عُدّ التمر' },
          teach: { en: 'Counting means saying one number for each thing. Touch each date as you count it: 1, 2, 3… The last number you say tells you how many there are.', ar: 'العدّ أن نقول عددًا واحدًا لكل شيء. المس كل تمرة وأنت تعدّها: 1، 2، 3… وآخر عدد تقوله يخبرك كم تمرة عندك.' },
          make: countDates },
        { id: 'math-11', title: { en: 'Counting in 2s, 5s and 10s', ar: 'العدّ بالقفز 2 و5 و10' },
          teach: { en: 'Skip counting means jumping by the same number each time: 2, 4, 6, 8… or 5, 10, 15, 20… or 10, 20, 30, 40…', ar: 'العدّ بالقفز يعني أن نقفز بالعدد نفسه كل مرة: 2، 4، 6، 8… أو 5، 10، 15، 20… أو 10، 20، 30، 40…' },
          make: four(function () { var st = [2, 5, 10][rand(3)], k = 1 + rand(hard(3, 5, 10)), seq = [k * st, (k + 1) * st, (k + 2) * st];
            var q = sum(seq.join(', ') + ', ?', (k + 3) * st, { en: 'Add ' + st + ' each time.', ar: 'أضف ' + st + ' في كل مرة.' }); q.q = { en: 'What comes next?', ar: 'ما العدد التالي؟' }; return q; }) },
        { id: 'math-12', title: { en: 'Halves', ar: 'النصف' },
          teach: { en: 'Half means splitting into two equal parts. Half of 8 is 4, because 4 + 4 = 8.', ar: 'النصف يعني أن نقسم إلى جزأين متساويين. نصف 8 هو 4، لأن 4 + 4 = 8.' },
          make: four(function () { var h = 1 + rand(hard(5, 10, 25)), q = sum(String(h * 2), h, { en: 'Which number added to itself makes ' + (h * 2) + '?', ar: 'أي عدد إذا جمعناه مع نفسه يعطي ' + (h * 2) + '؟' }); q.q = { en: 'What is half of this number?', ar: 'ما نصف هذا العدد؟' }; return q; }) },
        { id: 'math-13', title: { en: 'Shapes and sides', ar: 'الأشكال وأضلاعها' },
          teach: { en: 'A triangle has 3 sides, a square has 4, a pentagon has 5 and a hexagon has 6. Count the straight sides!', ar: 'للمثلث 3 أضلاع، وللمربع 4، وللمخمّس 5، وللمسدّس 6. عُدّ الأضلاع المستقيمة!' },
          hint: { en: 'Touch each side as you count it.', ar: 'المس كل ضلع وأنت تعدّه.' },
          questions: [
            { q: { en: 'How many sides does this shape have?', ar: 'كم ضلعًا لهذا الشكل؟' }, show: '▲', opts: ['3', '4', '5'] },
            { q: { en: 'How many sides does this shape have?', ar: 'كم ضلعًا لهذا الشكل؟' }, show: '■', opts: ['4', '3', '6'] },
            { q: { en: 'How many sides does this shape have?', ar: 'كم ضلعًا لهذا الشكل؟' }, show: '⬟', opts: ['5', '4', '6'] },
            { q: { en: 'How many sides does this shape have?', ar: 'كم ضلعًا لهذا الشكل؟' }, show: '⬢', opts: ['6', '5', '8'] }
          ] },
        { id: 'math-14', title: { en: 'Telling the time', ar: 'قراءة الساعة' },
          teach: { en: 'On a clock, the short hand shows the hour. When the long hand points straight up to 12, it is exactly that hour: 3:00 means three o\'clock.', ar: 'في الساعة يشير العقرب القصير إلى الساعة. وعندما يشير العقرب الطويل إلى 12 تمامًا تكون الساعة بالضبط: 3:00 تعني الساعة الثالثة.' },
          make: four(function () { var h = 1 + rand(12), opts = [h + ':00'];
            while (opts.length < 3) { var x = 1 + rand(12); if (opts.indexOf(x + ':00') === -1) opts.push(x + ':00'); }
            return { q: { en: 'What time does the clock show?', ar: 'كم الساعة؟' }, show: String.fromCodePoint(0x1F54F + h), opts: opts,
              hint: { en: 'Look where the short hand points.', ar: 'انظر إلى أين يشير العقرب القصير.' } }; }) },
        { id: 'math-15', title: { en: 'Shopping sums', ar: 'حساب التسوّق' },
          teach: { en: 'At the souq we add and take away. If you have 15 coins and a toy costs 6, you have 15 − 6 = 9 coins left.', ar: 'في السوق نجمع ونطرح. إذا كان معك 15 قطعة نقدية وثمن اللعبة 6، يبقى معك 15 − 6 = 9.' },
          make: four(function () { var a = 11 + rand(hard(5, 10, 40)), b = 2 + rand(Math.min(hard(5, 8, 15), a - 3)), q = sum(a + ' − ' + b, a - b, { en: 'Start at ' + a + ' and count back ' + b + '.', ar: 'ابدأ من ' + a + ' وعُدّ ' + b + ' للخلف.' });
            q.q = { en: 'You have ' + a + ' coins and buy a toy that costs ' + b + '. How many coins are left?', ar: 'معك ' + a + ' قطعة نقدية واشتريت لعبة ثمنها ' + b + '. كم بقي معك؟' }; return q; }) }
      ]
    },
    {
      id: 'science', stickers: ['🌱', '🐪', '🌗', '🧊', '🔬', '🐞', '🌦️', '🥕', '🛟', '🧲', '🦴', '🔦', '🐛', '♻️', '🌍'], name: { en: 'Science', ar: 'العلوم' }, age: { en: 'Ages 6 to 10', ar: 'من 6 إلى 10 سنوات' }, ages: [6, 10],
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
        { id: 'science-7', title: { en: 'Weather', ar: 'الطقس' },
          teach: { en: 'The weather changes every day. It can be sunny, cloudy, rainy or windy. We choose our clothes and games to suit the weather.', ar: 'يتغيّر الطقس كل يوم: قد يكون مشمسًا أو غائمًا أو ماطرًا أو عاصفًا. ونختار ملابسنا وألعابنا بما يناسب الطقس.' },
          hint: { en: 'Think about what you would see or feel outside.', ar: 'فكّر فيما تراه أو تشعر به في الخارج.' },
          questions: [
            { q: { en: 'It is raining. What do you need?', ar: 'إنها تمطر. ماذا تحتاج؟' }, opts: [{ en: 'an umbrella', ar: 'مظلّة' }, { en: 'sunglasses', ar: 'نظّارة شمسية' }, { en: 'a fan', ar: 'مروحة' }] },
            { q: { en: 'What makes a kite fly high?', ar: 'ما الذي يجعل الطائرة الورقية تطير عاليًا؟' }, opts: [{ en: 'the wind', ar: 'الريح' }, { en: 'the rain', ar: 'المطر' }, { en: 'the moon', ar: 'القمر' }] },
            { q: { en: 'Grey clouds often bring…', ar: 'الغيوم الرمادية تجلب غالبًا…' }, opts: [{ en: 'rain', ar: 'المطر' }, { en: 'sand', ar: 'الرمل' }, { en: 'stars', ar: 'النجوم' }] },
            { q: { en: 'It is a hot, sunny day. What should you wear?', ar: 'يوم حارّ ومشمس. ماذا تلبس؟' }, opts: [{ en: 'a hat', ar: 'قبّعة' }, { en: 'a thick coat', ar: 'معطف سميك' }, { en: 'gloves', ar: 'قفّازات' }] }
          ] },
        { id: 'science-8', title: { en: 'Healthy food', ar: 'الطعام الصحي' },
          teach: { en: 'Our bodies need good food to grow. Fruit and vegetables help us stay well, water is the best drink, and brushing our teeth keeps them strong.', ar: 'تحتاج أجسامنا إلى طعام مفيد لتنمو. الفواكه والخضار تحافظ على صحتنا، والماء أفضل مشروب، وتنظيف الأسنان يجعلها قوية.' },
          hint: { en: 'Which one would make your body strong?', ar: 'أيّها يجعل جسمك قويًّا؟' },
          questions: [
            { q: { en: 'Which of these is a fruit?', ar: 'أي من هذه فاكهة؟' }, opts: [{ en: 'a date', ar: 'تمرة' }, { en: 'bread', ar: 'خبز' }, { en: 'cheese', ar: 'جبن' }] },
            { q: { en: 'You are thirsty after playing. What is the best drink?', ar: 'أنت عطشان بعد اللعب. ما أفضل مشروب؟' }, opts: [{ en: 'water', ar: 'الماء' }, { en: 'a fizzy drink', ar: 'مشروب غازي' }, { en: 'sweet tea', ar: 'شاي بالسكر' }] },
            { q: { en: 'What keeps your teeth strong?', ar: 'ما الذي يحافظ على قوة أسنانك؟' }, opts: [{ en: 'brushing them', ar: 'تنظيفها بالفرشاة' }, { en: 'eating sweets', ar: 'أكل الحلوى' }, { en: 'sleeping late', ar: 'السهر' }] },
            { q: { en: 'Which of these is a vegetable?', ar: 'أي من هذه من الخضار؟' }, opts: [{ en: 'a carrot', ar: 'جزرة' }, { en: 'a cake', ar: 'كعكة' }, { en: 'a sweet', ar: 'حلوى' }] }
          ] },
        { id: 'science-9', title: { en: 'Float or sink', ar: 'يطفو أم يغرق' },
          teach: { en: 'Some things float on water and some sink to the bottom. A wooden boat and a leaf float. A stone and a metal coin sink.', ar: 'بعض الأشياء تطفو على الماء وبعضها يغرق إلى القاع. القارب الخشبي والورقة يطفوان، والحجر والقطعة النقدية المعدنية يغرقان.' },
          hint: { en: 'Is it light like wood, or heavy and small like a stone?', ar: 'هل هو خفيف كالخشب، أم ثقيل وصغير كالحجر؟' },
          questions: [
            { q: { en: 'You drop a stone into the sea. What happens?', ar: 'رميتَ حجرًا في البحر. ماذا يحدث؟' }, opts: [{ en: 'It sinks', ar: 'يغرق' }, { en: 'It floats', ar: 'يطفو' }, { en: 'It flies', ar: 'يطير' }] },
            { q: { en: 'What does a wooden boat do on water?', ar: 'ماذا يفعل القارب الخشبي على الماء؟' }, opts: [{ en: 'It floats', ar: 'يطفو' }, { en: 'It sinks', ar: 'يغرق' }, { en: 'It melts', ar: 'يذوب' }] },
            { q: { en: 'Which of these sinks?', ar: 'أيّها يغرق؟' }, opts: [{ en: 'a metal coin', ar: 'قطعة نقدية معدنية' }, { en: 'a leaf', ar: 'ورقة شجر' }, { en: 'a cork', ar: 'فلّينة' }] },
            { q: { en: 'Which of these floats?', ar: 'أيّها يطفو؟' }, opts: [{ en: 'a leaf', ar: 'ورقة شجر' }, { en: 'a key', ar: 'مفتاح' }, { en: 'a stone', ar: 'حجر' }] }
          ] },
        { id: 'science-10', title: { en: 'Magnets', ar: 'المغناطيس' },
          teach: { en: 'A magnet pulls things made of iron or steel, like paper clips and nails. It does not pull plastic, wood or paper. A magnet has two ends called poles: two of the same pole push apart.', ar: 'المغناطيس يجذب الأشياء المصنوعة من الحديد أو الفولاذ، مثل مشابك الورق والمسامير، ولا يجذب البلاستيك أو الخشب أو الورق. وللمغناطيس طرفان يسمّيان القطبين، والقطبان المتشابهان يتنافران.' },
          hint: { en: 'Is it made of iron or steel?', ar: 'هل هو مصنوع من الحديد أو الفولاذ؟' },
          questions: [
            { q: { en: 'Which one will a magnet pick up?', ar: 'أيّها يلتقطه المغناطيس؟' }, opts: [{ en: 'a paper clip', ar: 'مشبك ورق' }, { en: 'a plastic spoon', ar: 'ملعقة بلاستيكية' }, { en: 'a wooden block', ar: 'مكعب خشبي' }] },
            { q: { en: 'What are the two ends of a magnet called?', ar: 'ماذا يسمّى طرفا المغناطيس؟' }, opts: [{ en: 'poles', ar: 'القطبان' }, { en: 'wheels', ar: 'العجلتان' }, { en: 'roots', ar: 'الجذران' }] },
            { q: { en: 'You push two north poles together. What happens?', ar: 'قرّبتَ قطبين شماليين. ماذا يحدث؟' }, opts: [{ en: 'They push apart', ar: 'يتنافران' }, { en: 'They stick', ar: 'يلتصقان' }, { en: 'They disappear', ar: 'يختفيان' }] },
            { q: { en: 'Which of these is NOT pulled by a magnet?', ar: 'أي من هذه لا يجذبه المغناطيس؟' }, opts: [{ en: 'paper', ar: 'الورق' }, { en: 'a nail', ar: 'مسمار' }, { en: 'a steel pin', ar: 'دبوس فولاذي' }] }
          ] },
        { id: 'science-11', title: { en: 'Bones and muscles', ar: 'العظام والعضلات' },
          teach: { en: 'Your skeleton is made of bones. It holds your body up and protects the parts inside, like the skull around your brain. Muscles pull on bones to help you move.', ar: 'الهيكل العظمي مكوّن من العظام. يسند جسمك ويحمي الأعضاء الداخلية، مثل الجمجمة التي تحمي الدماغ. والعضلات تشدّ العظام لتساعدك على الحركة.' },
          hint: { en: 'Think about what is hard inside you, and what helps you move.', ar: 'فكّر فيما هو صلب داخلك، وفيما يساعدك على الحركة.' },
          questions: [
            { q: { en: 'What holds your body up?', ar: 'ما الذي يسند جسمك؟' }, opts: [{ en: 'the skeleton', ar: 'الهيكل العظمي' }, { en: 'the hair', ar: 'الشعر' }, { en: 'the nails', ar: 'الأظافر' }] },
            { q: { en: 'What pulls on bones to help you move?', ar: 'ما الذي يشدّ العظام لتتحرّك؟' }, opts: [{ en: 'muscles', ar: 'العضلات' }, { en: 'teeth', ar: 'الأسنان' }, { en: 'eyelashes', ar: 'الرموش' }] },
            { q: { en: 'What protects your brain?', ar: 'ما الذي يحمي دماغك؟' }, opts: [{ en: 'the skull', ar: 'الجمجمة' }, { en: 'the knee', ar: 'الركبة' }, { en: 'the elbow', ar: 'المرفق' }] },
            { q: { en: 'Where is your heart?', ar: 'أين يوجد قلبك؟' }, opts: [{ en: 'in your chest', ar: 'في صدرك' }, { en: 'in your foot', ar: 'في قدمك' }, { en: 'in your hand', ar: 'في يدك' }] }
          ] },
        { id: 'science-12', title: { en: 'Light and shadow', ar: 'الضوء والظل' },
          teach: { en: 'Light comes from things like the Sun, a lamp or a torch. When something blocks the light, it makes a dark shape behind it: a shadow. Shadows are long in the morning and evening and short at midday.', ar: 'يأتي الضوء من أشياء مثل الشمس والمصباح والكشّاف. وعندما يحجب شيء الضوء يتكوّن خلفه شكل داكن هو الظل. والظلال طويلة في الصباح والمساء وقصيرة عند الظهر.' },
          hint: { en: 'Does it block the light, or let the light through?', ar: 'هل يحجب الضوء، أم يسمح له بالمرور؟' },
          questions: [
            { q: { en: 'What makes a shadow?', ar: 'ما الذي يصنع الظل؟' }, opts: [{ en: 'something blocking the light', ar: 'شيء يحجب الضوء' }, { en: 'the wind', ar: 'الريح' }, { en: 'a loud sound', ar: 'صوت عالٍ' }] },
            { q: { en: 'Which of these gives light?', ar: 'أي من هذه يعطي ضوءًا؟' }, opts: [{ en: 'a torch', ar: 'الكشّاف' }, { en: 'a stone', ar: 'الحجر' }, { en: 'a book', ar: 'الكتاب' }] },
            { q: { en: 'Which one makes the darkest shadow?', ar: 'أيّها يصنع أغمق ظل؟' }, opts: [{ en: 'a wooden door', ar: 'باب خشبي' }, { en: 'a clear glass window', ar: 'نافذة زجاجية شفافة' }, { en: 'clean water', ar: 'ماء صافٍ' }] },
            { q: { en: 'When is your shadow shortest?', ar: 'متى يكون ظلّك أقصر؟' }, opts: [{ en: 'at midday', ar: 'عند الظهر' }, { en: 'early morning', ar: 'في الصباح الباكر' }, { en: 'in the evening', ar: 'في المساء' }] }
          ] },
        { id: 'science-13', title: { en: 'Life cycles', ar: 'دورة الحياة' },
          teach: { en: 'Living things grow and change. A frog starts as an egg, becomes a tadpole, then a frog. A butterfly starts as a caterpillar. A chick hatches from an egg. A seed grows into a plant.', ar: 'الكائنات الحية تنمو وتتغيّر. الضفدع يبدأ بيضة، ثم يصير شُرغوفًا، ثم ضفدعًا. والفراشة تبدأ يرقة. والكتكوت يفقس من البيضة. والبذرة تنمو فتصير نبتة.' },
          hint: { en: 'What does it look like when it is very young?', ar: 'كيف يبدو عندما يكون صغيرًا جدًّا؟' },
          questions: [
            { q: { en: 'What does a tadpole grow into?', ar: 'إلامَ يتحوّل الشُّرغوف؟' }, opts: ['🐸', '🐟', '🦋'] },
            { q: { en: 'What does a caterpillar become?', ar: 'إلامَ تتحوّل اليرقة؟' }, opts: ['🦋', '🐝', '🐞'] },
            { q: { en: 'What hatches from this egg?', ar: 'ماذا يفقس من هذه البيضة؟' }, show: '🥚', opts: ['🐥', '🐸', '🐛'] },
            { q: { en: 'What does a seed grow into?', ar: 'إلامَ تنمو البذرة؟' }, opts: ['🌱', '🪨', '🐛'] }
          ] },
        { id: 'science-14', title: { en: 'Recycling', ar: 'إعادة التدوير' },
          teach: { en: 'Recycling means making old things into new ones. Paper, plastic bottles and cans can be recycled. Saving water and switching off lights also helps our planet.', ar: 'إعادة التدوير تعني أن نصنع من الأشياء القديمة أشياء جديدة. يمكن تدوير الورق وزجاجات البلاستيك والعلب المعدنية. وتوفير الماء وإطفاء الأنوار يساعدان كوكبنا أيضًا.' },
          hint: { en: 'Which choice is kindest to the Earth?', ar: 'أي اختيار هو الألطف بالأرض؟' },
          questions: [
            { q: { en: 'Where should an empty plastic bottle go?', ar: 'أين نضع زجاجة البلاستيك الفارغة؟' }, opts: [{ en: 'the recycling bin', ar: 'سلة إعادة التدوير' }, { en: 'the sea', ar: 'البحر' }, { en: 'the sand', ar: 'الرمل' }] },
            { q: { en: 'Which of these can be recycled?', ar: 'أي من هذه يمكن تدويره؟' }, opts: [{ en: 'paper', ar: 'الورق' }, { en: 'banana peel', ar: 'قشر الموز' }, { en: 'a leaf', ar: 'ورقة شجر' }] },
            { q: { en: 'You leave a room. What should you do?', ar: 'خرجت من الغرفة. ماذا تفعل؟' }, opts: [{ en: 'switch off the light', ar: 'أطفئ النور' }, { en: 'open the window', ar: 'افتح النافذة' }, { en: 'turn on the TV', ar: 'شغّل التلفاز' }] },
            { q: { en: 'You are brushing your teeth. What saves water?', ar: 'تنظّف أسنانك. ما الذي يوفّر الماء؟' }, opts: [{ en: 'turning off the tap', ar: 'إغلاق الصنبور' }, { en: 'leaving the tap on', ar: 'ترك الصنبور مفتوحًا' }, { en: 'a long shower', ar: 'استحمام طويل' }] }
          ] },
        { id: 'science-15', title: { en: 'Land and water', ar: 'اليابسة والماء' },
          teach: { en: 'Our Earth has land and water. Most of the Earth is covered by water, mostly in big oceans. The Arabian Gulf is a sea next to our land. Deserts, mountains and plains are kinds of land.', ar: 'على الأرض يابسة وماء. ومعظم سطح الأرض مغطّى بالماء، وأغلبه في المحيطات الكبيرة. والخليج العربي بحر بجوار أرضنا. والصحارى والجبال والسهول أنواع من اليابسة.' },
          hint: { en: 'Picture a globe: what colour is most of it?', ar: 'تخيّل مجسّم الكرة الأرضية: ما اللون الذي يغطّي معظمه؟' },
          questions: [
            { q: { en: 'What covers most of the Earth?', ar: 'ما الذي يغطّي معظم سطح الأرض؟' }, opts: [{ en: 'water', ar: 'الماء' }, { en: 'sand', ar: 'الرمل' }, { en: 'ice cream', ar: 'المثلّجات' }] },
            { q: { en: 'What is the biggest kind of water?', ar: 'ما أكبر المسطّحات المائية؟' }, opts: [{ en: 'an ocean', ar: 'المحيط' }, { en: 'a pond', ar: 'البركة' }, { en: 'a puddle', ar: 'بِركة المطر الصغيرة' }] },
            { q: { en: 'Which of these is a kind of land?', ar: 'أي من هذه نوع من اليابسة؟' }, opts: [{ en: 'a desert', ar: 'الصحراء' }, { en: 'a sea', ar: 'البحر' }, { en: 'a river', ar: 'النهر' }] },
            { q: { en: 'The Arabian Gulf is…', ar: 'الخليج العربي…' }, opts: [{ en: 'a sea', ar: 'بحر' }, { en: 'a mountain', ar: 'جبل' }, { en: 'a desert', ar: 'صحراء' }] }
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
      id: 'english', stickers: ['🔤', '🎶', '🎈', '🐶', '📖', '🖼️', '🎨', '🔢', '🏃', '🗣️', '🍓', '🖐️', '🐘', '❓', '⏮️'], name: { en: 'English', ar: 'اللغة الإنجليزية' }, age: { en: 'Ages 5 to 9', ar: 'من 5 إلى 9 سنوات' }, ages: [5, 9],
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
          ] },
        { id: 'english-7', title: { en: 'Colours', ar: 'الألوان بالإنجليزية' },
          teach: { en: 'Colour words: red like an apple, yellow like a banana, green like broccoli and blue like a whale.', ar: 'أسماء الألوان بالإنجليزية: red أحمر مثل التفاحة، و yellow أصفر مثل الموزة، و green أخضر مثل البروكلي، و blue أزرق مثل الحوت.' },
          hint: { en: 'Read the colour word, then look for something that colour.', ar: 'اقرأ اسم اللون، ثم ابحث عن شيء بهذا اللون.' },
          questions: [
            { q: { en: 'Find the picture that is this colour.', ar: 'ابحث عن الصورة التي لونها هكذا.' }, show: 'red', gloss: { en: '', ar: 'أحمر' }, opts: ['🍎', '🍌', '🥦'] },
            { q: { en: 'Find the picture that is this colour.', ar: 'ابحث عن الصورة التي لونها هكذا.' }, show: 'yellow', gloss: { en: '', ar: 'أصفر' }, opts: ['🍌', '🍎', '🐳'] },
            { q: { en: 'Find the picture that is this colour.', ar: 'ابحث عن الصورة التي لونها هكذا.' }, show: 'green', gloss: { en: '', ar: 'أخضر' }, opts: ['🥦', '🍌', '🍎'] },
            { q: { en: 'Find the picture that is this colour.', ar: 'ابحث عن الصورة التي لونها هكذا.' }, show: 'blue', gloss: { en: '', ar: 'أزرق' }, opts: ['🐳', '🍎', '🍌'] }
          ] },
        { id: 'english-8', title: { en: 'Numbers one to ten', ar: 'الأعداد من واحد إلى عشرة' },
          teach: { en: 'one 1, two 2, three 3, four 4, five 5, six 6, seven 7, eight 8, nine 9, ten 10.', ar: 'نعدّ بالإنجليزية: one 1، two 2، three 3، four 4، five 5، six 6، seven 7، eight 8، nine 9، ten 10.' },
          hint: { en: 'Count on your fingers: one, two, three…', ar: 'عُدّ على أصابعك بالإنجليزية: one، two، three…' },
          questions: [
            { q: WHICH_NUMBER, show: 'three', gloss: { en: '', ar: 'ثلاثة' }, opts: ['3', '5', '8'] },
            { q: WHICH_NUMBER, show: 'seven', gloss: { en: '', ar: 'سبعة' }, opts: ['7', '2', '9'] },
            { q: WHICH_NUMBER, show: 'ten', gloss: { en: '', ar: 'عشرة' }, opts: ['10', '6', '4'] },
            { q: WHICH_NUMBER, show: 'five', gloss: { en: '', ar: 'خمسة' }, opts: ['5', '1', '8'] }
          ] },
        { id: 'english-9', title: { en: 'Action words', ar: 'كلمات الأفعال' },
          teach: { en: 'Action words tell us what someone is doing: run, sleep, swim, eat.', ar: 'كلمات الأفعال تخبرنا بما يفعله شخص ما: run يركض، و sleep ينام، و swim يسبح، و eat يأكل.' },
          hint: { en: 'Act it out! Which picture is doing that?', ar: 'مثّل الفعل! أي صورة تفعل ذلك؟' },
          questions: [
            { q: { en: 'Which picture shows this action?', ar: 'أي صورة تُظهر هذا الفعل؟' }, show: 'run', gloss: { en: '', ar: 'يركض' }, opts: ['🏃', '😴', '🏊'] },
            { q: { en: 'Which picture shows this action?', ar: 'أي صورة تُظهر هذا الفعل؟' }, show: 'sleep', gloss: { en: '', ar: 'ينام' }, opts: ['😴', '🏃', '🍽️'] },
            { q: { en: 'Which picture shows this action?', ar: 'أي صورة تُظهر هذا الفعل؟' }, show: 'swim', gloss: { en: '', ar: 'يسبح' }, opts: ['🏊', '😴', '🏃'] },
            { q: { en: 'Which picture shows this action?', ar: 'أي صورة تُظهر هذا الفعل؟' }, show: 'eat', gloss: { en: '', ar: 'يأكل' }, opts: ['🍽️', '🏊', '😴'] }
          ] },
        { id: 'english-10', title: { en: 'am, is, are', ar: 'am و is و are' },
          teach: { en: 'Use am with I (I am happy), is with one person or thing (The cat is big), and are with you, we and they (We are friends).', ar: 'نستعمل am مع I (أنا)، و is مع شخص أو شيء واحد، و are مع you و we و they. مثل: I am happy (أنا سعيد)، و We are friends (نحن أصدقاء).' },
          hint: { en: 'Who is it about: I (am), one thing (is) or more than one (are)?', ar: 'عمّن تتحدّث الجملة: I (am)، أم شيء واحد (is)، أم أكثر من واحد (are)؟' },
          questions: [
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: 'I ___ happy.', opts: ['am', 'is', 'are'] },
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: 'The dog ___ big.', opts: ['is', 'am', 'are'] },
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: 'We ___ friends.', opts: ['are', 'is', 'am'] },
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: 'They ___ at school.', opts: ['are', 'am', 'is'] }
          ] },
        { id: 'english-11', title: { en: 'Fruit words', ar: 'أسماء الفواكه' },
          teach: { en: 'Fruit words: apple, banana, grapes and orange.', ar: 'أسماء فواكه بالإنجليزية: apple تفاحة، و banana موزة، و grapes عنب، و orange برتقالة.' },
          hint: { en: 'Read the word, then find the fruit.', ar: 'اقرأ الكلمة، ثم ابحث عن الفاكهة.' },
          questions: [
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'apple', gloss: { en: '', ar: 'تفاحة' }, opts: ['🍎', '🍌', '🍇'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'banana', gloss: { en: '', ar: 'موزة' }, opts: ['🍌', '🍊', '🍎'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'grapes', gloss: { en: '', ar: 'عنب' }, opts: ['🍇', '🍎', '🍊'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'orange', gloss: { en: '', ar: 'برتقالة' }, opts: ['🍊', '🍇', '🍌'] }
          ] },
        { id: 'english-12', title: { en: 'Body parts', ar: 'أجزاء الجسم' },
          teach: { en: 'Body words: hand, eye, nose and ear.', ar: 'أجزاء الجسم بالإنجليزية: hand يد، و eye عين، و nose أنف، و ear أذن.' },
          hint: { en: 'Point to that part of your body, then find the picture.', ar: 'أشِر إلى ذلك الجزء من جسمك، ثم ابحث عن الصورة.' },
          questions: [
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'hand', gloss: { en: '', ar: 'يد' }, opts: ['✋', '👁️', '👂'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'eye', gloss: { en: '', ar: 'عين' }, opts: ['👁️', '👃', '✋'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'nose', gloss: { en: '', ar: 'أنف' }, opts: ['👃', '👂', '👁️'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'ear', gloss: { en: '', ar: 'أذن' }, opts: ['👂', '✋', '👃'] }
          ] },
        { id: 'english-13', title: { en: 'Describing words', ar: 'كلمات الوصف' },
          teach: { en: 'Describing words tell us what something is like: big or small, hot or cold.', ar: 'كلمات الوصف تخبرنا كيف يبدو الشيء: big كبير أو small صغير، و hot حارّ أو cold بارد.' },
          hint: { en: 'Think of something that is very big, small, hot or cold.', ar: 'فكّر في شيء كبير جدًّا أو صغير أو حارّ أو بارد.' },
          questions: [
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'big', gloss: { en: '', ar: 'كبير' }, opts: ['🐘', '🐭', '🐜'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'small', gloss: { en: '', ar: 'صغير' }, opts: ['🐭', '🐘', '🐋'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'hot', gloss: { en: '', ar: 'حارّ' }, opts: ['🔥', '🧊', '🐟'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'cold', gloss: { en: '', ar: 'بارد' }, opts: ['🧊', '🔥', '🌞'] }
          ] },
        { id: 'english-14', title: { en: 'Question words', ar: 'كلمات السؤال' },
          teach: { en: 'Question words start questions: What asks about a thing, Where asks about a place, When asks about a time, and Who asks about a person.', ar: 'كلمات السؤال تبدأ بها الأسئلة: What ماذا (عن شيء)، و Where أين (عن مكان)، و When متى (عن وقت)، و Who من (عن شخص).' },
          hint: { en: 'Is the question about a thing, a place, a time or a person?', ar: 'هل السؤال عن شيء أم مكان أم وقت أم شخص؟' },
          questions: [
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: '___ is your name?', opts: ['What', 'Where', 'When'] },
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: '___ do you live?', opts: ['Where', 'Who', 'What'] },
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: '___ is your birthday?', opts: ['When', 'Who', 'Where'] },
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: '___ is that boy?', opts: ['Who', 'When', 'Where'] }
          ] },
        { id: 'english-15', title: { en: 'Yesterday words (-ed)', ar: 'الماضي بإضافة ed' },
          teach: { en: 'To talk about yesterday, many action words add -ed: play becomes played, walk becomes walked.', ar: 'للحديث عن الماضي نضيف ed إلى كثير من الأفعال: play تصير played، و walk تصير walked.' },
          hint: { en: 'The sentence is about yesterday or last week, so look for -ed.', ar: 'الجملة عن الأمس أو الأسبوع الماضي، فابحث عن ed.' },
          questions: [
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: 'Yesterday I ___ football.', opts: ['played', 'play', 'plays'] },
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: 'Last week we ___ a cake.', opts: ['baked', 'bake', 'bakes'] },
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: 'Yesterday she ___ home.', opts: ['walked', 'walk', 'walks'] },
            { q: { en: 'Which word fills the gap?', ar: 'أي كلمة تملأ الفراغ؟' }, show: 'Last night they ___ a film.', opts: ['watched', 'watch', 'watches'] }
          ] }
      ]
    },
    {
      id: 'arabic', stickers: ['📜', '🌓', '🔟', '🕌', '✌️', '✍️', '🌈', '🐫', '🏷️', '📅', '👪', '👂', '👧', '📚', '💬'], name: { en: 'Arabic', ar: 'اللغة العربية' }, age: { en: 'Ages 3 to 8', ar: 'من 3 إلى 8 سنوات' }, ages: [3, 8],
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
          questions: [{ kind: 'trace', q: TRACE, show: 'ب' }, { kind: 'trace', q: TRACE, show: 'ج' }, { kind: 'trace', q: TRACE, show: 'م' }, { kind: 'trace', q: TRACE, show: 'ك' }] },
        { id: 'arabic-7', title: { en: 'Colours in Arabic', ar: 'الألوان' },
          teach: { en: 'Colours in Arabic: أحمر red like an apple, أصفر yellow like a banana, أخضر green like broccoli and أزرق blue like a whale.', ar: 'نتعلّم أسماء الألوان: أحمر مثل التفاحة، وأصفر مثل الموزة، وأخضر مثل البروكلي، وأزرق مثل الحوت.' },
          hint: { en: 'Read the colour word, then find something that colour.', ar: 'اقرأ اسم اللون، ثم ابحث عن شيء بهذا اللون.' },
          questions: [
            { q: { en: 'Which picture is this colour?', ar: 'أي صورة لونها هكذا؟' }, show: 'أحمر', gloss: { en: 'red', ar: '' }, opts: ['🍎', '🍌', '🥦'] },
            { q: { en: 'Which picture is this colour?', ar: 'أي صورة لونها هكذا؟' }, show: 'أصفر', gloss: { en: 'yellow', ar: '' }, opts: ['🍌', '🐳', '🍎'] },
            { q: { en: 'Which picture is this colour?', ar: 'أي صورة لونها هكذا؟' }, show: 'أخضر', gloss: { en: 'green', ar: '' }, opts: ['🥦', '🍎', '🍌'] },
            { q: { en: 'Which picture is this colour?', ar: 'أي صورة لونها هكذا؟' }, show: 'أزرق', gloss: { en: 'blue', ar: '' }, opts: ['🐳', '🥦', '🍎'] }
          ] },
        { id: 'arabic-8', title: { en: 'Animals in Arabic', ar: 'الحيوانات' },
          teach: { en: 'Animal words: جمل camel, سمكة fish, قطة cat, حصان horse.', ar: 'نتعلّم أسماء الحيوانات: جمل، وسمكة، وقطة، وحصان.' },
          hint: { en: 'Read the word slowly, then find the animal.', ar: 'اقرأ الكلمة ببطء، ثم ابحث عن الحيوان.' },
          questions: [
            { q: { en: 'Which picture is this animal?', ar: 'أي صورة لهذا الحيوان؟' }, show: 'جمل', gloss: { en: 'camel', ar: '' }, opts: ['🐪', '🐟', '🐦'] },
            { q: { en: 'Which picture is this animal?', ar: 'أي صورة لهذا الحيوان؟' }, show: 'سمكة', gloss: { en: 'fish', ar: '' }, opts: ['🐟', '🐱', '🐪'] },
            { q: { en: 'Which picture is this animal?', ar: 'أي صورة لهذا الحيوان؟' }, show: 'قطة', gloss: { en: 'cat', ar: '' }, opts: ['🐱', '🐎', '🐟'] },
            { q: { en: 'Which picture is this animal?', ar: 'أي صورة لهذا الحيوان؟' }, show: 'حصان', gloss: { en: 'horse', ar: '' }, opts: ['🐎', '🐱', '🐦'] }
          ] },
        { id: 'arabic-9', title: { en: '"The" in Arabic (ال)', ar: '«ال» التعريف' },
          teach: { en: 'To say "the" in Arabic, put ال at the start of the word: بيت (a house) becomes البيت (the house).', ar: 'لنعرّف الكلمة نضع «ال» في أولها: «بيت» تصير «البيت»، و«قمر» تصير «القمر».' },
          hint: { en: 'Look for the word that starts with ال.', ar: 'ابحث عن الكلمة التي تبدأ بـ «ال».' },
          questions: [
            { q: { en: 'Add "the" (ال). Which word is right?', ar: 'أضف «ال» التعريف. أي كلمة صحيحة؟' }, show: 'بيت', gloss: { en: 'house', ar: '' }, opts: ['البيت', 'بيتي', 'بيتان'] },
            { q: { en: 'Add "the" (ال). Which word is right?', ar: 'أضف «ال» التعريف. أي كلمة صحيحة؟' }, show: 'قمر', gloss: { en: 'moon', ar: '' }, opts: ['القمر', 'قمري', 'قمران'] },
            { q: { en: 'Add "the" (ال). Which word is right?', ar: 'أضف «ال» التعريف. أي كلمة صحيحة؟' }, show: 'شمس', gloss: { en: 'sun', ar: '' }, opts: ['الشمس', 'شمسي', 'شموس'] },
            { q: { en: 'Add "the" (ال). Which word is right?', ar: 'أضف «ال» التعريف. أي كلمة صحيحة؟' }, show: 'كتاب', gloss: { en: 'book', ar: '' }, opts: ['الكتاب', 'كتابي', 'كتب'] }
          ] },
        { id: 'arabic-10', title: { en: 'Days of the week', ar: 'أيام الأسبوع' },
          teach: { en: 'The days in Arabic, in order: السبت Saturday, الأحد Sunday, الاثنين Monday, الثلاثاء Tuesday, الأربعاء Wednesday, الخميس Thursday, الجمعة Friday.', ar: 'أيام الأسبوع بالترتيب: السبت، الأحد، الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة.' },
          hint: { en: 'Say the days in order from Saturday, then find the next one.', ar: 'قل الأيام بالترتيب من السبت، ثم ابحث عن اليوم التالي.' },
          questions: [
            { q: { en: 'Which day comes next?', ar: 'أي يوم يأتي بعده؟' }, show: 'السبت', gloss: { en: 'Saturday', ar: '' }, opts: ['الأحد', 'الاثنين', 'الجمعة'] },
            { q: { en: 'Which day comes next?', ar: 'أي يوم يأتي بعده؟' }, show: 'الأحد', gloss: { en: 'Sunday', ar: '' }, opts: ['الاثنين', 'الأربعاء', 'السبت'] },
            { q: { en: 'Which day comes next?', ar: 'أي يوم يأتي بعده؟' }, show: 'الثلاثاء', gloss: { en: 'Tuesday', ar: '' }, opts: ['الأربعاء', 'الخميس', 'الأحد'] },
            { q: { en: 'Which day comes next?', ar: 'أي يوم يأتي بعده؟' }, show: 'الخميس', gloss: { en: 'Thursday', ar: '' }, opts: ['الجمعة', 'السبت', 'الاثنين'] }
          ] },
        { id: 'arabic-11', title: { en: 'Family', ar: 'العائلة' },
          teach: { en: 'Family words in Arabic: أم mother, أب father, جدّ grandfather, طفل baby.', ar: 'كلمات العائلة: أم، وأب، وجدّ، وطفل.' },
          hint: { en: 'Read the word slowly and think of your own family.', ar: 'اقرأ الكلمة ببطء وفكّر في عائلتك.' },
          questions: [
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'أم', gloss: { en: 'mother', ar: '' }, opts: ['👩', '👴', '👶'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'أب', gloss: { en: 'father', ar: '' }, opts: ['👨', '👶', '👵'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'جدّ', gloss: { en: 'grandfather', ar: '' }, opts: ['👴', '👩', '👶'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'طفل', gloss: { en: 'baby', ar: '' }, opts: ['👶', '👨', '👴'] }
          ] },
        { id: 'arabic-12', title: { en: 'Body parts in Arabic', ar: 'أجزاء الجسم' },
          teach: { en: 'Body words in Arabic: يد hand, عين eye, أنف nose, أذن ear.', ar: 'أجزاء الجسم: يد، وعين، وأنف، وأذن.' },
          hint: { en: 'Point to that part of your body, then find the picture.', ar: 'أشِر إلى ذلك الجزء من جسمك، ثم ابحث عن الصورة.' },
          questions: [
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'يد', gloss: { en: 'hand', ar: '' }, opts: ['✋', '👁️', '👂'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'عين', gloss: { en: 'eye', ar: '' }, opts: ['👁️', '👃', '✋'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'أنف', gloss: { en: 'nose', ar: '' }, opts: ['👃', '👂', '👁️'] },
            { q: { en: 'Which picture matches the word?', ar: 'أي صورة تناسب الكلمة؟' }, show: 'أذن', gloss: { en: 'ear', ar: '' }, opts: ['👂', '✋', '👃'] }
          ] },
        { id: 'arabic-13', title: { en: 'Words for girls (ة)', ar: 'المذكّر والمؤنّث' },
          teach: { en: 'In Arabic, many words for a girl or a woman end in ة: معلّم (a male teacher) becomes معلّمة (a female teacher).', ar: 'كثير من الكلمات تصير مؤنّثة بإضافة التاء المربوطة «ة»: معلّم ← معلّمة، وطالب ← طالبة.' },
          hint: { en: 'Look for the word that ends with ة.', ar: 'ابحث عن الكلمة التي تنتهي بـ «ة».' },
          questions: [
            { q: { en: 'Which word is for a girl or a woman?', ar: 'ما المؤنث من هذه الكلمة؟' }, show: 'معلّم', gloss: { en: 'teacher', ar: '' }, opts: ['معلّمة', 'معلّمون', 'معلّمان'] },
            { q: { en: 'Which word is for a girl or a woman?', ar: 'ما المؤنث من هذه الكلمة؟' }, show: 'طالب', gloss: { en: 'student', ar: '' }, opts: ['طالبة', 'طلاب', 'طالبان'] },
            { q: { en: 'Which word is for a girl or a woman?', ar: 'ما المؤنث من هذه الكلمة؟' }, show: 'صديق', gloss: { en: 'friend', ar: '' }, opts: ['صديقة', 'أصدقاء', 'صديقان'] },
            { q: { en: 'Which word is for a girl or a woman?', ar: 'ما المؤنث من هذه الكلمة؟' }, show: 'طبيب', gloss: { en: 'doctor', ar: '' }, opts: ['طبيبة', 'أطبّاء', 'طبيبان'] }
          ] },
        { id: 'arabic-14', title: { en: 'Many (plural)', ar: 'الجمع' },
          teach: { en: 'For three or more, Arabic often changes the word: كتاب (book) becomes كتب (books), and ولد (boy) becomes أولاد (boys). Two is different again: كتابان.', ar: 'للثلاثة أو أكثر نستعمل الجمع، وكثيرًا ما تتغيّر الكلمة: كتاب ← كتب، وولد ← أولاد. أما الاثنان فلهما المثنّى: كتابان.' },
          hint: { en: 'The plural is for three or more, not two (ان) and not "my" (ي).', ar: 'الجمع لثلاثة أو أكثر، فهو ليس المثنّى (ان) ولا «ي» الملكية.' },
          questions: [
            { q: { en: 'Which word means three or more?', ar: 'ما جمع هذه الكلمة؟' }, show: 'كتاب', gloss: { en: 'book', ar: '' }, opts: ['كتب', 'كتابان', 'كتابي'] },
            { q: { en: 'Which word means three or more?', ar: 'ما جمع هذه الكلمة؟' }, show: 'قلم', gloss: { en: 'pen', ar: '' }, opts: ['أقلام', 'قلمان', 'قلمي'] },
            { q: { en: 'Which word means three or more?', ar: 'ما جمع هذه الكلمة؟' }, show: 'بيت', gloss: { en: 'house', ar: '' }, opts: ['بيوت', 'بيتان', 'بيتي'] },
            { q: { en: 'Which word means three or more?', ar: 'ما جمع هذه الكلمة؟' }, show: 'ولد', gloss: { en: 'boy', ar: '' }, opts: ['أولاد', 'ولدان', 'ولدي'] }
          ] },
        { id: 'arabic-15', title: { en: 'Little sentences', ar: 'جمل قصيرة' },
          teach: { en: 'A sentence tells us who does what: أنا أشرب الماء means "I drink water". Choose the action word that makes sense.', ar: 'الجملة تخبرنا من يفعل ماذا: «أنا أشرب الماء». اختر الفعل الذي يجعل المعنى صحيحًا.' },
          hint: { en: 'Read the whole sentence. Which action makes sense?', ar: 'اقرأ الجملة كلها. أي فعل يجعل المعنى صحيحًا؟' },
          questions: [
            { q: { en: 'Which word completes the sentence?', ar: 'أي كلمة تكمل الجملة؟' }, show: 'أنا ___ الماء.', gloss: { en: 'I ___ water.', ar: '' }, opts: ['أشرب', 'آكل', 'أنام'] },
            { q: { en: 'Which word completes the sentence?', ar: 'أي كلمة تكمل الجملة؟' }, show: 'القطة ___ الحليب.', gloss: { en: 'The cat ___ milk.', ar: '' }, opts: ['تشرب', 'تكتب', 'تقرأ'] },
            { q: { en: 'Which word completes the sentence?', ar: 'أي كلمة تكمل الجملة؟' }, show: 'أنا ___ الكتاب.', gloss: { en: 'I ___ the book.', ar: '' }, opts: ['أقرأ', 'أشرب', 'أركض'] },
            { q: { en: 'Which word completes the sentence?', ar: 'أي كلمة تكمل الجملة؟' }, show: 'الطائر ___ في السماء.', gloss: { en: 'The bird ___ in the sky.', ar: '' }, opts: ['يطير', 'يسبح', 'يأكل'] }
          ] }
      ]
    },
    {
      id: 'art', stickers: ['🎨', '🌈', '🧶', '🔺', '🖌️', '🌗', '〰️', '🧵', '🦋', '🎡', '😊', '🧸', '🕌', '💙', '⛵'], name: { en: 'Art', ar: 'الفنون' }, age: { en: 'Ages 3 to 10', ar: 'من 3 إلى 10 سنوات' }, ages: [3, 10],
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
          questions: [{ kind: 'trace', q: TRACE_SHAPE, show: '▲', outline: true }, { kind: 'trace', q: TRACE_SHAPE, show: '■', outline: true }, { kind: 'trace', q: TRACE_SHAPE, show: '●', outline: true }, { kind: 'trace', q: TRACE_SHAPE, show: '◆', outline: true }] },
        { id: 'art-7', title: { en: 'Lines', ar: 'الخطوط' },
          teach: { en: 'Artists use many kinds of lines: straight lines, wavy lines like water, and zigzag lines like mountains. Sadu weaving is full of zigzags!', ar: 'يستعمل الفنانون أنواعًا كثيرة من الخطوط: خطوط مستقيمة، وخطوط متموّجة مثل الماء، وخطوط متعرّجة مثل الجبال. ونسيج السدو مليء بالخطوط المتعرّجة!' },
          hint: { en: 'Run your finger along the line in the air. Does it go up and down?', ar: 'حرّك إصبعك في الهواء على شكل الخط. هل يصعد وينزل؟' },
          questions: [
            { q: { en: 'What kind of line is this?', ar: 'ما نوع هذا الخط؟' }, show: '━━━━━', opts: [{ en: 'straight', ar: 'مستقيم' }, { en: 'wavy', ar: 'متموّج' }, { en: 'zigzag', ar: 'متعرّج' }] },
            { q: { en: 'What kind of line is this?', ar: 'ما نوع هذا الخط؟' }, show: '〰〰〰', opts: [{ en: 'wavy', ar: 'متموّج' }, { en: 'straight', ar: 'مستقيم' }, { en: 'zigzag', ar: 'متعرّج' }] },
            { q: { en: 'What kind of line is this?', ar: 'ما نوع هذا الخط؟' }, show: '╱╲╱╲╱╲', opts: [{ en: 'zigzag', ar: 'متعرّج' }, { en: 'wavy', ar: 'متموّج' }, { en: 'straight', ar: 'مستقيم' }] },
            { q: { en: 'Which line is used a lot in Sadu weaving?', ar: 'أي خط يكثر في نسيج السدو؟' }, opts: [{ en: 'zigzag', ar: 'المتعرّج' }, { en: 'curly', ar: 'الملتفّ' }, { en: 'dotted', ar: 'المنقّط' }] }
          ] },
        { id: 'art-8', title: { en: 'Sadu symbols', ar: 'رموز السدو' },
          teach: { en: 'Sadu is a weaving art of Bedouin women in the Gulf. They spin wool from sheep, goats and camels, and weave bold patterns in red, black and white. Rows of triangles can stand for tents or mountains.', ar: 'السدو فن نسيج تصنعه نساء البادية في الخليج. يغزلن الصوف من الأغنام والماعز والإبل، وينسجن نقوشًا واضحة بالأحمر والأسود والأبيض. وقد ترمز صفوف المثلثات إلى الخيام أو الجبال.' },
          hint: { en: 'Think about the desert and the Bedouin tent.', ar: 'فكّر في الصحراء وبيت الشَّعَر.' },
          questions: [
            { q: { en: 'What is Sadu?', ar: 'ما السدو؟' }, opts: [{ en: 'weaving by Bedouin women', ar: 'نسيج تصنعه نساء البادية' }, { en: 'a kind of food', ar: 'نوع من الطعام' }, { en: 'a board game', ar: 'لعبة لوحية' }] },
            { q: { en: 'Where does Sadu wool come from?', ar: 'من أين يأتي صوف السدو؟' }, opts: [{ en: 'sheep, goats and camels', ar: 'الأغنام والماعز والإبل' }, { en: 'trees', ar: 'الأشجار' }, { en: 'plastic bottles', ar: 'زجاجات البلاستيك' }] },
            { q: { en: 'A row of triangles in Sadu can look like…', ar: 'صف المثلثات في السدو قد يشبه…' }, opts: [{ en: 'tents or mountains', ar: 'الخيام أو الجبال' }, { en: 'fish', ar: 'السمك' }, { en: 'clouds', ar: 'الغيوم' }] },
            { q: { en: 'Which colour is used a lot in Sadu?', ar: 'أي لون يكثر في السدو؟' }, opts: [c('red'), c('pink'), c('purple')] }
          ] },
        { id: 'art-9', title: { en: 'Symmetry', ar: 'التماثل' },
          teach: { en: 'A shape is symmetrical when one half is a mirror of the other half, like a butterfly or a heart. The line that splits it into two matching halves is the line of symmetry.', ar: 'يكون الشكل متماثلًا إذا كان نصفه صورة في المرآة لنصفه الآخر، مثل الفراشة أو القلب. والخط الذي يقسمه إلى نصفين متطابقين هو محور التماثل.' },
          hint: { en: 'Imagine folding it in half. Do both halves match?', ar: 'تخيّل أنك طويته من المنتصف. هل يتطابق النصفان؟' },
          questions: [
            { q: { en: 'Which one is symmetrical?', ar: 'أيّها متماثل؟' }, opts: ['🦋', '🐌', '🦒'] },
            { q: { en: 'Which one is symmetrical?', ar: 'أيّها متماثل؟' }, opts: ['❤️', '🔑', '🎺'] },
            { q: { en: 'Which letter is symmetrical?', ar: 'أي حرف متماثل؟' }, opts: ['A', 'F', 'J'] },
            { q: { en: 'What does a line of symmetry do?', ar: 'ماذا يفعل محور التماثل؟' }, opts: [{ en: 'splits a shape into two matching halves', ar: 'يقسم الشكل إلى نصفين متطابقين' }, { en: 'colours the shape', ar: 'يلوّن الشكل' }, { en: 'makes the shape bigger', ar: 'يكبّر الشكل' }] }
          ] },
        { id: 'art-10', title: { en: 'Opposite colours', ar: 'الألوان المتقابلة' },
          teach: { en: 'On a colour wheel, opposite colours sit across from each other: red and green, blue and orange, yellow and purple. Side by side they look extra bright!', ar: 'في دائرة الألوان تقع الألوان المتقابلة مقابل بعضها: الأحمر والأخضر، والأزرق والبرتقالي، والأصفر والبنفسجي. وعندما تتجاور تبدو زاهية جدًّا!' },
          hint: { en: 'Remember the pairs: red–green, blue–orange, yellow–purple.', ar: 'تذكّر الأزواج: أحمر وأخضر، أزرق وبرتقالي، أصفر وبنفسجي.' },
          questions: [
            { q: { en: 'What is the opposite of red?', ar: 'ما اللون المقابل للأحمر؟' }, opts: [c('green'), c('pink'), c('orange')] },
            { q: { en: 'What is the opposite of blue?', ar: 'ما اللون المقابل للأزرق؟' }, opts: [c('orange'), c('purple'), c('green')] },
            { q: { en: 'What is the opposite of yellow?', ar: 'ما اللون المقابل للأصفر؟' }, opts: [c('purple'), c('orange'), c('red')] },
            { q: { en: 'Opposite colours side by side look…', ar: 'الألوان المتقابلة عندما تتجاور تبدو…' }, opts: [{ en: 'extra bright', ar: 'زاهية جدًّا' }, { en: 'invisible', ar: 'غير مرئية' }, { en: 'exactly the same', ar: 'متشابهة تمامًا' }] }
          ] },
        { id: 'art-11', title: { en: 'Drawing feelings', ar: 'رسم المشاعر' },
          teach: { en: 'Artists show feelings with faces: a smile for happy, a down-turned mouth and tears for sad, frowning eyebrows for angry, and a round open mouth for surprised.', ar: 'يعبّر الفنانون عن المشاعر بالوجوه: الابتسامة للفرح، والفم المقلوب والدموع للحزن، والحاجبان المقطّبان للغضب، والفم المفتوح المستدير للدهشة.' },
          hint: { en: 'Look at the mouth and the eyebrows.', ar: 'انظر إلى الفم والحاجبين.' },
          questions: [
            { q: { en: 'How does this face feel?', ar: 'بماذا يشعر هذا الوجه؟' }, show: '😀', opts: [{ en: 'happy', ar: 'سعيد' }, { en: 'sad', ar: 'حزين' }, { en: 'angry', ar: 'غاضب' }] },
            { q: { en: 'How does this face feel?', ar: 'بماذا يشعر هذا الوجه؟' }, show: '😢', opts: [{ en: 'sad', ar: 'حزين' }, { en: 'happy', ar: 'سعيد' }, { en: 'surprised', ar: 'مندهش' }] },
            { q: { en: 'How does this face feel?', ar: 'بماذا يشعر هذا الوجه؟' }, show: '😠', opts: [{ en: 'angry', ar: 'غاضب' }, { en: 'surprised', ar: 'مندهش' }, { en: 'happy', ar: 'سعيد' }] },
            { q: { en: 'How does this face feel?', ar: 'بماذا يشعر هذا الوجه؟' }, show: '😮', opts: [{ en: 'surprised', ar: 'مندهش' }, { en: 'angry', ar: 'غاضب' }, { en: 'sad', ar: 'حزين' }] }
          ] },
        { id: 'art-12', title: { en: 'Textures', ar: 'الملمس' },
          teach: { en: 'Texture is how something feels: a teddy is soft, a cactus is prickly, a rock is rough and an egg is smooth. Artists show texture with lines and dots.', ar: 'الملمس هو كيف نشعر بالشيء عند لمسه: الدبدوب ناعم، والصبّار شائك، والصخرة خشنة، والبيضة ملساء. ويرسم الفنانون الملمس بالخطوط والنقاط.' },
          hint: { en: 'Imagine touching it gently with your finger.', ar: 'تخيّل أنك تلمسه بإصبعك بلطف.' },
          questions: [
            { q: { en: 'How does it feel to touch?', ar: 'كيف ملمسه؟' }, show: '🧸', opts: [{ en: 'soft', ar: 'ناعم' }, { en: 'prickly', ar: 'شائك' }, { en: 'rough', ar: 'خشن' }] },
            { q: { en: 'How does it feel to touch?', ar: 'كيف ملمسه؟' }, show: '🌵', opts: [{ en: 'prickly', ar: 'شائك' }, { en: 'soft', ar: 'ناعم' }, { en: 'smooth', ar: 'أملس' }] },
            { q: { en: 'How does it feel to touch?', ar: 'كيف ملمسه؟' }, show: '🪨', opts: [{ en: 'rough', ar: 'خشن' }, { en: 'soft', ar: 'ناعم' }, { en: 'smooth', ar: 'أملس' }] },
            { q: { en: 'How does it feel to touch?', ar: 'كيف ملمسه؟' }, show: '🥚', opts: [{ en: 'smooth', ar: 'أملس' }, { en: 'prickly', ar: 'شائك' }, { en: 'rough', ar: 'خشن' }] }
          ] },
        { id: 'art-13', title: { en: 'Geometric patterns', ar: 'الزخارف الهندسية' },
          teach: { en: 'Islamic art is famous for geometric patterns: stars and shapes that repeat again and again. They are drawn with a ruler and a compass and decorate tiles, doors and mosques.', ar: 'يشتهر الفن الإسلامي بالزخارف الهندسية: نجوم وأشكال تتكرّر مرة بعد مرة. تُرسم بالمسطرة والفرجار، وتزيّن البلاط والأبواب والمساجد.' },
          hint: { en: 'Think of the patterns on tiles and doors.', ar: 'فكّر في الزخارف على البلاط والأبواب.' },
          questions: [
            { q: { en: 'Geometric patterns are made of…', ar: 'تتكوّن الزخارف الهندسية من…' }, opts: [{ en: 'shapes that repeat', ar: 'أشكال تتكرّر' }, { en: 'random scribbles', ar: 'خربشات عشوائية' }, { en: 'photos', ar: 'صور فوتوغرافية' }] },
            { q: { en: 'Which shape is very common in these patterns?', ar: 'أي شكل يكثر في هذه الزخارف؟' }, opts: ['⭐', '🐟', '🌧️'] },
            { q: { en: 'Which tools help draw them?', ar: 'أي أدوات تساعد على رسمها؟' }, opts: [{ en: 'a ruler and a compass', ar: 'المسطرة والفرجار' }, { en: 'a spoon and a fork', ar: 'الملعقة والشوكة' }, { en: 'a ball', ar: 'الكرة' }] },
            { q: { en: 'Where can you see these patterns?', ar: 'أين ترى هذه الزخارف؟' }, opts: [{ en: 'on tiles, doors and mosques', ar: 'على البلاط والأبواب والمساجد' }, { en: 'only in the sea', ar: 'في البحر فقط' }, { en: 'on clouds', ar: 'على الغيوم' }] }
          ] },
        { id: 'art-14', title: { en: 'Colour feelings', ar: 'مشاعر الألوان' },
          teach: { en: 'Colours can make us feel things. Blue feels calm like the sea, yellow feels happy like the sun, green feels fresh like plants, and red feels hot and strong like fire.', ar: 'للألوان مشاعر: الأزرق هادئ مثل البحر، والأصفر مبهج مثل الشمس، والأخضر منعش مثل النبات، والأحمر حارّ وقوي مثل النار.' },
          hint: { en: 'Think of where you see that colour in nature.', ar: 'فكّر أين ترى هذا اللون في الطبيعة.' },
          questions: [
            { q: { en: 'Which colour feels calm like the sea?', ar: 'أي لون هادئ مثل البحر؟' }, opts: [c('blue'), c('red'), c('orange')] },
            { q: { en: 'Which colour feels happy like a sunny day?', ar: 'أي لون مبهج مثل يوم مشمس؟' }, opts: [c('yellow'), c('navy'), c('grey')] },
            { q: { en: 'Which colour feels fresh like plants?', ar: 'أي لون منعش مثل النبات؟' }, opts: [c('green'), c('red'), c('black')] },
            { q: { en: 'Which colour feels hot and strong like fire?', ar: 'أي لون حارّ وقوي مثل النار؟' }, opts: [c('red'), c('blue'), c('white')] }
          ] },
        { id: 'art-15', title: { en: 'Gulf crafts', ar: 'الحرف الخليجية' },
          teach: { en: 'The Gulf has beautiful traditional crafts: Sadu weaving with wool, pottery made from clay, wooden dhow boats, and henna patterns drawn on hands.', ar: 'في الخليج حرف تقليدية جميلة: نسيج السدو من الصوف، والفخّار من الطين، والسفن الخشبية (المحامل)، ونقوش الحنّاء على الأيدي.' },
          hint: { en: 'Think about what each thing is made from.', ar: 'فكّر في المادة التي يُصنع منها كل شيء.' },
          questions: [
            { q: { en: 'What is a dhow boat made of?', ar: 'من أي مادة تُصنع السفينة الخشبية (المحمل)؟' }, opts: [{ en: 'wood', ar: 'الخشب' }, { en: 'glass', ar: 'الزجاج' }, { en: 'paper', ar: 'الورق' }] },
            { q: { en: 'What are pots made from?', ar: 'من أي مادة يُصنع الفخّار؟' }, opts: [{ en: 'clay', ar: 'الطين' }, { en: 'wool', ar: 'الصوف' }, { en: 'sand only', ar: 'الرمل فقط' }] },
            { q: { en: 'Where are henna patterns drawn?', ar: 'أين تُرسم نقوش الحنّاء؟' }, opts: [{ en: 'on hands', ar: 'على الأيدي' }, { en: 'on walls', ar: 'على الجدران' }, { en: 'on boats', ar: 'على السفن' }] },
            { q: { en: 'How is Sadu made?', ar: 'كيف يُصنع السدو؟' }, opts: [{ en: 'by weaving wool', ar: 'بنسج الصوف' }, { en: 'by baking clay', ar: 'بشيّ الطين' }, { en: 'by carving wood', ar: 'بنحت الخشب' }] }
          ] }
      ]
    }
  ];

  // Level of each lesson: 1 Starter, 2 Explorer, 3 Champion. Lessons are shown by level on the course page.
  var LEVELS = {
    'phonics-1': 1, 'phonics-2': 1, 'phonics-3': 1, 'phonics-8': 2, 'phonics-4': 2, 'phonics-5': 3, 'phonics-9': 3,
    'phonics-11': 2, 'phonics-12': 3, 'phonics-13': 3,
    'phonics-6': 1, 'phonics-10': 2, 'phonics-7': 3, 'phonics-14': 1, 'phonics-15': 2, 'phonics-16': 2, 'phonics-17': 2, 'phonics-18': 2, 'phonics-19': 3, 'phonics-20': 3,
    'math-1': 1, 'math-2': 1, 'math-6': 1, 'math-4': 2, 'math-5': 2, 'math-7': 2, 'math-8': 2, 'math-3': 3, 'math-9': 3, 'math-10': 3,
    'science-1': 1, 'science-5': 1, 'science-2': 2, 'science-6': 2, 'science-4': 2, 'science-3': 3,
    'math-11': 1, 'math-13': 1, 'math-12': 2, 'math-14': 2, 'math-15': 3,
    'science-14': 1, 'science-15': 1, 'science-11': 2, 'science-12': 2, 'science-13': 3,
    'science-7': 1, 'science-8': 1, 'science-9': 2, 'science-10': 3,
    'english-11': 1, 'english-12': 1, 'english-13': 2, 'english-14': 3, 'english-15': 3,
    'arabic-11': 1, 'arabic-12': 1, 'arabic-13': 2, 'arabic-14': 3, 'arabic-15': 3,
    'english-7': 1, 'english-8': 1, 'english-9': 2, 'english-10': 3,
    'english-1': 1, 'english-6': 1, 'english-2': 2, 'english-3': 2, 'english-4': 3, 'english-5': 3,
    'arabic-1': 1, 'arabic-6': 1, 'arabic-3': 2, 'arabic-2': 2, 'arabic-4': 3, 'arabic-5': 3,
    'arabic-7': 1, 'arabic-8': 1, 'arabic-9': 2, 'arabic-10': 3,
    'art-7': 1, 'art-8': 2, 'art-9': 2, 'art-10': 3,
    'art-11': 1, 'art-12': 1, 'art-13': 2, 'art-14': 2, 'art-15': 3,
    'phonics-21': 2, 'phonics-23': 2, 'phonics-22': 3, 'phonics-24': 3, 'phonics-25': 3,
    'phonics-26': 2, 'phonics-29': 2, 'phonics-27': 3, 'phonics-28': 3, 'phonics-30': 3,
    'art-1': 1, 'art-4': 1, 'art-6': 1, 'art-2': 2, 'art-5': 2, 'art-3': 3
  };
  window.SADU_COURSES.forEach(function (c) { c.lessons.forEach(function (l) { l.level = l.level || LEVELS[l.id] || 1; }); });
})();
