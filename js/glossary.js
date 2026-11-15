/* Sadu site: tap-a-word meanings (idea from the Jane project; all text written for Sadu).
   Each entry: the word as it appears (lower case; Arabic without ال), and a short child-friendly meaning in both languages.
   Words in lesson explanations, stories and Discover quests get a dotted underline; tapping shows the meaning. */
(function () {
  'use strict';
  var G = [
    // English words
    [['oasis', 'oases'], 'A green place in the desert with water, where palm trees grow.', 'مكان أخضر في الصحراء فيه ماء وينمو فيه النخيل.'],
    [['dune', 'dunes'], 'A hill of sand made by the wind.', 'تلّ من الرمل تصنعه الريح.'],
    [['falcon', 'falcons'], 'A fast bird with sharp eyes. Saqr is a falcon!', 'طائر سريع حادّ البصر. صقر هو صقر!'],
    [['pearl', 'pearls'], 'A small, shiny, round treasure that grows inside some shells.', 'كنز صغير لامع مستدير ينمو داخل بعض الأصداف.'],
    [['coral'], 'Tiny sea animals that build hard, colourful homes under the sea.', 'حيوانات بحرية صغيرة تبني بيوتًا صلبة ملوّنة تحت البحر.'],
    [['reef', 'reefs'], 'A long line of coral under the sea, full of fish.', 'صفّ طويل من المرجان تحت البحر مليء بالأسماك.'],
    [['sandstone'], 'Rock made from sand pressed together over a very long time.', 'صخر مكوّن من رمل تضاغط معًا عبر زمن طويل جدًّا.'],
    [['tomb', 'tombs'], 'A special place where a person was buried long ago.', 'مكان خاص دُفن فيه شخص منذ زمن بعيد.'],
    [['heritage'], 'Special things from the past that we look after for the future.', 'أشياء مميّزة من الماضي نحافظ عليها للمستقبل.'],
    [['unesco'], 'A world group that protects very special places and traditions.', 'منظمة عالمية تحمي الأماكن والتقاليد المميّزة جدًّا.'],
    [['capital'], 'The main city of a country, where its leaders work.', 'المدينة الرئيسية في البلد، حيث يعمل قادته.'],
    [['desert'], 'A very dry land with little rain, often sandy.', 'أرض جافة جدًّا قليلة المطر، رملية غالبًا.'],
    [['oryx'], 'A white desert antelope with long, straight horns.', 'ظبي صحراوي أبيض بقرنين طويلين مستقيمين.'],
    [['planet', 'planets'], 'A big round world that travels around the Sun, like Earth.', 'عالم كبير مستدير يدور حول الشمس، مثل الأرض.'],
    [['season', 'seasons'], 'A part of the year with its own weather: spring, summer, autumn, winter.', 'جزء من السنة له طقسه الخاص: ربيع وصيف وخريف وشتاء.'],
    [['vegetable', 'vegetables'], 'A plant part we eat, like a root, a leaf or a pod.', 'جزء من نبات نأكله، مثل الجذر أو الورقة أو القرن.'],
    [['multiplying', 'multiply'], 'Adding the same number again and again, quickly.', 'جمع العدد نفسه مرة بعد مرة بسرعة.'],
    [['pattern', 'patterns'], 'Things that repeat in the same order.', 'أشياء تتكرّر بالترتيب نفسه.'],
    [['liquid'], 'Something that flows and takes the shape of its cup, like water.', 'شيء يسيل ويأخذ شكل الإناء، مثل الماء.'],
    [['solid'], 'Something hard that keeps its shape, like ice or wood.', 'شيء صلب يحافظ على شكله، مثل الجليد أو الخشب.'],
    [['steam', 'gas'], 'Water so hot that it turns into air you can see.', 'ماء ساخن جدًّا يتحوّل إلى بخار نراه.'],
    [['sprout'], 'A tiny new plant just coming out of a seed.', 'نبتة صغيرة جديدة تخرج من البذرة.'],
    [['seed', 'seeds'], 'A small part of a plant that can grow into a new plant.', 'جزء صغير من النبات يمكن أن ينمو ليصبح نباتًا جديدًا.'],
    [['cardamom'], 'A sweet-smelling spice often added to Arabic coffee.', 'بهار طيّب الرائحة يُضاف غالبًا إلى القهوة العربية.'],
    [['nabataeans'], 'People who lived in Arabia long ago and carved buildings into rock.', 'شعب عاش في جزيرة العرب قديمًا ونحت المباني في الصخر.'],
    [['rawasheen'], 'Carved wooden balconies on old houses in Jeddah.', 'شرفات خشبية منقوشة على البيوت القديمة في جدة.'],
    [['algorithm'], 'A list of steps that tells you exactly what to do.', 'قائمة خطوات تخبرك بالضبط ماذا تفعل.'],
    [['bug'], 'A mistake in a computer program.', 'خطأ في برنامج الحاسوب.'],
    [['loop'], 'Doing the same steps again and again.', 'تكرار الخطوات نفسها مرة بعد مرة.'],
    [['ai'], 'Artificial intelligence: computers that learn from examples.', 'الذكاء الاصطناعي: حواسيب تتعلّم من الأمثلة.'],
    [['mammal', 'mammals'], 'An animal with fur or hair that feeds its babies milk.', 'حيوان له فرو أو شعر ويرضع صغاره الحليب.'],
    [['hatch'], 'To break out of an egg.', 'أن يخرج الصغير من البيضة.'],
    // Arabic words (without ال)
    [['واحة'], 'A green place in the desert with water, where palm trees grow.', 'مكان أخضر في الصحراء فيه ماء وينمو فيه النخيل.'],
    [['كثبان'], 'Hills of sand made by the wind.', 'تلال من الرمل تصنعها الريح.'],
    [['لؤلؤة', 'لؤلؤ'], 'A small, shiny, round treasure that grows inside some shells.', 'كنز صغير لامع مستدير ينمو داخل بعض الأصداف.'],
    [['شعاب', 'مرجان', 'مرجانية'], 'Coral: tiny sea animals that build colourful homes under the sea.', 'المرجان: حيوانات بحرية صغيرة تبني بيوتًا ملوّنة تحت البحر.'],
    [['تراث'], 'Special things from the past that we look after for the future.', 'أشياء مميّزة من الماضي نحافظ عليها للمستقبل.'],
    [['عاصمة'], 'The main city of a country, where its leaders work.', 'المدينة الرئيسية في البلد، حيث يعمل قادته.'],
    [['صحراء'], 'A very dry land with little rain, often sandy.', 'أرض جافة جدًّا قليلة المطر، رملية غالبًا.'],
    [['مهاة', 'مها'], 'The oryx: a white desert antelope with long, straight horns.', 'ظبي صحراوي أبيض بقرنين طويلين مستقيمين.'],
    [['كوكب', 'كواكب'], 'A big round world that travels around the Sun, like Earth.', 'عالم كبير مستدير يدور حول الشمس، مثل الأرض.'],
    [['أنباط'], 'People who lived in Arabia long ago and carved buildings into rock.', 'شعب عاش في جزيرة العرب قديمًا ونحت المباني في الصخر.'],
    [['هيل'], 'Cardamom: a sweet-smelling spice often added to Arabic coffee.', 'بهار طيّب الرائحة يُضاف غالبًا إلى القهوة العربية.'],
    [['برعم'], 'A tiny new plant just coming out of a seed.', 'نبتة صغيرة جديدة تخرج من البذرة.'],
    [['نواة'], 'The seed inside a date that can grow into a palm tree.', 'البذرة داخل التمرة التي يمكن أن تنمو لتصبح نخلة.'],
    [['رواشين'], 'Carved wooden balconies on old houses in Jeddah.', 'شرفات خشبية منقوشة على البيوت القديمة في جدة.'],
    [['خوارزمية'], 'A list of steps that tells you exactly what to do.', 'قائمة خطوات تخبرك بالضبط ماذا تفعل.'],
    [['تكرار'], 'Doing the same steps again and again.', 'تكرار الخطوات نفسها مرة بعد مرة.'],
    [['نمط', 'نقشة'], 'Things that repeat in the same order.', 'أشياء تتكرّر بالترتيب نفسه.'],
    [['صلب', 'صلبة', 'صلبا'], 'Something hard that keeps its shape, like ice or wood.', 'شيء صلب يحافظ على شكله، مثل الجليد أو الخشب.'],
    [['سائل', 'سائلة', 'سائلا'], 'Something that flows and takes the shape of its cup, like water.', 'شيء يسيل ويأخذ شكل الإناء، مثل الماء.'],
    [['غاز', 'غازية', 'غازا'], 'Air-like stuff that spreads out everywhere, like steam.', 'مادة تشبه الهواء تنتشر في كل مكان، مثل البخار.'],
    [['بخار'], 'Water so hot that it turns into air you can see.', 'ماء ساخن جدًّا يتحوّل إلى بخار نراه.'],
    [['يونسكو', 'لليونسكو', 'اليونسكو'], 'A world group that protects very special places and traditions.', 'منظمة عالمية تحمي الأماكن والتقاليد المميّزة جدًّا.']
  ];
  var map = {};
  G.forEach(function (e) { e[0].forEach(function (w) { map[w] = { en: e[1], ar: e[2] }; }); });
  window.SADU_GLOSSARY = map;
})();
