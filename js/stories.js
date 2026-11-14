/* Sadu site: the stories shown on learn.html (Story time).
   Every text is written twice: { en: 'English', ar: 'عربي' }.

   A story has: id, title, color (strong), tint (light), pages and questions.
   A page has:
     bg     the sky: 'day', 'dusk', 'night' or 'sea'
     props  the picture, as [name, x, y, size] on a 400 × 240 stage. Names are the drawings in
            learn.html (p-dunes, p-sun, p-moon, p-stars, p-palm, p-tent, p-camel, p-well, p-pool, p-bird,
            p-sea, p-boat, p-fish, p-shell, p-girl, p-grandpa, p-saqr, p-grandma). A fifth item 'flip'
            turns the drawing to face the other way.
     text   what the page says (read aloud by Saqr)
   Questions use the same format as js/courses.js: the FIRST answer is the right one. */
(function () {
  'use strict';

  var GROUND = ['dunes', 0, 150, 400];

  window.SADU_STORIES = [
    {
      id: 'saqr-flies', title: { en: 'Saqr Learns to Fly', ar: 'صقر يتعلّم الطيران' },
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
      id: 'nouf-water', title: { en: 'Nouf Finds Water', ar: 'نوف تجد الماء' },
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
      id: 'pearl-boat', title: { en: 'The Pearl Boat', ar: 'سفينة اللؤلؤ' },
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
    }
  ];
})();
