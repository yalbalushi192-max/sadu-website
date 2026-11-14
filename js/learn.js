/* Sadu site: logic for learn.html (dashboard, courses, lessons and the family report).
   The page is English by default and Arabic with learn.html?lang=ar.
   Progress is saved on this device only, in the browser's localStorage. */
(function () {
  'use strict';

  var LANG = new URLSearchParams(location.search).get('lang') === 'ar' ? 'ar' : 'en';
  document.documentElement.lang = LANG;
  document.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr';

  var COURSES = window.SADU_COURSES, COLOURS = window.SADU_COLOURS, STORIES = window.SADU_STORIES || [];
  var PER_LESSON = 4;            // questions in a lesson
  var KEY = 'sadu-progress-v1';  // where progress is kept in localStorage (the first child; others add ':<id>')
  var PROFILES_KEY = 'sadu-profiles-v1';  // the list of children on this device and who is learning now
  var GOLD = '#FFC93C', EMPTY = '#E6DFCF';
  var RING = 113.1;              // length of the progress ring (2 × π × 18)
  var LOCALE = LANG === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB';

  var T = {
    en: {
      docTitle: 'Sadu: my learning', brand: 'Sadu', navHome: 'Home', navReport: 'Family report', navGames: 'Games', langLabel: 'العربية',
      savedHere: 'Progress is saved on this device only.',
      hello: 'Welcome back, %N', helloAnon: 'Welcome to Sadu', homeIntro: 'Short, playful lessons. Learn one idea, then answer four questions.',
      continueLabel: 'Continue learning', startLabel: 'Start here', reviewLabel: 'Practise again',
      lessonOf: 'Lesson %A of %B', lessonMeta: '4 questions · about 3 minutes', startLesson: 'Start lesson', resumeLesson: 'Play again',
      thisWeek: 'This week', streak: 'day streak', streakHint: 'Finish a lesson each day to keep your streak going.',
      sLessons: 'lessons done', sStars: 'stars won', sMinutes: 'minutes learning', sCourses: 'courses started',
      homeTitle: 'Your courses', coursesCount: '%A courses · %B lessons',
      ctaStart: 'Start course', ctaContinue: 'Continue', ctaReview: 'Review',
      xOfY: '%A of %B lessons', rStarsOf: '%A of %B stars',
      back: 'Home', notStarted: 'Not started', doneOn: 'Last played %D', upNext: 'Up next',
      start: 'Start', again: 'Play again', learn: 'Learn', listen: 'Listen to the lesson podcast', startQuiz: 'Start the questions', qOf: 'Question %A of %B',
      yes: 'Yes, that is right!', no: 'Not this one. Try again.', keysHint: 'Tip: press 1, 2 or 3 to answer, then Enter.',
      next: 'Next question', finish: 'Finish lesson',
      doneTitle: 'Lesson finished!', earned: 'You won %A of 3 stars.', firstTry: 'right first time', timeTaken: 'time', starsLabel: 'stars',
      nextLesson: 'Next lesson', backCourse: 'Back to the course', backHome: 'Back to home', tryAgain: 'Try again',
      gamesTitle: 'Play break', gamesText: 'Falcon Flight, Letter Catch, Souq Dash and weaving.', gamesBtn: 'Open the games',
      rTitle: 'Family report', rIntro: 'Everything your child has done on this device. Nothing is sent anywhere.',
      rName: 'Child\'s name', rNamePh: 'Type a name', rDate: 'Report date: %D',
      rLessons: 'lessons done', rStars: 'stars won', rMinutes: 'minutes learning', rLast: 'last played', never: 'not yet',
      rBySubject: 'Progress by subject', rPractice: 'Worth practising again', rNoPractice: 'Nothing to repeat right now.',
      rRecent: 'Recent activity', rNoRecent: 'No lessons finished yet. The report fills in after the first lesson.',
      rStrong: 'Strongest subject so far: %S.', rLine: '%C: %L', rStarsShort: '%A of 3 stars', rNew: 'not started',
      print: 'Print the report', reset: 'Reset progress', sure: 'Delete all saved progress on this device?', yesReset: 'Yes, delete it', cancel: 'Cancel',
      planTitle: 'Learning plan', planIntro: 'Built from your child\'s answers: where they are strong, where they need practice, and what to do next.',
      planEmpty: 'Finish a few lessons and the plan will show strengths and areas to work on.',
      planFocus: 'Focus this week: %S.', planAllGood: 'No weak areas right now. Keep learning new lessons.', planSee: 'See the full plan',
      lvStrong: 'Strong', lvBuilding: 'Building', lvWeak: 'Needs practice', lvNew: 'Not started', and: ' and ',
      stRedo: 'Practise again: %L', stRedoWhy: '%C · %A of 4 right first time last time.', stMissed: 'Missed:',
      stLearn: 'Learn next: %L', stLearnWhy: '%C · builds the same skills a step further.',
      stTry: 'Try %C: %L', stTryWhy: 'Not started yet. One lesson shows how your child does here.',
      stKeep: 'Keep going: %L', stKeepWhy: '%C is a strong subject. Keep moving forward.',
      tipTitle: 'At home: %C', planGo: 'Start', planNext: 'Your next steps', planLevels: 'Strengths and weaknesses',
      photoLabel: 'Your child\'s photo', photoAdd: 'Add a photo', photoChange: 'Change photo', photoRemove: 'Remove photo',
      photoNote: 'The photo stays on this device only. It is never uploaded.', wellDone: 'Well done, %N!',
      guide: 'Saqr', listenBtn: 'Listen', readOn: 'Read aloud is on', readOff: 'Read aloud is off', hintWord: 'Hint:',
      gStart: 'Hi%N! I am Saqr, your learning friend. Let\'s start with %L!',
      gFocus: 'Hi%N! Let\'s practise %S today. Every try makes you stronger.',
      gGood: 'Hi%N! You are doing great. Ready for something new?',
      gTeach: 'Let\'s learn: %L! Listen, then answer four questions.', gIdle: 'Which one is right? Take your time.',
      cheers: ['Great job!', 'You got it!', 'Brilliant!', 'Super!'],
      gDone3: 'Perfect! Three stars!', gDone2: 'Great work! Play again for three stars?', gDone1: 'Good try! Practice makes you stronger.',
      nameJoin: ' ', blank: 'what number', or: ' or ',
      navStories: 'Stories', storiesTitle: 'Story time', storiesIntro: 'Short stories read aloud by Saqr. After each one, answer three questions.',
      readStory: 'Read', readAgain: 'Read again', pageOf: 'Page %A of %B', prevPage: 'Back', nextPage: 'Next page',
      storyQuiz: 'Answer the questions', backStories: 'Back to stories', storyDone: 'Read %A of %B stories', storyQs: 'Questions about the story',
      check: 'Check', clear: 'Start again', basket: 'Basket', tray: 'Dates', dateLabel: 'a date', takeBack: 'take a date out',
      countHint: 'You put %A. Count again: you need %B.', dragTip: 'Drag the dates into the basket, or tap them.',
      traceTip: 'Draw over the grey line.', matchTip: 'Tap one on the left, then its partner on the right.',
      agePick: 'How old is your child?', ageIntro: 'Sadu shows the courses that fit this age first. You can change it at any time.',
      ageChip: 'Age %A', ageChange: 'Change age', ageAll: 'Show all courses', forAge: 'Courses for age %A', allCourses: 'All courses',
      otherAges: 'Courses for other ages', ageNote10: 'Sadu\'s lessons go up to age 10 for now, so all courses are shown.', ageLabel: 'Age',
      whoTitle: 'Who is learning today?', addChild: 'Add a child', addBtn: 'Add', switchChild: 'Switch child', childN: 'Child %A',
      removeChild: 'Remove this child', removeSure: 'Delete this child and all their progress on this device?', yesRemove: 'Yes, remove', profStars: '%A stars', profStar1: '1 star',
      goalTitle: 'Daily goal', goalToday: 'Today: %A of %B', goalDone: 'Goal reached today!', goalPick: 'Lessons a day:', goalHit: 'Daily goal reached! Well done!',
      navStickers: 'Stickers', stickerTitle: 'Sticker book', stickerIntro: 'Finish a lesson or a story to win its sticker. Three stars make it gold!',
      stickerCount: '%A of %B stickers', newSticker: 'New sticker!', openStickers: 'Open the sticker book', stickerLocked: 'Not won yet', goldSticker: 'gold',
      soundOn: 'Sound effects are on', soundOff: 'Sound effects are off', tapSaqr: 'Tap Saqr for a fun fact',
      fun: ['Did you know? A falcon can see a rabbit from more than a kilometre away!', 'Camels can drink a whole bathtub of water in a few minutes!',
        'A palm tree can live for more than 100 years.', 'Bees dance to tell their friends where the flowers are!',
        'The Moon has no light of its own. It shines with sunlight.', 'Octopuses have three hearts!', 'You are a star learner. Let\'s play!']
    },
    ar: {
      docTitle: 'سدو: تعلّمي', brand: 'سدو', navHome: 'الرئيسية', navReport: 'تقرير الأسرة', navGames: 'الألعاب', langLabel: 'English',
      savedHere: 'يُحفظ التقدّم على هذا الجهاز فقط.',
      hello: 'أهلًا بعودتك يا %N', helloAnon: 'أهلًا بك في سدو', homeIntro: 'دروس قصيرة وممتعة. تعلّم فكرة واحدة، ثم أجب عن أربعة أسئلة.',
      continueLabel: 'تابع التعلّم', startLabel: 'ابدأ من هنا', reviewLabel: 'تدرّب مرة أخرى',
      lessonOf: 'الدرس %A من %B', lessonMeta: '4 أسئلة · نحو 3 دقائق', startLesson: 'ابدأ الدرس', resumeLesson: 'العب مرة أخرى',
      thisWeek: 'هذا الأسبوع', streak: 'أيام متتالية', streakHint: 'أنهِ درسًا كل يوم لتستمر سلسلتك.',
      sLessons: 'دروس مكتملة', sStars: 'نجوم', sMinutes: 'دقائق تعلّم', sCourses: 'دورات بدأت',
      homeTitle: 'دوراتك', coursesCount: '%A دورات · %B درسًا',
      ctaStart: 'ابدأ الدورة', ctaContinue: 'تابع', ctaReview: 'راجع',
      xOfY: '%A من %B دروس', rStarsOf: '%A من %B نجمة',
      back: 'الرئيسية', notStarted: 'لم يبدأ بعد', doneOn: 'آخر لعب %D', upNext: 'التالي',
      start: 'ابدأ', again: 'العب مرة أخرى', learn: 'تعلَّم', listen: 'استمع إلى بودكاست الدرس', startQuiz: 'ابدأ الأسئلة', qOf: 'السؤال %A من %B',
      yes: 'أحسنت، إجابة صحيحة!', no: 'ليست هذه. حاول مرة أخرى.', keysHint: 'تلميح: اضغط 1 أو 2 أو 3 للإجابة، ثم Enter.',
      next: 'السؤال التالي', finish: 'أنهِ الدرس',
      doneTitle: 'اكتمل الدرس!', earned: 'حصلت على %A من 3 نجوم.', firstTry: 'صحيحة من أول مرة', timeTaken: 'الوقت', starsLabel: 'نجوم',
      nextLesson: 'الدرس التالي', backCourse: 'العودة إلى الدورة', backHome: 'العودة إلى الرئيسية', tryAgain: 'حاول مرة أخرى',
      gamesTitle: 'استراحة لعب', gamesText: 'رحلة الصقر، التقط الحرف، سباق السوق، والنسيج.', gamesBtn: 'افتح الألعاب',
      rTitle: 'تقرير الأسرة', rIntro: 'كل ما أنجزه طفلك على هذا الجهاز. لا تُرسَل أي بيانات إلى أي مكان.',
      rName: 'اسم الطفل', rNamePh: 'اكتب الاسم', rDate: 'تاريخ التقرير: %D',
      rLessons: 'دروس مكتملة', rStars: 'نجوم', rMinutes: 'دقائق تعلّم', rLast: 'آخر لعب', never: 'لم يبدأ بعد',
      rBySubject: 'التقدّم في كل مادة', rPractice: 'دروس تستحق الإعادة', rNoPractice: 'لا شيء يحتاج إلى إعادة الآن.',
      rRecent: 'آخر الأنشطة', rNoRecent: 'لم يكتمل أي درس بعد. يمتلئ التقرير بعد أول درس.',
      rStrong: 'أقوى مادة حتى الآن: %S.', rLine: '%C: %L', rStarsShort: '%A من 3 نجوم', rNew: 'لم يبدأ',
      print: 'اطبع التقرير', reset: 'امسح التقدّم', sure: 'هل تريد حذف كل التقدّم المحفوظ على هذا الجهاز؟', yesReset: 'نعم، احذفه', cancel: 'إلغاء',
      planTitle: 'خطة التعلّم', planIntro: 'مبنية على إجابات طفلك: أين هو قوي، وأين يحتاج إلى تدريب، وماذا يفعل بعد ذلك.',
      planEmpty: 'أنهِ بعض الدروس وستُظهر الخطة نقاط القوة والجوانب التي تحتاج إلى تدريب.',
      planFocus: 'التركيز هذا الأسبوع: %S.', planAllGood: 'لا توجد نقاط ضعف الآن. تابع تعلّم دروس جديدة.', planSee: 'اعرض الخطة كاملة',
      lvStrong: 'قوي', lvBuilding: 'يتحسّن', lvWeak: 'يحتاج إلى تدريب', lvNew: 'لم يبدأ', and: ' و',
      stRedo: 'تدرّب مرة أخرى: %L', stRedoWhy: '%C · %A من 4 صحيحة من أول مرة في آخر محاولة.', stMissed: 'أخطأ في:',
      stLearn: 'تعلّم بعد ذلك: %L', stLearnWhy: '%C · يقوّي المهارات نفسها خطوة أخرى.',
      stTry: 'جرّب %C: %L', stTryWhy: 'لم تبدأ بعد. درس واحد يكشف مستوى طفلك فيها.',
      stKeep: 'استمر: %L', stKeepWhy: '%C مادة قوية. تابع التقدّم.',
      tipTitle: 'في البيت: %C', planGo: 'ابدأ', planNext: 'خطواتك التالية', planLevels: 'نقاط القوة والضعف',
      photoLabel: 'صورة طفلك', photoAdd: 'أضف صورة', photoChange: 'غيّر الصورة', photoRemove: 'احذف الصورة',
      photoNote: 'تبقى الصورة على هذا الجهاز فقط، ولا تُرفع إلى أي مكان.', wellDone: 'أحسنت يا %N!',
      guide: 'صقر', listenBtn: 'استمع', readOn: 'القراءة بصوت عالٍ تعمل', readOff: 'القراءة بصوت عالٍ متوقفة', hintWord: 'تلميح:',
      gStart: 'مرحبًا%N! أنا صقر، صديقك في التعلّم. هيا نبدأ بدرس %L!',
      gFocus: 'مرحبًا%N! هيا نتدرّب اليوم على %S. كل محاولة تجعلك أقوى.',
      gGood: 'مرحبًا%N! أنت رائع. هل أنت مستعد لشيء جديد؟',
      gTeach: 'هيا نتعلّم: %L! استمع، ثم أجب عن أربعة أسئلة.', gIdle: 'أيّها الصحيح؟ خذ وقتك.',
      cheers: ['أحسنت!', 'رائع!', 'ممتاز!', 'عمل جميل!'],
      gDone3: 'ممتاز! ثلاث نجوم!', gDone2: 'عمل رائع! العب مرة أخرى لتحصل على ثلاث نجوم؟', gDone1: 'محاولة جيدة! التدريب يجعلك أقوى.',
      nameJoin: ' يا ', blank: 'كم', or: ' أو ',
      navStories: 'القصص', storiesTitle: 'وقت القصة', storiesIntro: 'قصص قصيرة يقرؤها صقر بصوت عالٍ. بعد كل قصة أجب عن ثلاثة أسئلة.',
      readStory: 'اقرأ', readAgain: 'اقرأ مرة أخرى', pageOf: 'الصفحة %A من %B', prevPage: 'السابقة', nextPage: 'الصفحة التالية',
      storyQuiz: 'أجب عن الأسئلة', backStories: 'العودة إلى القصص', storyDone: 'قرأت %A من %B قصص', storyQs: 'أسئلة عن القصة',
      check: 'تحقّق', clear: 'ابدأ من جديد', basket: 'السلة', tray: 'التمر', dateLabel: 'تمرة', takeBack: 'أخرج تمرة',
      countHint: 'وضعت %A. عُدّ مرة أخرى: تحتاج إلى %B.', dragTip: 'اسحب التمرات إلى السلة، أو اضغط عليها.',
      traceTip: 'ارسم فوق الخط الرمادي.', matchTip: 'اضغط على عنصر من اليمين، ثم على ما يناسبه من اليسار.',
      agePick: 'كم عمر طفلك؟', ageIntro: 'يعرض سدو أولًا الدورات المناسبة لهذا العمر. يمكنك تغييره في أي وقت.',
      ageChip: 'العمر %A', ageChange: 'غيّر العمر', ageAll: 'اعرض كل الدورات', forAge: 'دورات لعمر %A', allCourses: 'كل الدورات',
      otherAges: 'دورات لأعمار أخرى', ageNote10: 'دروس سدو حاليًا حتى عمر 10 سنوات، لذلك تظهر كل الدورات.', ageLabel: 'العمر',
      whoTitle: 'من سيتعلّم اليوم؟', addChild: 'أضف طفلًا', addBtn: 'أضف', switchChild: 'بدّل الطفل', childN: 'طفل %A',
      removeChild: 'احذف هذا الطفل', removeSure: 'هل تريد حذف هذا الطفل وكل تقدّمه على هذا الجهاز؟', yesRemove: 'نعم، احذف', profStars: '%A نجمة', profStar1: 'نجمة واحدة',
      goalTitle: 'هدف اليوم', goalToday: 'اليوم: %A من %B', goalDone: 'حقّقت هدف اليوم!', goalPick: 'دروس في اليوم:', goalHit: 'حقّقت هدف اليوم! أحسنت!',
      navStickers: 'الملصقات', stickerTitle: 'دفتر الملصقات', stickerIntro: 'أنهِ درسًا أو قصة لتربح ملصقها. ثلاث نجوم تجعله ذهبيًا!',
      stickerCount: '%A من %B ملصقًا', newSticker: 'ملصق جديد!', openStickers: 'افتح دفتر الملصقات', stickerLocked: 'لم تربحه بعد', goldSticker: 'ذهبي',
      soundOn: 'المؤثرات الصوتية تعمل', soundOff: 'المؤثرات الصوتية متوقفة', tapSaqr: 'اضغط على صقر ليخبرك بمعلومة ممتعة',
      fun: ['هل تعلم؟ الصقر يرى الأرنب من مسافة أكثر من كيلومتر!', 'الجمل يستطيع أن يشرب حوض استحمام كاملًا من الماء في دقائق!',
        'النخلة قد تعيش أكثر من 100 سنة.', 'النحل يرقص ليخبر أصدقاءه بمكان الأزهار!',
        'القمر ليس له ضوء خاص به، بل يلمع بضوء الشمس.', 'للأخطبوط ثلاثة قلوب!', 'أنت نجم في التعلّم. هيا نلعب!']
    }
  }[LANG];
  document.title = T.docTitle;

  function tx(v) { return v == null ? '' : typeof v === 'string' ? v : v[LANG]; }
  function fill(str, map) { return str.replace(/%([A-Z])/g, function (m, k) { return map[k] != null ? String(map[k]) : m; }); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function stars(n) { return [0, 1, 2].map(function (i) { return { fill: i < n ? GOLD : EMPTY }; }); }
  function day(ms) {
    try { return new Date(ms).toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch (e) { return new Date(ms).toDateString(); }
  }
  function longDay(ms) {
    try { return new Date(ms).toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' }); }
    catch (e) { return new Date(ms).toDateString(); }
  }
  function weekday(d) {
    try { return d.toLocaleDateString(LOCALE, { weekday: 'narrow' }); } catch (e) { return ''; }
  }
  // a calendar day on this device, like 2026-11-15
  function dayKey(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function clock(sec) { return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }

  // ---- child profiles ----
  function keyFor(id) { return id === 'p1' ? KEY : KEY + ':' + id; }
  function loadProfiles() {
    try { var p = JSON.parse(localStorage.getItem(PROFILES_KEY)); if (p && p.list && p.list.length) return p; } catch (e) {}
    return { active: 'p1', list: [{ id: 'p1' }] };
  }
  function saveProfiles() { try { localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); } catch (e) {} }
  function peek(id) { try { return JSON.parse(localStorage.getItem(keyFor(id))) || {}; } catch (e) { return {}; } }
  var profiles = loadProfiles();

  function load() {
    try { var d = JSON.parse(localStorage.getItem(keyFor(profiles.active))); if (d && d.lessons) { d.days = d.days || {}; d.stories = d.stories || {}; return d; } } catch (e) {}
    return { name: '', lessons: {}, seconds: 0, days: {}, stories: {} };
  }
  function save(d) { try { localStorage.setItem(keyFor(profiles.active), JSON.stringify(d)); } catch (e) {} }

  // ---- read aloud, with the voices installed on the device ----
  var SPEECH = 'speechSynthesis' in window;
  function voiceFor(lang) {
    var vs = SPEECH ? speechSynthesis.getVoices() : [], want = lang === 'ar' ? 'ar-SA' : 'en-GB';
    return vs.filter(function (v) { return v.lang.replace('_', '-') === want; })[0] ||
      vs.filter(function (v) { return v.lang.toLowerCase().indexOf(lang) === 0; })[0] || null;
  }
  function canSpeak() { return SPEECH && !!voiceFor(LANG); }
  // speaks each part in turn; a part with Arabic letters uses an Arabic voice, any other an English one
  function speak(parts) {
    if (!SPEECH) return;
    speechSynthesis.cancel();
    parts.filter(Boolean).forEach(function (text) {
      var lang = /[\u0600-\u06FF]/.test(text) ? 'ar' : /[A-Za-z]/.test(text) ? 'en' : LANG;
      var u = new SpeechSynthesisUtterance(text), v = voiceFor(lang);
      if (v) u.voice = v;
      u.lang = v ? v.lang : (lang === 'ar' ? 'ar-SA' : 'en-GB');
      u.rate = 0.9;
      speechSynthesis.speak(u);
    });
  }
  function hush() { if (SPEECH) speechSynthesis.cancel(); }

  // ---- sound effects: short tones made with the Web Audio API ----
  var soundOn = true, audio = null;
  function tone(f, t0, dur, type, vol) {
    var o = audio.createOscillator(), g = audio.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(audio.destination); o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function sfx(name) {
    if (window.__sfxLog) window.__sfxLog.push(name);
    if (!soundOn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      var t = audio.currentTime + 0.01;
      if (name === 'tap') tone(660, t, 0.07, 'sine', 0.07);
      else if (name === 'pop') { tone(880, t, 0.06, 'triangle', 0.12); tone(1320, t + 0.05, 0.07, 'triangle', 0.08); }
      else if (name === 'right') [523.25, 659.25, 783.99].forEach(function (f, i) { tone(f, t + i * 0.08, 0.2, 'triangle', 0.14); });
      else if (name === 'wrong') { tone(330, t, 0.13, 'sine', 0.12); tone(247, t + 0.11, 0.2, 'sine', 0.12); }
      else if (name === 'done') [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, t + i * 0.12, i === 3 ? 0.6 : 0.18, 'triangle', 0.15); });
    } catch (e) {}
  }

  // ---- confetti: a canvas over the page; nothing moves for people who ask for less motion ----
  var fxCanvas = null, bits = [], fxLoop = null;
  var FX_COLOURS = ['#FFC93C', '#B3261E', '#2ED3A6', '#3FA9F5', '#FF6FA8', '#B9A8FF', '#FF7A45'];
  function burst(el, n) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!fxCanvas) {
      fxCanvas = document.createElement('canvas'); fxCanvas.className = 'fx'; fxCanvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(fxCanvas);
    }
    var dpr = window.devicePixelRatio || 1;
    fxCanvas.width = innerWidth * dpr; fxCanvas.height = innerHeight * dpr;
    var r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    var x = r ? r.left + r.width / 2 : innerWidth / 2, y = r ? r.top + r.height / 2 : innerHeight * 0.3;
    for (var i = 0; i < n; i++) bits.push({ x: x, y: y, vx: (Math.random() - 0.5) * (r ? 9 : 16), vy: -Math.random() * (r ? 9 : 14) - 3,
      life: 50 + Math.random() * 50, c: FX_COLOURS[i % FX_COLOURS.length], s: 5 + Math.random() * 6, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4, star: Math.random() < 0.35 });
    if (!fxLoop) fxLoop = requestAnimationFrame(stepFx);
  }
  function stepFx() {
    var g = fxCanvas.getContext('2d'), dpr = window.devicePixelRatio || 1;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, innerWidth, innerHeight);
    bits = bits.filter(function (b) { return b.life > 0 && b.y < innerHeight + 40; });
    bits.forEach(function (b) {
      b.vy += 0.3; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.a += b.va; b.life -= 1;
      g.save(); g.translate(b.x, b.y); g.rotate(b.a); g.globalAlpha = Math.min(1, b.life / 20); g.fillStyle = b.c;
      if (b.star) { g.beginPath(); for (var k = 0; k < 10; k++) { var rr = k % 2 ? b.s * 0.45 : b.s; g.lineTo(Math.cos(k * Math.PI / 5) * rr, Math.sin(k * Math.PI / 5) * rr); } g.fill(); }
      else g.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
      g.restore();
    });
    fxLoop = bits.length ? requestAnimationFrame(stepFx) : null;
    if (!fxLoop) g.clearRect(0, 0, innerWidth, innerHeight);
  }
  // a sum like "7 + ? = 12" is read as "7 + what number = 12"; shapes like ▲ are not read (that would give the answer away)
  function spoken(show) {
    // letters to blend ("c · a · t") are not read either: blending them is the child's job
    if (!show || !/[0-9A-Za-z\u0600-\u06FF]/.test(show) || show.indexOf('·') !== -1) return '';
    return show.replace(/(^|\s)\?(\s|$)/g, '$1' + T.blank + '$2');
  }
  function orList(items) { return items.length < 2 ? items.join('') : items.slice(0, -1).join(', ') + T.or + items[items.length - 1]; }

  // turns a chosen picture into a small square JPEG (256 × 256) so it fits in localStorage
  function readPhoto(file, done) {
    var url = URL.createObjectURL(file), img = new Image();
    img.onload = function () {
      var side = Math.min(img.naturalWidth, img.naturalHeight), c = document.createElement('canvas');
      c.width = c.height = 256;
      c.getContext('2d').drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, 256, 256);
      URL.revokeObjectURL(url);
      done(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = function () { URL.revokeObjectURL(url); done(null); };
    img.src = url;
  }

  // a story picture: each prop is [name, x, y, size, 'flip' or 'fall']; drawings are square except the wide ones
  var WIDE = { dunes: 0.25, sea: 0.25, stars: 0.6 };
  function scene(page) {
    return {
      sky: 'url(#sky-' + page.bg + ')',
      props: page.props.map(function (p) {
        var w = p[3], h = w * (WIDE[p[0]] || 1), mode = p[4] || '';
        var tf = mode === 'flip' ? 'translate(' + (2 * p[1] + w) + ' 0) scale(-1 1)' : mode === 'fall' ? 'rotate(35 ' + (p[1] + w / 2) + ' ' + (p[2] + h / 2) + ')' : '';
        return { href: '#p-' + p[0], x: String(p[1]), y: String(p[2]), w: String(w), h: String(h), tf: tf };
      })
    };
  }

  // ---- stickers: one per lesson (from the course's list) and one per story ----
  function stickerOf(ci, li) { var st = COURSES[ci].stickers; return st && st.length ? st[li % st.length] : '⭐'; }

  // ---- age: which courses suit the child (age 0 or unset = show everything) ----
  function fitsAge(c, age) { return !age || age > 10 || !c.ages || (age >= c.ages[0] && age <= c.ages[1]); }

  // ---- activities ----
  function freshAct(q) { return q && q.kind === 'count' ? { placed: 0, tried: -1 } : q && q.kind === 'match' ? { sel: -1, side: '', done: [], badL: -1, badR: -1 } : {}; }
  function prepQ(q, lessonHint) {
    var out = { kind: q.kind || 'choice', q: q.q, show: q.show, say: q.say, gloss: q.gloss, seq: q.seq, hint: q.hint || lessonHint,
      n: q.n, outline: !!q.outline, pairs: q.pairs,
      opts: shuffle((q.opts || []).map(function (o, i) { return { o: o, right: i === 0 }; })) };
    if (q.kind === 'match') {
      var idx = q.pairs.map(function (x, i) { return i; });
      out.lefts = shuffle(idx.slice()); out.rights = shuffle(idx.slice());
    }
    return out;
  }
  // tracing: the guide is drawn on a 300 × 300 canvas; shapes are drawn as paths, letters with the page font
  var TRACE_FONT = '700 210px "Baloo Bhaijaan 2", "Fredoka", "Tajawal", sans-serif';
  function guidePath(g, glyph) {
    g.beginPath();
    if (glyph === '▲') { g.moveTo(150, 45); g.lineTo(255, 245); g.lineTo(45, 245); g.closePath(); }
    else if (glyph === '■') { g.rect(60, 60, 180, 180); }
    else if (glyph === '●') { g.arc(150, 150, 95, 0, Math.PI * 2); }
    else if (glyph === '◆') { g.moveTo(150, 40); g.lineTo(255, 150); g.lineTo(150, 260); g.lineTo(45, 150); g.closePath(); }
    else return false;
    return true;
  }
  function drawGuide(g, q, colour, width) {
    g.save();
    g.strokeStyle = g.fillStyle = colour; g.lineJoin = g.lineCap = 'round';
    if (guidePath(g, q.show)) { g.lineWidth = width; g.stroke(); }
    else { g.font = TRACE_FONT; g.textAlign = 'center'; g.textBaseline = 'middle'; g.direction = 'rtl'; g.fillText(q.show, 150, 165); }
    g.restore();
  }
  function drawStrokes(g, paths, colour, width) {
    g.save(); g.strokeStyle = colour; g.lineWidth = width; g.lineCap = g.lineJoin = 'round';
    paths.forEach(function (pts) {
      g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
      pts.forEach(function (pt) { g.lineTo(pt[0], pt[1]); });
      if (pts.length === 1) g.lineTo(pts[0][0] + 0.1, pts[0][1]);
      g.stroke();
    });
    g.restore();
  }
  // how much of the guide the child covered, and how much they drew outside it
  function traceScore(q, paths) {
    function layer(fn) { var c = document.createElement('canvas'); c.width = c.height = 300; var g = c.getContext('2d'); fn(g); return g.getImageData(0, 0, 300, 300).data; }
    var guide = layer(function (g) { drawGuide(g, q, '#000', 22); });
    var near = layer(function (g) { drawGuide(g, q, '#000', 50); if (!guidePath(g, q.show)) { g.lineWidth = 16; g.font = TRACE_FONT; g.textAlign = 'center'; g.textBaseline = 'middle'; g.strokeText(q.show, 150, 165); } });
    var ink = layer(function (g) { drawStrokes(g, paths, '#000', 26); });
    var total = 0, covered = 0, drawn = 0, outside = 0;
    for (var y = 0; y < 300; y += 3) for (var x = 0; x < 300; x += 3) {
      var i = (y * 300 + x) * 4 + 3, isG = guide[i] > 100, isI = ink[i] > 100;
      if (isG) { total++; if (isI) covered++; }
      if (isI) { drawn++; if (near[i] < 100) outside++; }
    }
    return { cover: total ? covered / total : 0, outside: drawn ? outside / drawn : 1 };
  }

  // how well a lesson went on its latest play, from 0 to 1 (older saves only have stars)
  function accuracy(rec) { return rec.acc != null ? rec.acc : { 3: 1, 2: 0.75, 1: 0.5 }[rec.stars] || 0; }
  function level(score) { return score == null ? 'new' : score >= 85 ? 'strong' : score >= 60 ? 'building' : 'weak'; }
  var LEVEL_TEXT = { strong: T.lvStrong, building: T.lvBuilding, weak: T.lvWeak, new: T.lvNew };

  function buildPlan(data, views, page) {
    var subjects = COURSES.map(function (c, ci) {
      if (!fitsAge(c, data.age)) return null;
      var played = [], fresh = [];
      c.lessons.forEach(function (l, li) {
        var rec = data.lessons[l.id];
        if (rec) played.push({ li: li, rec: rec, acc: accuracy(rec) }); else fresh.push(li);
      });
      var score = played.length ? Math.round(played.reduce(function (n, p) { return n + p.acc; }, 0) / played.length * 100) : null;
      var lv = level(score);
      return { ci: ci, c: c, played: played, fresh: fresh, score: score, lv: lv,
        view: { name: tx(c.name), color: c.color, score: score == null ? '–' : score + '%', badge: 'badge ' + lv, label: LEVEL_TEXT[lv] } };
    }).filter(Boolean);
    var any = subjects.some(function (s) { return s.played.length; });
    var weak = subjects.filter(function (s) { return s.lv === 'weak' || s.lv === 'building'; })
      .sort(function (a, b) { return a.score - b.score; });
    var steps = [];
    function add(ci, li, title, why, missed) {
      if (steps.some(function (x) { return x.ci === ci && x.li === li; })) return;
      var c = COURSES[ci];
      steps.push({ ci: ci, li: li, color: c.color,
        title: fill(title, { L: tx(c.lessons[li].title), C: tx(c.name) }), why: why,
        missed: missed || [], hasMissed: !!(missed && missed.length),
        go: function () { page.startLesson(ci, li); } });
    }
    // 1. redo the weakest lesson in each weak subject, then 2. learn the next lesson of the weakest subject
    weak.slice(0, 2).forEach(function (s) {
      var worst = s.played.slice().sort(function (a, b) { return a.acc - b.acc || a.rec.when - b.rec.when; })[0];
      if (worst.acc < 1) add(s.ci, worst.li, T.stRedo, fill(T.stRedoWhy, { C: tx(s.c.name), A: worst.rec.firstTry != null ? worst.rec.firstTry : Math.round(worst.acc * 4) }), worst.rec.missed);
    });
    if (weak[0] && weak[0].fresh.length) add(weak[0].ci, weak[0].fresh[0], T.stLearn, fill(T.stLearnWhy, { C: tx(weak[0].c.name) }));
    // 3. try subjects not started yet, 4. keep strong subjects moving
    subjects.filter(function (s) { return s.lv === 'new'; }).forEach(function (s) {
      if (steps.length < 3) add(s.ci, 0, T.stTry, T.stTryWhy);
    });
    subjects.filter(function (s) { return s.lv === 'strong' && s.fresh.length; }).forEach(function (s) {
      if (steps.length < 3) add(s.ci, s.fresh[0], T.stKeep, fill(T.stKeepWhy, { C: tx(s.c.name) }));
    });
    steps = steps.slice(0, 4);
    steps.forEach(function (x, i) { x.num = String(i + 1); });
    var names = weak.slice(0, 2).map(function (s) { return tx(s.c.name); });
    var best = subjects.filter(function (s) { return s.lv === 'strong'; }).sort(function (a, b) { return b.score - a.score; })[0];
    return {
      any: any, none: !any, strongest: best ? tx(best.c.name) : '', focus: names.join(T.and),
      summary: !any ? T.planEmpty : names.length ? fill(T.planFocus, { S: names.join(T.and) }) : T.planAllGood,
      levels: subjects.map(function (s) { return s.view; }),
      steps: steps, short: steps.slice(0, 3), hasSteps: steps.length > 0,
      tips: weak.slice(0, 2).map(function (s) { return { title: fill(T.tipTitle, { C: tx(s.c.name) }), text: tx(s.c.tip) }; }),
      hasTips: weak.length > 0
    };
  }

  class Component extends DCLogic {
    constructor(props) {
      super(props);
      this.state = { view: location.hash === '#report' ? 'report' : profiles.list.length > 1 ? 'who' : 'home', ci: 0, ls: null, data: load(), confirming: false };
      var self = this;
      if (SPEECH) speechSynthesis.addEventListener('voiceschanged', function () { self.setState({}); });
      // keyboard: 1, 2, 3 pick an answer; Enter moves on
      document.addEventListener('keydown', function (e) {
        var k = self._keys;
        if (!k || e.altKey || e.ctrlKey || e.metaKey || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
        if (/^[1-9]$/.test(e.key) && k.opts[+e.key - 1]) { e.preventDefault(); k.opts[+e.key - 1](); }
        else if (e.key === 'Enter' && k.next && !/^(BUTTON|A)$/.test(e.target.tagName)) { e.preventDefault(); k.next(); }
      });
    }

    go(view, extra) {
      hush();
      bits = [];  // confetti stops when the child moves to another page
      this._said = null;
      this.setState(Object.assign({ view: view, confirming: false }, extra || {}));
      window.scrollTo(0, 0);
      var main = document.getElementById('main');
      if (main) main.focus({ preventScroll: true });
    }

    switchTo(id) {
      profiles.active = id; saveProfiles();
      this._trace = null; this._said = null;
      this.go('home', { data: load(), ls: null, saqrN: 0, adding: false, removing: false });
    }

    startStoryQuiz(si) {
      var st = STORIES[si];
      var qs = st.questions.map(function (q) {
        return prepQ(q);
      });
      this.go('lesson', { ls: { story: si, li: 0, step: 'quiz', qs: qs, qi: 0, firstTry: 0, wrong: [], solved: false, t0: Date.now(), earned: 0, secs: 0, missed: [], act: freshAct(qs[0]) } });
    }

    startLesson(ci, li) {
      var lesson = COURSES[ci].lessons[li];
      var raw = lesson.make ? lesson.make() : lesson.questions;
      var qs = raw.map(function (q) {
        return prepQ(q, lesson.hint);
      });
      this.go('lesson', { ci: ci, ls: { li: li, step: 'teach', qs: qs, qi: 0, firstTry: 0, wrong: [], solved: false, t0: Date.now(), earned: 0, secs: 0, missed: [], act: freshAct(qs[0]) } });
    }

    finishLesson() {
      var ls = this.state.ls, n = ls.qs.length, newSticker = '';
      var earned = ls.firstTry === n ? 3 : ls.firstTry === n - 1 ? 2 : 1;
      var secs = Math.min(900, Math.round((Date.now() - ls.t0) / 1000));
      var data = JSON.parse(JSON.stringify(this.state.data));
      if (ls.story != null) {
        var sid = STORIES[ls.story].id, was = data.stories[sid] || { stars: 0 };
        var newSticker = data.stories[sid] ? '' : (STORIES[ls.story].sticker || '⭐');
        data.stories[sid] = { stars: Math.max(was.stars, earned), when: Date.now() };
      } else {
      var lesson = COURSES[this.state.ci].lessons[ls.li];
      var old = data.lessons[lesson.id] || { stars: 0, plays: 0 };
      newSticker = data.lessons[lesson.id] ? '' : stickerOf(this.state.ci, ls.li);
      // acc and missed describe the latest play; the learning plan uses them to find weak spots
      data.lessons[lesson.id] = { stars: Math.max(old.stars, earned), plays: old.plays + 1, when: Date.now(),
        acc: ls.firstTry / n, firstTry: ls.firstTry, missed: ls.missed.slice(0, 4) };
      }
      data.seconds += secs;
      var today = dayKey(new Date()), goal = data.goal || 2, before = data.days[today] || 0;
      data.days[today] = before + 1;
      var goalHit = before < goal && before + 1 >= goal;
      save(data);
      this.setState({ data: data, ls: Object.assign({}, ls, { step: 'done', earned: earned, secs: secs, newSticker: newSticker, goalHit: goalHit }) });
      sfx('done'); burst(null, goalHit ? 260 : 160);
      window.scrollTo(0, 0);
    }

    renderVals() {
      var self = this, s = this.state, data = s.data;
      this._keys = null;
      soundOn = data.sfx !== false;
      var sound = {
        on: soundOn, off: !soundOn, label: soundOn ? T.soundOn : T.soundOff, cls: soundOn ? 'icon-btn on' : 'icon-btn',
        toggle: function () { var d = Object.assign({}, self.state.data, { sfx: !soundOn }); save(d); self.setState({ data: d }); if (!soundOn) sfx('tap'); }
      };
      var out = {
        t: T, sound: sound,
        isHome: s.view === 'home', isCourse: s.view === 'course', isLesson: s.view === 'lesson', isReport: s.view === 'report',
        isStories: s.view === 'stories', isStory: s.view === 'story', storiesOn: s.view === 'stories' || s.view === 'story' ? 'page' : 'false',
        goStories: function () { self.go('stories'); },
        isWho: s.view === 'who', goWho: function () { self.go('who', { adding: false }); },
        isStickers: s.view === 'stickers', stickersOn: s.view === 'stickers' ? 'page' : 'false', goStickers: function () { self.go('stickers'); },
        shellCls: s.view === 'lesson' || s.view === 'story' || s.view === 'who' ? 'shell focus' : 'shell',
        langHref: LANG === 'ar' ? 'learn.html' : 'learn.html?lang=ar',
        siteHref: LANG === 'ar' ? 'ar.html' : 'index.html',
        gamesHref: (LANG === 'ar' ? 'ar.html' : 'index.html') + '#games',
        goHome: function () { self.go('home'); },
        goReport: function () { self.go('report'); },
        homeOn: s.view === 'home' || s.view === 'course' ? 'page' : 'false', reportOn: s.view === 'report' ? 'page' : 'false',
        initial: (data.name || '').trim().charAt(0).toUpperCase() || '★',
        // the child's photo, if one was added; it stays in this browser only
        photo: data.photo || '', hasPhoto: !!data.photo, noPhoto: !data.photo,
        photoBtn: data.photo ? T.photoChange : T.photoAdd,
        setPhoto: function (e) {
          var f = e.target.files && e.target.files[0];
          if (!f || !/^image\//.test(f.type)) return;
          readPhoto(f, function (url) {
            if (!url) return;
            var d = Object.assign({}, self.state.data, { photo: url });
            save(d); self.setState({ data: d });
          });
        },
        removePhoto: function () {
          var d = Object.assign({}, self.state.data); delete d.photo;
          save(d); self.setState({ data: d });
        },
        childName: (data.name || '').trim() || T.helloAnon
      };

      // ---- courses, with saved progress worked in ----
      var doneAll = 0, starsAll = 0, lessonsAll = 0, lastAll = 0, started = 0, flat = [];
      out.courses = COURSES.map(function (c, ci) {
        var done = 0, st = 0, nextIdx = -1;
        var lessons = c.lessons.map(function (l, li) {
          var rec = data.lessons[l.id];
          lessonsAll += 1;
          if (rec) { done += 1; st += rec.stars; if (rec.when > lastAll) lastAll = rec.when; }
          else if (nextIdx === -1) nextIdx = li;
          var row = {
            num: String(li + 1), title: tx(l.title), stars: stars(rec ? rec.stars : 0),
            starsText: fill(T.rStarsShort, { A: rec ? rec.stars : 0 }),
            note: rec ? fill(T.doneOn, { D: day(rec.when) }) : T.lessonMeta,
            reportNote: rec ? fill(T.rStarsShort, { A: rec.stars }) + ' · ' + day(rec.when) : T.rNew,
            btn: rec ? T.again : T.start, done: !!rec,
            start: function () { self.startLesson(ci, li); }
          };
          flat.push({ rec: rec, course: tx(c.name), title: row.title, ci: ci, li: li });
          return row;
        });
        lessons.forEach(function (row, li) {
          row.isNext = li === nextIdx;
          row.state = row.done ? 'step done' : row.isNext ? 'step next' : 'step';
          row.btnCls = row.isNext ? 'btn primary' : 'btn ghost';
        });
        if (done) started += 1;
        doneAll += done; starsAll += st;
        var pct = Math.round((done / c.lessons.length) * 100);
        return {
          name: tx(c.name), age: tx(c.age), color: c.color, tint: c.tint, icon: c.icon, lessons: lessons,
          doneText: fill(T.xOfY, { A: done, B: c.lessons.length }),
          starsText: fill(T.rStarsOf, { A: st, B: c.lessons.length * 3 }),
          pct: pct + '%', pctNum: String(pct), starsNum: st,
          dash: (RING * pct / 100).toFixed(1) + ' ' + RING,
          cta: done === 0 ? T.ctaStart : done === c.lessons.length ? T.ctaReview : T.ctaContinue, fits: fitsAge(c, data.age),
          open: function () { self.go('course', { ci: ci }); }
        };
      });
      out.course = out.courses[s.ci];
      var age = data.age || 0;
      out.coursesFit = out.courses.filter(function (c) { return c.fits; });
      out.coursesOther = out.courses.filter(function (c) { return !c.fits; });
      out.hasOther = out.coursesOther.length > 0;
      out.ageInfo = {
        set: data.age != null, picking: s.agePicker || data.age == null, notPicking: !(s.agePicker || data.age == null),
        chip: age ? fill(T.ageChip, { A: age }) : T.allCourses,
        heading: age && age <= 10 ? fill(T.forAge, { A: age }) : T.homeTitle,
        over10: age > 10,
        open: function () { self.setState({ agePicker: true }); },
        choices: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (a) {
          return { label: String(a), cls: a === age ? 'age-btn on' : 'age-btn', pressed: a === age ? 'true' : 'false',
            set: function () { var d = Object.assign({}, self.state.data, { age: a }); save(d); self.setState({ data: d, agePicker: false }); } };
        }),
        all: function () { var d = Object.assign({}, self.state.data, { age: 0 }); save(d); self.setState({ data: d, agePicker: false }); }
      };
      out.total = { done: String(doneAll), lessons: String(lessonsAll), stars: String(starsAll), starsMax: String(lessonsAll * 3) };

      // ---- dashboard ----
      // next lesson: the course played most recently, then the first course with lessons left, then the weakest lesson
      var played = flat.filter(function (f) { return f.rec; });
      var flatAll = flat;
      flat = flat.filter(function (f) { return fitsAge(COURSES[f.ci], data.age); });
      if (!flat.length) flat = flatAll;
      var latest = played.filter(function (f) { return fitsAge(COURSES[f.ci], data.age); }).slice().sort(function (a, b) { return b.rec.when - a.rec.when; })[0];
      var pick = null, label = T.startLabel;
      if (latest) {
        label = T.continueLabel;
        pick = flat.filter(function (f) { return f.ci === latest.ci && !f.rec; })[0] || flat.filter(function (f) { return !f.rec; })[0];
        if (!pick) { label = T.reviewLabel; pick = played.slice().sort(function (a, b) { return a.rec.stars - b.rec.stars; })[0]; }
      } else {
        pick = flat[0];
      }
      var pc = COURSES[pick.ci];
      var week = [], streak = 0, today = new Date();
      for (var i = 6; i >= 0; i--) {
        var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i), n = data.days[dayKey(d)] || 0;
        week.push({ label: weekday(d), n: String(n), h: Math.max(8, Math.min(100, n * 34)) + '%', cls: i === 0 ? 'wk today' : 'wk', bar: n > 0 ? 'wk-bar on' : 'wk-bar' });
      }
      // a streak still counts today if yesterday was active
      for (var j = data.days[dayKey(today)] ? 0 : 1; j < 3660; j++) {
        if (data.days[dayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - j))]) streak += 1; else break;
      }
      var who = data.name && data.name.trim() ? T.nameJoin + data.name.trim() : '';
      out.speakOk = canSpeak();
      out.dash = {
        date: longDay(Date.now()),
        hello: data.name && data.name.trim() ? fill(T.hello, { N: data.name.trim() }) : T.helloAnon,
        label: label, course: tx(pc.name), color: pc.color, tint: pc.tint, icon: pc.icon,
        title: tx(pc.lessons[pick.li].title),
        of: fill(T.lessonOf, { A: pick.li + 1, B: pc.lessons.length }),
        btn: pick.rec ? T.resumeLesson : T.startLesson,
        start: function () { self.startLesson(pick.ci, pick.li); },
        week: week, streak: String(streak),
        goal: (function () {
          var g = data.goal || 2, n = data.days[dayKey(today)] || 0, pct = Math.min(100, Math.round(n / g * 100));
          return { text: fill(T.goalToday, { A: Math.min(n, g), B: g }), done: n >= g, notDone: n < g, dash: (RING * pct / 100).toFixed(1) + ' ' + RING,
            ringCls: n >= g ? 'ring goal-ring done' : 'ring goal-ring',
            choices: [1, 2, 3].map(function (c) { return { label: String(c), cls: c === g ? 'age-btn sm on' : 'age-btn sm', pressed: c === g ? 'true' : 'false',
              set: function () { var d = Object.assign({}, self.state.data, { goal: c }); save(d); sfx('tap'); self.setState({ data: d }); } }; }) };
        })(),
        minutes: String(Math.round(data.seconds / 60)), started: String(started), courseCount: String(COURSES.length),
        count: fill(T.coursesCount, { A: COURSES.length, B: lessonsAll })
      };

      // ---- learning plan: score each subject, then pick the next steps ----
      out.plan = buildPlan(data, out.courses, self);
      var gText = !played.length ? fill(T.gStart, { N: who, L: out.dash.title })
        : out.plan.focus ? fill(T.gFocus, { N: who, S: out.plan.focus }) : fill(T.gGood, { N: who });
      out.dash.guide = gText;
      var funN = s.saqrN || 0, funText = funN ? T.fun[(funN - 1) % T.fun.length] : '';
      if (funText) out.dash.guide = funText;
      out.dash.saqrCls = funN ? (funN % 2 ? 'saqr cheer' : 'saqr cheer2') : 'saqr';
      out.dash.saqrTap = function (e) { sfx('pop'); burst(e && e.currentTarget, 18); var n = funN + 1; self.setState({ saqrN: n }); if (out.speakOk) speak([T.fun[(n - 1) % T.fun.length]]); };
      out.dash.say = function () { speak([out.dash.guide]); };

      // ---- who is learning ----
      out.who = {
        cards: profiles.list.map(function (pr, i) {
          var d = pr.id === profiles.active ? data : peek(pr.id), st = 0;
          Object.keys(d.lessons || {}).forEach(function (k) { st += d.lessons[k].stars || 0; });
          var nm = (d.name || '').trim() || fill(T.childN, { A: i + 1 });
          return { name: nm, initial: nm.charAt(0).toUpperCase(), photo: d.photo || '', hasPhoto: !!d.photo, noPhoto: !d.photo,
            meta: (st === 1 ? T.profStar1 : fill(T.profStars, { A: st })) + (d.age ? ' · ' + fill(T.ageChip, { A: d.age }) : ''),
            cls: pr.id === profiles.active ? 'who-card on' : 'who-card',
            pick: function () { sfx('pop'); self.switchTo(pr.id); } };
        }),
        adding: !!s.adding, notAdding: !s.adding,
        startAdd: function () { sfx('tap'); self.setState({ adding: true, newAge: 0 }); },
        cancelAdd: function () { self.setState({ adding: false }); },
        ages: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (a) {
          return { label: String(a), cls: a === s.newAge ? 'age-btn on' : 'age-btn', pressed: a === s.newAge ? 'true' : 'false', set: function () { self.setState({ newAge: a }); } };
        }),
        add: function () {
          var el = document.getElementById('new-child'), nm = el ? String(el.value).trim().slice(0, 40) : '';
          var id = 'p' + Date.now().toString(36);
          try { localStorage.setItem(keyFor(id), JSON.stringify({ name: nm, lessons: {}, seconds: 0, days: {}, stories: {}, age: s.newAge || undefined })); } catch (e) {}
          profiles.list.push({ id: id }); if (el) el.value = '';
          self.switchTo(id);
        },
        many: profiles.list.length > 1
      };
      out.r_remove = {
        can: profiles.list.length > 1 && !s.removing, asking: !!s.removing,
        ask: function () { self.setState({ removing: true }); },
        cancel: function () { self.setState({ removing: false }); },
        yes: function () {
          var gone = profiles.active;
          try { localStorage.removeItem(keyFor(gone)); } catch (e) {}
          profiles.list = profiles.list.filter(function (x) { return x.id !== gone; });
          self.switchTo(profiles.list[0].id);
          self.setState({ view: 'who' });
        }
      };

      // ---- stories ----
      var storiesRead = 0;
      out.stories = STORIES.map(function (st, si) {
        var rec = data.stories[st.id];
        if (rec) storiesRead += 1;
        return { title: tx(st.title), color: st.color, tint: st.tint, cover: scene(st.pages[0]),
          stars: stars(rec ? rec.stars : 0), starsText: fill(T.rStarsShort, { A: rec ? rec.stars : 0 }),
          btn: rec ? T.readAgain : T.readStory,
          open: function () { self.go('story', { si: si, page: 0 }); } };
      });
      out.storiesRead = fill(T.storyDone, { A: storiesRead, B: STORIES.length });

      // ---- sticker book ----
      var won = 0, all = 0, recent = [];
      var groups = COURSES.map(function (c, ci) {
        return { name: tx(c.name), color: c.color, items: c.lessons.map(function (l, li) {
          var rec = data.lessons[l.id], em = stickerOf(ci, li);
          all += 1; if (rec) { won += 1; recent.push({ s: em, when: rec.when }); }
          return { s: em, cls: rec ? (rec.stars === 3 ? 'sticker gold' : 'sticker') : 'sticker locked',
            label: tx(l.title) + ' · ' + (rec ? (rec.stars === 3 ? T.goldSticker : fill(T.rStarsShort, { A: rec.stars })) : T.stickerLocked) };
        }) };
      });
      groups.push({ name: T.storiesTitle, color: '#FFC93C', items: STORIES.map(function (st) {
        var rec = data.stories[st.id]; all += 1; if (rec) { won += 1; recent.push({ s: st.sticker, when: rec.when }); }
        return { s: st.sticker || '⭐', cls: rec ? (rec.stars === 3 ? 'sticker gold' : 'sticker') : 'sticker locked',
          label: tx(st.title) + ' · ' + (rec ? fill(T.rStarsShort, { A: rec.stars }) : T.stickerLocked) };
      }) });
      out.stickers = { groups: groups, count: fill(T.stickerCount, { A: won, B: all }), pct: Math.round(won / all * 100) + '%',
        recent: recent.sort(function (a, b) { return b.when - a.when; }).slice(0, 8), hasRecent: recent.length > 0, noRecent: recent.length === 0 };
      if (s.view === 'story') {
        var st = STORIES[s.si], pg = st.pages[s.page], lastPage = s.page === st.pages.length - 1;
        var pageText = tx(pg.text);
        out.story = {
          title: tx(st.title), color: st.color, tint: st.tint, art: scene(pg), text: pageText,
          of: fill(T.pageOf, { A: s.page + 1, B: st.pages.length }),
          dots: st.pages.map(function (x, k) { return { cls: k <= s.page ? 'seg on' : 'seg' }; }),
          hasPrev: s.page > 0, isLast: lastPage, notLast: !lastPage,
          prev: function () { self.setState({ page: s.page - 1 }); },
          next: function () { sfx('tap'); self.setState({ page: s.page + 1 }); },
          quiz: function () { self.startStoryQuiz(s.si); },
          say: function () { speak([pageText]); },
          close: function () { self.go('stories'); },
          auto: data.autoRead !== false, autoOff: data.autoRead === false,
          autoCls: data.autoRead !== false ? 'icon-btn on' : 'icon-btn',
          autoLabel: data.autoRead !== false ? T.readOn : T.readOff,
          toggleAuto: function () {
            var d = Object.assign({}, self.state.data, { autoRead: data.autoRead === false });
            save(d); if (data.autoRead !== false) hush();
            self._said = null; self.setState({ data: d });
          }
        };
        var pageKey = 'story|' + s.si + '|' + s.page;
        if (data.autoRead !== false && out.speakOk && self._said !== pageKey) {
          self._said = pageKey;
          setTimeout(function () { speak([s.page === 0 ? tx(st.title) : '', pageText]); }, 150);
        }
        this._keys = { opts: [], next: lastPage ? out.story.quiz : out.story.next };
      }

      // ---- the lesson being played ----
      var ls = s.ls;
      if (s.view === 'lesson' && ls) {
        var isStoryQuiz = ls.story != null, story = isStoryQuiz ? STORIES[ls.story] : null;
        var lesson = isStoryQuiz ? { id: 'story-' + story.id, title: story.title, teach: '' } : COURSES[s.ci].lessons[ls.li];
        var lessonCount = isStoryQuiz ? 1 : COURSES[s.ci].lessons.length;
        if (isStoryQuiz) out.course = { name: T.storiesTitle, color: story.color, tint: story.tint };
        var q = ls.qs[ls.qi], last = ls.qi === ls.qs.length - 1;
        var seq = (q.seq || []).map(function (name) { return { hex: COLOURS[name].hex, name: COLOURS[name][LANG] }; });
        var filled = ls.step === 'teach' ? 0 : ls.step === 'done' ? ls.qs.length : ls.qi + (ls.solved ? 1 : 0);
        var next = function () {
          if (last) { self.finishLesson(); } else { self.setState({ ls: Object.assign({}, ls, { qi: ls.qi + 1, wrong: [], solved: false, act: freshAct(ls.qs[ls.qi + 1]) }) }); }
        };
        var startQuiz = function () { self.setState({ ls: Object.assign({}, ls, { step: 'quiz' }) }); };
        var auto = data.autoRead !== false;
        var optLabels = q.opts.map(function (o) { return o.o && o.o.colour ? COLOURS[o.o.colour][LANG] : tx(o.o); });
        // answers in the other language (English words on the Arabic page) are read one by one, each with its own voice
        var otherScript = LANG === 'ar' ? /[A-Za-z]/ : /[\u0600-\u06FF]/;
        var answerParts = optLabels.some(function (x) { return otherScript.test(x); }) ? optLabels : [orList(optLabels)];
        // picture answers (emoji) and letter answers to a listening question are not read out: that would give the answer away
        var readAnswers = !q.say && optLabels.every(function (x) { return /[0-9A-Za-z\u0600-\u06FF]/.test(x); });
        var qParts = [tx(q.q), q.say || spoken(q.show), seq.map(function (x) { return x.name; }).join(', ')].concat(readAnswers ? answerParts : []);
        var act = ls.act || {};
        var hint = q.kind === 'count' && act.tried >= 0 ? fill(T.countHint, { A: act.tried, B: q.n }) : tx(q.hint);
        var cheer = T.cheers[ls.qi % T.cheers.length];
        var doneSay = ls.earned === 3 ? T.gDone3 : ls.earned === 2 ? T.gDone2 : T.gDone1;
        var teachIntro = fill(T.gTeach, { L: tx(lesson.title) });
        // what Saqr says now, and what read aloud speaks when it changes
        var sayNow = ls.step === 'teach' ? [teachIntro, tx(lesson.teach)]
          : ls.step === 'done' ? [doneSay]
          : ls.solved ? [cheer] : ls.wrong.length ? [T.no, hint ? T.hintWord + ' ' + hint : ''] : qParts;
        var sayKey = [ls.step, ls.qi, ls.solved, ls.wrong.length, ls.li].join('|');
        if (auto && out.speakOk && sayKey !== self._said) {
          self._said = sayKey;
          setTimeout(function () { speak(sayNow); }, 120);
        }
        out.ls = {
          isTeach: ls.step === 'teach', isQuiz: ls.step === 'quiz', isDone: ls.step === 'done',
          title: tx(lesson.title), teach: tx(lesson.teach),
          of: fill(T.lessonOf, { A: ls.li + 1, B: lessonCount }),
          // the podcast file for this lesson and language, without its ending (see audio/README.md)
          audio: 'audio/' + lesson.id + '-' + LANG,
          audioReady: function (e) { e.target.parentNode.hidden = false; },
          count: ls.step === 'quiz' ? fill(T.qOf, { A: ls.qi + 1, B: ls.qs.length }) : ls.step === 'teach' ? T.learn : '',
          segs: ls.qs.map(function (x, k) { return { cls: k < filled ? 'seg on' : 'seg' }; }),
          prompt: tx(q.q), show: q.show || (q.say && !out.speakOk ? q.say : ''), hasShow: q.kind === 'choice' && (!!q.show || (!!q.say && !out.speakOk)), gloss: tx(q.gloss),
          isChoice: q.kind === 'choice', optsCls: ls.wrong.length || ls.solved ? 'opts' : 'opts fresh', isCount: q.kind === 'count', isTrace: q.kind === 'trace', isMatch: q.kind === 'match',
          hasSay: !!q.say && out.speakOk, sayWord: function () { speak([q.say]); },
          seq: seq, hasSeq: seq.length > 0,
          msg: ls.solved ? cheer : ls.wrong.length ? T.no : q.kind === 'count' ? T.dragTip : q.kind === 'trace' ? T.traceTip : q.kind === 'match' ? T.matchTip : T.gIdle,
          hint: hint, hasHint: !!hint && ls.wrong.length > 0 && !ls.solved,
          guideCls: ls.solved ? 'saqr cheer' : ls.wrong.length ? 'saqr think' : 'saqr',
          teachIntro: teachIntro, doneSay: doneSay,
          sayTeach: function () { speak([teachIntro, tx(lesson.teach)]); },
          sayQuestion: function () { speak(qParts); },
          sayHint: function () { speak([hint]); },
          auto: auto, autoOff: !auto, autoLabel: auto ? T.readOn : T.readOff, autoCls: auto ? 'icon-btn on' : 'icon-btn',
          toggleAuto: function () {
            var d = Object.assign({}, self.state.data, { autoRead: !auto });
            save(d); if (auto) hush();
            self._said = null; self.setState({ data: d });
          },
          fbCls: ls.solved ? 'feedback ok' : ls.wrong.length ? 'feedback bad' : 'feedback',
          solved: ls.solved, nextLabel: last ? T.finish : T.next,
          earnedText: fill(T.earned, { A: ls.earned }), earnedStars: stars(ls.earned),
          newSticker: ls.newSticker || '', hasNewSticker: !!ls.newSticker, goalHit: !!ls.goalHit,
          doneTitle: data.name && data.name.trim() ? fill(T.wellDone, { N: data.name.trim() }) : T.doneTitle,
          firstTry: ls.firstTry + ' / ' + ls.qs.length, time: clock(ls.secs), earnedNum: ls.earned + ' / 3',
          hasNext: !isStoryQuiz && ls.li < lessonCount - 1,
          isLast: !isStoryQuiz && ls.li === lessonCount - 1,
          backLabel: isStoryQuiz ? T.backStories : T.backCourse,
          startQuiz: startQuiz,
          next: next,
          again: function () { self.startLesson(s.ci, ls.li); },
          nextLesson: function () { self.startLesson(s.ci, ls.li + 1); },
          backCourse: function () { self.go(isStoryQuiz ? 'stories' : 'course'); }
        };
        out.ls.opts = q.opts.map(function (opt, k) {
          var isColour = !!(opt.o && opt.o.colour), col = isColour ? COLOURS[opt.o.colour] : null;
          var won = ls.solved && opt.right, missed = ls.wrong.indexOf(k) !== -1, dim = ls.solved && !opt.right;
          return {
            key: String(k + 1),
            label: isColour ? col[LANG] : tx(opt.o), hasSw: isColour, sw: isColour ? col.hex : 'transparent',
            cls: (won ? 'opt right' : missed ? 'opt wrong' + (ls.wrong[ls.wrong.length - 1] === k ? ' last' : '') : dim ? 'opt dim' : 'opt') +
              (!isColour && !/[0-9A-Za-z\u0600-\u06FF]/.test(tx(opt.o)) ? ' pic' : '') +
              // single letters and letters with vowel marks are shown large so the marks are easy to see
              (!isColour && tx(opt.o).length <= 3 && /[A-Za-z\u0600-\u06FF]/.test(tx(opt.o)) ? ' big' : ''),
            dis: ls.solved || missed ? 'true' : 'false',
            tap: function (e) {
              if (ls.solved || ls.wrong.indexOf(k) !== -1) return;
              if (opt.right) {
                sfx('right'); burst(e && e.currentTarget, 40);
                self.setState({ ls: Object.assign({}, ls, { solved: true, firstTry: ls.firstTry + (ls.wrong.length ? 0 : 1) }) });
              } else {
                sfx('wrong');
                var label = q.say ? q.say : q.show ? q.show + (tx(q.gloss) ? ' (' + tx(q.gloss) + ')' : '') : tx(q.q);
                var missed = ls.wrong.length ? ls.missed : ls.missed.concat(label);
                self.setState({ ls: Object.assign({}, ls, { wrong: ls.wrong.concat(k), missed: missed }) });
              }
            }
          };
        });
        // shared by the activities: a wrong try (remembered for the plan) and a right one
        var missLabel = q.kind === 'trace' ? q.show : tx(q.q);
        var tryWrong = function (extra) {
          sfx('wrong');
          var missed = ls.wrong.length ? ls.missed : ls.missed.concat(missLabel);
          self.setState({ ls: Object.assign({}, ls, { wrong: ls.wrong.concat(ls.wrong.length), missed: missed, act: Object.assign({}, act, extra || {}) }) });
        };
        var tryRight = function (extra) {
          sfx('right'); burst(document.querySelector('.basket, canvas.trace, .match'), 50);
          self.setState({ ls: Object.assign({}, ls, { solved: true, firstTry: ls.firstTry + (ls.wrong.length ? 0 : 1), act: Object.assign({}, act, extra || {}) }) });
        };

        if (q.kind === 'count' && ls.step === 'quiz') {
          var total = Math.min(12, q.n + 3), placed = act.placed;
          var place = function () { if (!ls.solved && placed < total) sfx('pop'); if (!ls.solved && placed < total) self.setState({ ls: Object.assign({}, ls, { act: Object.assign({}, act, { placed: placed + 1 }) }) }); };
          var tray = [];
          for (var ti = 0; ti < total - placed; ti++) tray.push({
            // drag a date: it follows the finger; dropped on the basket (or just tapped) it goes in
            down: function (e) {
              if (ls.solved) return;
              var el = e.currentTarget, x0 = e.clientX, y0 = e.clientY, moved = false;
              el.setPointerCapture(e.pointerId); el.classList.add('dragging');
              var move = function (ev) { var dx = ev.clientX - x0, dy = ev.clientY - y0; if (Math.abs(dx) + Math.abs(dy) > 6) moved = true; el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.15)'; };
              var up = function (ev) {
                el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
                el.classList.remove('dragging'); el.style.transform = '';
                var b = document.querySelector('.basket'), r = b && b.getBoundingClientRect();
                var inBasket = r && ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
                if (!moved || inBasket) place();
              };
              el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
            },
            // keyboard: Enter or Space on a date also puts it in
            key: function (e) { if (e.detail === 0) place(); }
          });
          var inBasket = [];
          for (var bi = 0; bi < placed; bi++) inBasket.push({ out: function () { if (!ls.solved) sfx('tap'); if (!ls.solved) self.setState({ ls: Object.assign({}, ls, { act: Object.assign({}, act, { placed: placed - 1 }) }) }); } });
          out.ls.cnt = { tray: tray, basket: inBasket, empty: placed === 0, notSolved: !ls.solved,
            check: function () { if (ls.solved) return; if (placed === q.n) tryRight(); else tryWrong({ tried: placed }); } };
        }

        if (q.kind === 'trace' && ls.step === 'quiz') {
          var tkey = lesson.id + '|' + ls.qi;
          if (!self._trace || self._trace.key !== tkey) self._trace = { key: tkey, paths: [] };
          var tr = self._trace, colour = (out.course && out.course.color) || '#B9A8FF';
          var paint = function () {
            var cv = document.querySelector('canvas.trace'); if (!cv) return;
            var g = cv.getContext('2d'); g.clearRect(0, 0, 300, 300);
            drawGuide(g, q, '#E6DFCF', 22);
            g.save(); g.setLineDash([2, 12]); g.lineCap = 'round'; drawGuide(g, q, '#B9B0A0', 3); g.restore();
            drawStrokes(g, tr.paths, colour, 22);
          };
          setTimeout(function () { if (document.fonts && document.fonts.load) document.fonts.load(TRACE_FONT).then(paint, paint); paint(); }, 0);
          out.ls.trc = {
            notSolved: !ls.solved,
            down: function (e) {
              if (ls.solved) return;
              var cv = e.currentTarget, r = cv.getBoundingClientRect(), k = 300 / r.width;
              var pt = function (ev) { return [(ev.clientX - r.left) * k, (ev.clientY - r.top) * k]; };
              var path = [pt(e)]; tr.paths.push(path); cv.setPointerCapture(e.pointerId); paint();
              var move = function (ev) { path.push(pt(ev)); paint(); };
              var up = function () { cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', up); cv.removeEventListener('pointercancel', up); };
              cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
              e.preventDefault();
            },
            clear: function () { tr.paths = []; paint(); },
            check: function () {
              if (ls.solved) return;
              var sc = traceScore(q, tr.paths);
              if (sc.cover >= 0.6 && sc.outside <= 0.45) tryRight(); else tryWrong();
            }
          };
        }

        if (q.kind === 'match' && ls.step === 'quiz') {
          var matchPick = function (side, i) {
            if (ls.solved || act.done.indexOf(i) !== -1) return;
            if (act.sel === -1 || act.side === side) { sfx('tap'); self.setState({ ls: Object.assign({}, ls, { act: Object.assign({}, act, { sel: i, side: side, badL: -1, badR: -1 }) }) }); return; }
            var l = side === 'L' ? i : act.sel, r = side === 'R' ? i : act.sel;
            if (l === r) {
              var done = act.done.concat(l), reset = { sel: -1, side: '', done: done, badL: -1, badR: -1 };
              if (done.length === q.pairs.length) tryRight(reset);
              else { sfx('pop'); self.setState({ ls: Object.assign({}, ls, { act: Object.assign({}, act, reset) }) }); }
            } else {
              tryWrong({ sel: -1, side: '', badL: l, badR: r });
            }
          };
          var card = function (side) {
            return function (i) {
              var label = tx(q.pairs[i][side === 'L' ? 0 : 1]), isDone = act.done.indexOf(i) !== -1;
              var on = act.sel === i && act.side === side, bad = (side === 'L' ? act.badL : act.badR) === i;
              return { label: label, tap: function () { matchPick(side, i); },
                cls: 'mcard' + (isDone ? ' done' : on ? ' on' : bad ? ' bad' : '') + (/[0-9A-Za-z\u0600-\u06FF]/.test(label) ? '' : ' pic'),
                pressed: on ? 'true' : 'false' };
            };
          };
          out.ls.mtc = { lefts: q.lefts.map(card('L')), rights: q.rights.map(card('R')) };
        }

        if (ls.step === 'quiz') this._keys = { opts: q.kind === 'choice' ? out.ls.opts.map(function (o) { return o.tap; }) : [], next: ls.solved ? next : null };
        else if (ls.step === 'teach') this._keys = { opts: [], next: startQuiz };
      } else {
        out.ls = { isTeach: false, isQuiz: false, isDone: false, segs: [], opts: [] };
      }

      // ---- family report ----
      var practice = played.filter(function (f) { return f.rec.stars < 2; }).map(function (f) {
        return { text: fill(T.rLine, { C: f.course, L: f.title }), note: fill(T.rStarsShort, { A: f.rec.stars }) };
      });
      var recent = played.slice().sort(function (a, b) { return b.rec.when - a.rec.when; }).slice(0, 5).map(function (f) {
        return { text: fill(T.rLine, { C: f.course, L: f.title }), note: day(f.rec.when) + ' · ' + fill(T.rStarsShort, { A: f.rec.stars }) };
      });
      out.r = {
        name: data.name || '',
        date: fill(T.rDate, { D: day(Date.now()) }),
        minutes: String(Math.round(data.seconds / 60)),
        last: lastAll ? day(lastAll) : T.never,
        strong: out.plan.strongest ? fill(T.rStrong, { S: out.plan.strongest }) : '',
        practice: practice, hasPractice: practice.length > 0, noPractice: practice.length === 0,
        recent: recent, hasRecent: recent.length > 0, noRecent: recent.length === 0,
        confirming: s.confirming, notConfirming: !s.confirming,
        // the name is saved as it is typed, without redrawing the page under the keyboard
        setName: function (e) { self.state.data.name = String(e.target.value).slice(0, 40); save(self.state.data); },
        print: function () {
          Array.prototype.forEach.call(document.querySelectorAll('details'), function (d) { d.open = true; });
          window.print();
        },
        askReset: function () { self.setState({ confirming: true }); },
        cancelReset: function () { self.setState({ confirming: false }); },
        doReset: function () {
          try { localStorage.removeItem(keyFor(profiles.active)); } catch (e) {}
          var el = document.getElementById('child-name'); if (el) el.value = '';
          self.setState({ data: load(), confirming: false, ls: null });
        }
      };
      return out;
    }
  }

  startPage(Component, {});
})();
