/* Sadu site: the stories shown on learn.html (Story time).
   Every text is written twice: { en: 'English', ar: 'عربي' }.

   A story has: id, sticker (won when the story's questions are finished), title, color (strong), tint (light), pages and questions.
   A page has:
     bg     the sky: 'day', 'dusk', 'night' or 'sea'
     props  the picture, as [name, x, y, size] on a 400 × 240 stage. Names are the drawings in
            learn.html (p-dunes, p-sun, p-moon, p-stars, p-palm, p-tent, p-camel, p-well, p-pool, p-bird,
            p-sea, p-boat, p-fish, p-shell, p-girl, p-grandpa, p-saqr, p-grandma, p-turtle, p-net, p-sprout, p-cloud, p-date). A fifth item 'flip'
            turns the drawing to face the other way.
     text   what the page says (read aloud by Saqr)
   Questions use the same format as js/courses.js: the FIRST answer is the right one. */
(function () {
  'use strict';

  var GROUND = ['dunes', 0, 150, 400];

  window.SADU_STORIES = [
    {
      id: 'saqr-flies', sticker: '🦅', title: { en: 'Saqr Learns to Fly', ar: 'صقر يتعلّم الطيران' },
      color: '#FFC93C', tint: '#FFE9A8',
      ages: [3, 8], pages: [
        { bg: 'day', props: [['sun', 310, 18, 60], GROUND, ['tent', 40, 110, 120], ['saqr', 220, 130, 80]],
          text: { en: 'Saqr was a young falcon. He lived near a tent in the desert. He wanted to fly high over the dunes, but his wings were still small.',
            ar: 'كان صقر فرخًا صغيرًا يعيش قرب خيمة في الصحراء. كان يحلم أن يطير عاليًا فوق الكثبان، لكن جناحيه كانا ما يزالان صغيرين.' } },
        { bg: 'day', props: [['sun', 40, 18, 56], GROUND, ['saqr', 170, 150, 70, 'fall']],
          text: { en: 'Saqr flapped and jumped, and bump! He landed in the soft sand. He tried again, and again he fell.',
            ar: 'رفرف صقر وقفز، ثم… بُم! وقع على الرمل الناعم. حاول مرة أخرى، ووقع مرة أخرى.' } },
        { bg: 'dusk', props: [GROUND, ['grandma', 90, 92, 110], ['saqr', 230, 128, 76, 'flip']],
          text: { en: 'Grandma Falcon smiled. "Nobody flies on the first day," she said. "Try a little every day, and your wings will grow strong."',
            ar: 'ابتسمت الجدّة الصقرة وقالت: «لا أحد يطير من أول يوم. تدرّب قليلًا كل يوم، وسيقوى جناحاك.»' } },
        { bg: 'day', props: [['sun', 330, 16, 52], GROUND, ['palm', 250, 92, 110], ['palm', 310, 104, 96], ['pool', 250, 186, 130], ['saqr', 90, 30, 80]],
          text: { en: 'Saqr practised every morning. One day the wind lifted him up, up, up! He flew over the dunes all the way to the green oasis.',
            ar: 'تدرّب صقر كل صباح. وفي يوم من الأيام رفعته الريح إلى أعلى، وأعلى، وأعلى! فطار فوق الكثبان حتى وصل إلى الواحة الخضراء.' } }
      ],
      questions: [
        { q: { en: 'What could Saqr not do at first?', ar: 'ماذا لم يكن صقر يستطيع أن يفعل في البداية؟' },
          opts: [{ en: 'fly', ar: 'يطير' }, { en: 'swim', ar: 'يسبح' }, { en: 'read', ar: 'يقرأ' }] },
        { q: { en: 'What did Grandma Falcon tell him?', ar: 'ماذا قالت له الجدّة الصقرة؟' },
          opts: [{ en: 'Try a little every day', ar: 'تدرّب قليلًا كل يوم' }, { en: 'Stop trying', ar: 'توقّف عن المحاولة' }, { en: 'Sleep all day', ar: 'نَم طوال اليوم' }] },
        { q: { en: 'Where did Saqr fly at the end?', ar: 'إلى أين طار صقر في النهاية؟' },
          opts: [{ en: 'to the oasis', ar: 'إلى الواحة' }, { en: 'to the sea', ar: 'إلى البحر' }, { en: 'to the city', ar: 'إلى المدينة' }] }
      ]
    },
    {
      id: 'nouf-water', sticker: '🐫', title: { en: 'Nouf Finds Water', ar: 'نوف تجد الماء' },
      color: '#2ED3A6', tint: '#B9F3E2',
      ages: [3, 8], pages: [
        { bg: 'day', props: [['sun', 300, 14, 70], GROUND, ['camel', 120, 96, 150]],
          text: { en: 'Nouf the camel walked across the hot desert. The sun was strong, and Nouf was very thirsty.',
            ar: 'كانت الناقة نوف تمشي في الصحراء الحارّة. كانت الشمس قوية، وكانت نوف عطشى جدًّا.' } },
        { bg: 'day', props: [['sun', 40, 14, 56], GROUND, ['well', 230, 120, 100], ['camel', 60, 96, 150]],
          text: { en: 'She went to the old well, but it was empty. Not one drop of water!',
            ar: 'ذهبت إلى البئر القديمة، لكنها كانت فارغة. ولا قطرة ماء!' } },
        { bg: 'day', props: [GROUND, ['bird', 230, 30, 40], ['bird', 280, 50, 34], ['bird', 320, 24, 30], ['camel', 70, 96, 150]],
          text: { en: 'Then Nouf saw birds flying together. "Birds know where water is," she thought. So she followed them.',
            ar: 'ثم رأت نوف طيورًا تطير معًا. فقالت في نفسها: «الطيور تعرف مكان الماء.» فمشت خلفها.' } },
        { bg: 'day', props: [GROUND, ['palm', 20, 80, 120], ['palm', 300, 86, 110], ['pool', 150, 180, 150], ['bird', 200, 30, 32], ['camel', 110, 96, 150]],
          text: { en: 'The birds led her to an oasis with a cool pool and tall palm trees. Nouf drank, then called her friends to share the water.',
            ar: 'قادتها الطيور إلى واحة فيها بركة باردة ونخيل طويل. شربت نوف، ثم نادت صديقاتها ليشربن معها.' } }
      ],
      questions: [
        { q: { en: 'Why could the old well not help Nouf?', ar: 'لماذا لم تساعد البئر القديمة نوف؟' },
          opts: [{ en: 'It was empty', ar: 'كانت فارغة' }, { en: 'It was too deep', ar: 'كانت عميقة جدًّا' }, { en: 'It was too far away', ar: 'كانت بعيدة جدًّا' }] },
        { q: { en: 'What helped Nouf find water?', ar: 'ما الذي ساعد نوف على إيجاد الماء؟' },
          opts: [{ en: 'the birds', ar: 'الطيور' }, { en: 'the moon', ar: 'القمر' }, { en: 'a map', ar: 'خريطة' }] },
        { q: { en: 'What did Nouf do after she drank?', ar: 'ماذا فعلت نوف بعد أن شربت؟' },
          opts: [{ en: 'She shared the water with her friends', ar: 'شاركت صديقاتها الماء' }, { en: 'She went to sleep', ar: 'نامت' }, { en: 'She hid the water', ar: 'خبّأت الماء' }] }
      ]
    },
    {
      id: 'pearl-boat', sticker: '🦪', title: { en: 'The Pearl Boat', ar: 'سفينة اللؤلؤ' },
      color: '#3FA9F5', tint: '#C4E4FC',
      ages: [3, 8], pages: [
        { bg: 'sea', props: [['sun', 320, 14, 56], ['sea', 0, 150, 400], ['boat', 110, 70, 190], ['grandpa', 128, 128, 60], ['girl', 232, 142, 44]],
          text: { en: 'Mariam sailed out to sea with her grandfather in his wooden boat. "Long ago," Grandpa said, "divers looked for pearls here."',
            ar: 'أبحرت مريم مع جدّها في قاربه الخشبي. قال الجدّ: «قديمًا كان الغوّاصون يبحثون عن اللؤلؤ هنا.»' } },
        { bg: 'sea', props: [['sea', 0, 110, 400], ['fish', 70, 170, 50], ['fish', 180, 196, 44, 'flip'], ['fish', 290, 166, 52]],
          text: { en: 'Mariam looked into the clear water. She counted the fish: one, two, three!',
            ar: 'نظرت مريم في الماء الصافي، وعدّت السمك: واحد، اثنان، ثلاثة!' } },
        { bg: 'sea', props: [['sea', 0, 120, 400], ['grandpa', 60, 40, 90], ['shell', 200, 120, 110], ['fish', 330, 190, 40, 'flip']],
          text: { en: 'Grandpa pulled up a shell. He opened it carefully, and inside was a small, shiny pearl.',
            ar: 'رفع الجدّ صَدَفة، وفتحها بحذر، فوجد في داخلها لؤلؤة صغيرة لامعة.' } },
        { bg: 'night', props: [['stars', 0, 0, 400], ['moon', 300, 18, 60], ['sea', 0, 150, 400], ['boat', 90, 70, 190], ['grandpa', 108, 128, 60], ['girl', 212, 142, 44]],
          text: { en: 'They sailed home under the moon. Mariam held the pearl and smiled. "The sea keeps many treasures," she said.',
            ar: 'عادا إلى البيت تحت ضوء القمر. أمسكت مريم اللؤلؤة وابتسمت وقالت: «البحر يحفظ كنوزًا كثيرة.»' } }
      ],
      questions: [
        { q: { en: 'Who sailed with Mariam?', ar: 'مع من أبحرت مريم؟' },
          opts: [{ en: 'her grandfather', ar: 'جدّها' }, { en: 'her teacher', ar: 'معلّمتها' }, { en: 'a falcon', ar: 'صقر' }] },
        { q: { en: 'How many fish did Mariam count?', ar: 'كم سمكة عدّت مريم؟' }, opts: ['3', '5', '1'] },
        { q: { en: 'What was inside the shell?', ar: 'ماذا كان داخل الصَّدَفة؟' },
          opts: [{ en: 'a pearl', ar: 'لؤلؤة' }, { en: 'a fish', ar: 'سمكة' }, { en: 'sand', ar: 'رمل' }] }
      ]
    },
    {
      id: 'kind-turtle', sticker: '🐢', title: { en: 'The Kind Turtle Rescue', ar: 'إنقاذ السلحفاة' },
      color: '#3E8E4A', tint: '#CFEFD2',
      ages: [3, 8], pages: [
        { bg: 'sea', props: [['sun', 320, 14, 54], ['sea', 0, 150, 400], ['saqr', 150, 30, 70]],
          text: { en: 'One morning Saqr flew over the beach. The sea was blue and calm. Then he heard a small, sad sound.',
            ar: 'في صباح أحد الأيام طار صقر فوق الشاطئ. كان البحر أزرق هادئًا. ثم سمع صوتًا صغيرًا حزينًا.' } },
        { bg: 'sea', props: [['sea', 0, 150, 400], ['turtle', 140, 118, 110], ['net', 135, 108, 120], ['saqr', 290, 60, 64, 'flip']],
          text: { en: 'A sea turtle was caught in an old fishing net. She could not swim! "Hold on," said Saqr. "I will get help."',
            ar: 'كانت سلحفاة بحرية عالقة في شبكة صيد قديمة، ولم تستطع أن تسبح! قال صقر: «اصبري، سأحضر المساعدة.»' } },
        { bg: 'sea', props: [['sea', 0, 160, 400], ['grandpa', 50, 92, 100], ['girl', 160, 116, 76], ['turtle', 250, 130, 100]],
          text: { en: 'Mariam and Grandpa came running. Gently, slowly, they untied the net. "We must be careful," said Grandpa. "She is frightened."',
            ar: 'جاءت مريم وجدّها مسرعَين، وفكّا الشبكة بلطف وببطء. قال الجدّ: «يجب أن نكون حذرين، فهي خائفة.»' } },
        { bg: 'dusk', props: [['sea', 0, 140, 400], ['turtle', 250, 150, 80], ['girl', 70, 110, 76], ['saqr', 170, 40, 60]],
          text: { en: 'The turtle swam back into the sea. Mariam picked up the old net. "Let\'s keep our beach clean," she said, "so the sea animals stay safe."',
            ar: 'سبحت السلحفاة عائدة إلى البحر. وأخذت مريم الشبكة القديمة وقالت: «لنحافظ على نظافة شاطئنا، لتبقى حيوانات البحر آمنة.»' } }
      ],
      questions: [
        { q: { en: 'What was the turtle caught in?', ar: 'بماذا علقت السلحفاة؟' },
          opts: [{ en: 'an old fishing net', ar: 'شبكة صيد قديمة' }, { en: 'a tree', ar: 'شجرة' }, { en: 'a boat', ar: 'قارب' }] },
        { q: { en: 'How did Mariam and Grandpa untie the net?', ar: 'كيف فكّت مريم وجدّها الشبكة؟' },
          opts: [{ en: 'gently and slowly', ar: 'بلطف وببطء' }, { en: 'very fast', ar: 'بسرعة كبيرة' }, { en: 'they did not', ar: 'لم يفكّاها' }] },
        { q: { en: 'How can we help sea animals?', ar: 'كيف نساعد حيوانات البحر؟' },
          opts: [{ en: 'keep the beach clean', ar: 'نحافظ على نظافة الشاطئ' }, { en: 'leave nets on the sand', ar: 'نترك الشباك على الرمل' }, { en: 'make loud noise', ar: 'نصدر ضجيجًا عاليًا' }] }
      ]
    },
    {
      id: 'counting-stars', sticker: '⭐', title: { en: 'Counting Stars', ar: 'نعدّ النجوم' },
      color: '#7B5CD6', tint: '#E2D9FF',
      ages: [3, 8], pages: [
        { bg: 'dusk', props: [GROUND, ['tent', 50, 104, 120], ['grandpa', 200, 104, 90], ['girl', 290, 120, 70]],
          text: { en: 'Mariam and Grandpa camped in the desert. The sun went down, and the sky turned orange, then purple.',
            ar: 'خيّمت مريم وجدّها في الصحراء. غابت الشمس، وصارت السماء برتقالية ثم بنفسجية.' } },
        { bg: 'night', props: [['stars', 0, 0, 400], ['moon', 40, 16, 56], GROUND, ['girl', 180, 120, 70]],
          text: { en: '"Look!" said Mariam. "One, two stars!" Then three more stars came out. "Now I see five!"',
            ar: 'قالت مريم: «انظر! نجمة، نجمتان!» ثم ظهرت ثلاث نجوم أخرى. «الآن أرى خمس نجوم!»' } },
        { bg: 'night', props: [['stars', 0, 0, 400], GROUND, ['grandpa', 90, 104, 90], ['girl', 200, 120, 70], ['camel', 280, 110, 100]],
          text: { en: 'Grandpa pointed to one very bright star. "Long ago, travellers with camels used that star to find their way at night."',
            ar: 'أشار الجدّ إلى نجمة ساطعة جدًّا وقال: «قديمًا كان المسافرون مع الإبل يهتدون بتلك النجمة ليعرفوا طريقهم في الليل.»' } },
        { bg: 'night', props: [['stars', 0, 0, 400], ['moon', 320, 18, 60], GROUND, ['tent', 140, 104, 120]],
          text: { en: 'Mariam fell asleep in the tent, counting stars in her dreams. There were too many to count!',
            ar: 'نامت مريم في الخيمة وهي تعدّ النجوم في أحلامها. كانت كثيرة جدًّا لا يمكن عدّها!' } }
      ],
      questions: [
        { q: { en: 'Mariam saw 2 stars, then 3 more. How many stars?', ar: 'رأت مريم نجمتين، ثم 3 نجوم أخرى. كم نجمة؟' }, opts: ['5', '4', '6'] },
        { q: { en: 'What did travellers use the bright star for?', ar: 'لماذا استخدم المسافرون النجمة الساطعة؟' },
          opts: [{ en: 'to find their way', ar: 'ليعرفوا طريقهم' }, { en: 'to cook food', ar: 'ليطبخوا الطعام' }, { en: 'to sleep', ar: 'لكي يناموا' }] },
        { q: { en: 'When do we see the stars?', ar: 'متى نرى النجوم؟' },
          opts: [{ en: 'at night', ar: 'في الليل' }, { en: 'at noon', ar: 'في الظهر' }, { en: 'never', ar: 'أبدًا' }] }
      ]
    },
    {
      id: 'date-seed', sticker: '🌴', title: { en: 'The Little Date Seed', ar: 'نواة التمر الصغيرة' },
      color: '#6CC04A', tint: '#DDF5CF',
      ages: [3, 8], pages: [
        { bg: 'day', props: [['sun', 320, 14, 56], GROUND, ['palm', 40, 70, 130], ['girl', 200, 120, 76], ['date', 280, 150, 30]],
          text: { en: 'Mariam ate a sweet date under the old palm tree. In her hand was the little seed. "Can this seed grow?" she asked.',
            ar: 'أكلت مريم تمرة حلوة تحت النخلة القديمة. وكانت في يدها نواة صغيرة. فسألت: «هل يمكن أن تنمو هذه النواة؟»' } },
        { bg: 'day', props: [['cloud', 150, 10, 100], GROUND, ['girl', 90, 120, 76], ['sprout', 230, 150, 40]],
          text: { en: 'She planted the seed in the soil and gave it water every day. The sun warmed it. One morning, a tiny green sprout came up!',
            ar: 'زرعت النواة في التراب وسقتها كل يوم، ودفّأتها الشمس. وفي صباح أحد الأيام ظهر برعم أخضر صغير!' } },
        { bg: 'day', props: [['sun', 30, 14, 56], GROUND, ['palm', 210, 110, 80], ['girl', 110, 120, 76]],
          text: { en: 'The sprout needed water, sun and time. Mariam waited and cared for it. Season after season, it grew taller.',
            ar: 'احتاج البرعم إلى الماء والشمس والوقت. انتظرت مريم واعتنت به. وفصلًا بعد فصل صار أطول.' } },
        { bg: 'dusk', props: [GROUND, ['palm', 150, 40, 170], ['date', 205, 110, 26], ['date', 230, 106, 26], ['girl', 70, 116, 80], ['grandpa', 300, 104, 90]],
          text: { en: 'Years later it was a tall palm tree full of dates. Mariam shared them with Grandpa. "It all started with one little seed," she smiled.',
            ar: 'بعد سنوات صارت نخلة طويلة مليئة بالتمر. شاركت مريم التمر مع جدّها وقالت مبتسمة: «بدأ كل شيء بنواة صغيرة واحدة.»' } }
      ],
      questions: [
        { q: { en: 'What did Mariam plant?', ar: 'ماذا زرعت مريم؟' },
          opts: [{ en: 'a date seed', ar: 'نواة تمر' }, { en: 'a shell', ar: 'صدفة' }, { en: 'a star', ar: 'نجمة' }] },
        { q: { en: 'What does a plant need to grow?', ar: 'ماذا يحتاج النبات لينمو؟' },
          opts: [{ en: 'water, sun and time', ar: 'الماء والشمس والوقت' }, { en: 'only toys', ar: 'الألعاب فقط' }, { en: 'darkness and no water', ar: 'الظلام ولا ماء' }] },
        { q: { en: 'What grew from the seed?', ar: 'ماذا نما من النواة؟' },
          opts: [{ en: 'a palm tree', ar: 'نخلة' }, { en: 'a camel', ar: 'جمل' }, { en: 'a boat', ar: 'قارب' }] }
      ]
    }
  ];
})();
