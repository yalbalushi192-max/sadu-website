/* Sadu site: Discover Saudi Arabia (idea inspired by Antura's culture quests; all content written for Sadu).
   A quest has: id, place, emoji, color, pin (x, y in % on the map), stages and cards.
   A stage has: scene (emoji picture), text (read aloud by Saqr), and q (a question; the FIRST answer is right).
   Cards are collected when the quest is finished; topic is one of: place, nature, culture, history. */
(function () {
  'use strict';
  window.SADU_QUESTS = [
    {
      id: 'riyadh', place: { en: 'Riyadh and Diriyah', ar: 'الرياض والدرعية' }, emoji: '🏰', color: '#C98B4E', pin: [50, 50],
      stages: [
        { scene: '🏙️🌴🦅', text: { en: 'Saqr lands in Riyadh, the capital city of Saudi Arabia. Tall towers shine in the sun, and busy roads lead everywhere.', ar: 'يحطّ صقر في الرياض، عاصمة المملكة العربية السعودية. الأبراج العالية تلمع تحت الشمس، والطرق المزدحمة تمتدّ في كل اتجاه.' },
          q: { q: { en: 'What is the capital city of Saudi Arabia?', ar: 'ما عاصمة المملكة العربية السعودية؟' }, opts: [{ en: 'Riyadh', ar: 'الرياض' }, { en: 'Jeddah', ar: 'جدة' }, { en: 'Abha', ar: 'أبها' }] } },
        { scene: '🏰🧱☀️', text: { en: 'Close to Riyadh is old Diriyah. Its At-Turaif district is built from mud bricks, which keep the houses cool in the hot desert.', ar: 'قرب الرياض تقع الدرعية القديمة. حيّ الطريف فيها مبنيّ من الطوب الطيني الذي يحفظ البيوت باردة في حرّ الصحراء.' },
          q: { q: { en: 'What are the old houses of At-Turaif made of?', ar: 'مِمّ بُنيت بيوت حيّ الطريف القديمة؟' }, opts: [{ en: 'mud bricks', ar: 'الطوب الطيني' }, { en: 'glass', ar: 'الزجاج' }, { en: 'ice', ar: 'الجليد' }] } },
        { scene: '☕🌴🤝', text: { en: 'A family welcomes Saqr with Saudi coffee and dates. Sharing coffee and dates with guests is a warm way to say "welcome!"', ar: 'ترحّب عائلة بصقر بالقهوة السعودية والتمر. تقديم القهوة والتمر للضيوف طريقة دافئة لقول «أهلًا وسهلًا!»' },
          q: { q: { en: 'What do families share with guests to say welcome?', ar: 'ماذا تقدّم العائلات للضيوف ترحيبًا بهم؟' }, opts: [{ en: 'coffee and dates', ar: 'القهوة والتمر' }, { en: 'sand and stones', ar: 'الرمل والحجارة' }, { en: 'nothing at all', ar: 'لا شيء' }] } }
      ],
      cards: [
        { id: 'riyadh-capital', topic: 'place', emoji: '🏙️', title: { en: 'Riyadh', ar: 'الرياض' }, fact: { en: 'Riyadh is the capital and the largest city of Saudi Arabia.', ar: 'الرياض عاصمة المملكة العربية السعودية وأكبر مدنها.' } },
        { id: 'turaif', topic: 'history', emoji: '🏰', title: { en: 'At-Turaif, Diriyah', ar: 'حيّ الطريف، الدرعية' }, fact: { en: 'At-Turaif in Diriyah is a UNESCO World Heritage Site, famous for its mud-brick Najdi buildings.', ar: 'حيّ الطريف في الدرعية من مواقع التراث العالمي لليونسكو، ويشتهر بمبانيه النجدية من الطوب الطيني.' } },
        { id: 'saudi-coffee', topic: 'culture', emoji: '☕', title: { en: 'Saudi coffee', ar: 'القهوة السعودية' }, fact: { en: 'Saudi coffee is often made with cardamom and served in small cups with dates to welcome guests.', ar: 'تُحضَّر القهوة السعودية غالبًا بالهيل، وتُقدَّم في فناجين صغيرة مع التمر ترحيبًا بالضيوف.' } }
      ]
    },
    {
      id: 'alula', place: { en: 'AlUla', ar: 'العُلا' }, emoji: '🪨', color: '#D9774A', pin: [24, 30],
      stages: [
        { scene: '🏜️🪨🌄', text: { en: 'Saqr flies north-west to AlUla, a valley of giant sandstone rocks in orange, red and gold.', ar: 'يطير صقر إلى الشمال الغربي نحو العُلا، وادٍ من صخور رملية عملاقة بألوان البرتقالي والأحمر والذهبي.' },
          q: { q: { en: 'What kind of rocks fill the valley of AlUla?', ar: 'ما نوع الصخور التي تملأ وادي العُلا؟' }, opts: [{ en: 'sandstone rocks', ar: 'صخور رملية' }, { en: 'ice blocks', ar: 'قطع جليد' }, { en: 'chocolate', ar: 'شوكولاتة' }] } },
        { scene: '🏛️🪨✨', text: { en: 'At Hegra, people long ago called the Nabataeans carved big tombs right into the rock. Hegra was the first UNESCO World Heritage Site in Saudi Arabia.', ar: 'في الحِجر نحت الأنباط قديمًا مقابر كبيرة في الصخر نفسه. والحِجر هو أول موقع سعودي يُسجَّل في قائمة التراث العالمي لليونسكو.' },
          q: { q: { en: 'Who carved the tombs of Hegra into the rock?', ar: 'من نحت مقابر الحِجر في الصخر؟' }, opts: [{ en: 'the Nabataeans', ar: 'الأنباط' }, { en: 'the dinosaurs', ar: 'الديناصورات' }, { en: 'the wind alone', ar: 'الريح وحدها' }] } },
        { scene: '🐘🪨🌅', text: { en: 'Then Saqr sees a rock that looks just like an elephant! Wind and rain shaped Elephant Rock over thousands of years.', ar: 'ثم يرى صقر صخرة تشبه الفيل تمامًا! شكّلت الرياح والأمطار صخرة الفيل عبر آلاف السنين.' },
          q: { q: { en: 'What shaped Elephant Rock?', ar: 'ما الذي شكّل صخرة الفيل؟' }, opts: [{ en: 'wind and rain', ar: 'الرياح والأمطار' }, { en: 'a real elephant', ar: 'فيل حقيقي' }, { en: 'a machine', ar: 'آلة' }] } }
      ],
      cards: [
        { id: 'hegra', topic: 'history', emoji: '🏛️', title: { en: 'Hegra', ar: 'الحِجر' }, fact: { en: 'Hegra in AlUla was the first UNESCO World Heritage Site in Saudi Arabia. Its tombs were carved by the Nabataeans.', ar: 'الحِجر في العُلا أول موقع سعودي في قائمة التراث العالمي لليونسكو، ونحت الأنباط مقابره.' } },
        { id: 'elephant-rock', topic: 'nature', emoji: '🐘', title: { en: 'Elephant Rock', ar: 'صخرة الفيل' }, fact: { en: 'Elephant Rock is a huge sandstone rock shaped by wind and water over a very long time.', ar: 'صخرة الفيل صخرة رملية ضخمة شكّلتها الرياح والمياه عبر زمن طويل جدًّا.' } }
      ]
    },
    {
      id: 'jeddah', place: { en: 'Jeddah and the Red Sea', ar: 'جدة والبحر الأحمر' }, emoji: '🌊', color: '#2C8FCB', pin: [20, 58],
      stages: [
        { scene: '🏘️🪟🌊', text: { en: 'Saqr reaches Jeddah by the Red Sea. In old Al-Balad, tall houses are built from coral stone and have carved wooden balconies called rawasheen.', ar: 'يصل صقر إلى جدة على البحر الأحمر. في البلد القديمة بيوت عالية مبنية من الحجر المرجاني، ولها شرفات خشبية منقوشة تُسمّى الرواشين.' },
          q: { q: { en: 'What are the wooden balconies in Al-Balad called?', ar: 'ماذا تُسمّى الشرفات الخشبية في البلد؟' }, opts: [{ en: 'rawasheen', ar: 'الرواشين' }, { en: 'tents', ar: 'الخيام' }, { en: 'igloos', ar: 'أكواخ الثلج' }] } },
        { scene: '🐠🪸🐢', text: { en: 'Under the clear Red Sea, coral reefs are full of colourful fish and sea turtles. We look but never touch the coral, so it stays healthy.', ar: 'تحت مياه البحر الأحمر الصافية شعاب مرجانية مليئة بالأسماك الملوّنة والسلاحف البحرية. ننظر إليها ولا نلمس المرجان أبدًا كي يبقى سليمًا.' },
          q: { q: { en: 'How do we keep coral reefs healthy?', ar: 'كيف نحافظ على الشعاب المرجانية سليمة؟' }, opts: [{ en: 'look but do not touch', ar: 'ننظر ولا نلمس' }, { en: 'break off pieces', ar: 'نكسر قطعًا منها' }, { en: 'throw rubbish in', ar: 'نرمي النفايات فيها' }] } },
        { scene: '🕋🤲✨', text: { en: 'Jeddah is close to Makkah. Every year, millions of Muslims from all over the world travel to Makkah for Hajj and Umrah, and Muslims everywhere pray facing the Kaaba.', ar: 'جدة قريبة من مكة المكرمة. كل عام يسافر ملايين المسلمين من أنحاء العالم إلى مكة للحج والعمرة، ويصلّي المسلمون في كل مكان متّجهين إلى الكعبة.' },
          q: { q: { en: 'Which holy city is close to Jeddah?', ar: 'أي مدينة مقدّسة قريبة من جدة؟' }, opts: [{ en: 'Makkah', ar: 'مكة المكرمة' }, { en: 'AlUla', ar: 'العُلا' }, { en: 'Abha', ar: 'أبها' }] } }
      ],
      cards: [
        { id: 'al-balad', topic: 'history', emoji: '🪟', title: { en: 'Historic Jeddah (Al-Balad)', ar: 'جدة التاريخية (البلد)' }, fact: { en: 'Historic Jeddah is a UNESCO World Heritage Site with coral-stone houses and wooden rawasheen balconies.', ar: 'جدة التاريخية من مواقع التراث العالمي لليونسكو، وفيها بيوت من الحجر المرجاني ورواشين خشبية.' } },
        { id: 'red-sea-reef', topic: 'nature', emoji: '🪸', title: { en: 'Red Sea coral reefs', ar: 'شعاب البحر الأحمر' }, fact: { en: 'The Red Sea has beautiful coral reefs, home to many fish, turtles and dolphins.', ar: 'في البحر الأحمر شعاب مرجانية جميلة تعيش فيها أسماك وسلاحف ودلافين كثيرة.' } },
        { id: 'makkah', topic: 'culture', emoji: '🕋', title: { en: 'Makkah', ar: 'مكة المكرمة' }, fact: { en: 'Makkah is the holiest city in Islam. Muslims travel there for Hajj and Umrah and pray facing the Kaaba.', ar: 'مكة المكرمة أقدس مدينة في الإسلام، يقصدها المسلمون للحج والعمرة ويتّجهون في صلاتهم إلى الكعبة.' } }
      ]
    },
    {
      id: 'ahsa', place: { en: 'Al-Ahsa Oasis', ar: 'واحة الأحساء' }, emoji: '🌴', color: '#4E9A3A', pin: [76, 36],
      stages: [
        { scene: '🌴🌴🌴💧', text: { en: 'In the east, Saqr finds Al-Ahsa, one of the biggest oases in the world. It has millions of date palm trees!', ar: 'في الشرق يجد صقر الأحساء، إحدى أكبر الواحات في العالم. فيها ملايين من أشجار النخيل!' },
          q: { q: { en: 'What grows in their millions at Al-Ahsa?', ar: 'ما الذي ينمو بالملايين في الأحساء؟' }, opts: [{ en: 'date palm trees', ar: 'أشجار النخيل' }, { en: 'pine trees', ar: 'أشجار الصنوبر' }, { en: 'cactus only', ar: 'الصبّار فقط' }] } },
        { scene: '💧🌊🌱', text: { en: 'How can so many palms grow in the desert? Water comes up from under the ground through springs and wells, and people share it with water channels.', ar: 'كيف ينمو كل هذا النخيل في الصحراء؟ يخرج الماء من باطن الأرض عبر العيون والآبار، ويتقاسمه الناس عبر قنوات الري.' },
          q: { q: { en: 'Where does the oasis water come from?', ar: 'من أين يأتي ماء الواحة؟' }, opts: [{ en: 'from springs under the ground', ar: 'من العيون تحت الأرض' }, { en: 'from the sea only', ar: 'من البحر فقط' }, { en: 'from snow', ar: 'من الثلج' }] } },
        { scene: '🟤🍯😋', text: { en: 'Al-Ahsa is famous for its sweet dates, like Khalas. Saqr counts the dates on his plate: one, two, three, four, five!', ar: 'تشتهر الأحساء بتمرها الحلو مثل الخلاص. يعدّ صقر حبات التمر في صحنه: واحد، اثنان، ثلاثة، أربعة، خمسة!' },
          q: { q: { en: 'How many dates did Saqr count?', ar: 'كم حبة تمر عدّ صقر؟' }, opts: ['5', '3', '8'] } }
      ],
      cards: [
        { id: 'ahsa-oasis', topic: 'nature', emoji: '🌴', title: { en: 'Al-Ahsa Oasis', ar: 'واحة الأحساء' }, fact: { en: 'Al-Ahsa is one of the largest oases in the world and a UNESCO World Heritage Site, with millions of palm trees.', ar: 'الأحساء من أكبر الواحات في العالم، ومن مواقع التراث العالمي لليونسكو، وفيها ملايين النخيل.' } },
        { id: 'dates', topic: 'culture', emoji: '🟤', title: { en: 'Dates', ar: 'التمر' }, fact: { en: 'Dates are sweet, healthy fruits from palm trees. Saudi Arabia grows many kinds, like Khalas, Sukkari and Ajwa.', ar: 'التمر ثمر حلو ومفيد من النخيل. تزرع المملكة أنواعًا كثيرة مثل الخلاص والسكري والعجوة.' } }
      ]
    },
    {
      id: 'abha', place: { en: 'Abha and Asir', ar: 'أبها وعسير' }, emoji: '⛰️', color: '#3E8E6A', pin: [30, 76],
      stages: [
        { scene: '⛰️🌫️🌿', text: { en: 'In the south-west, Saqr flies over the green mountains of Asir. The air in Abha is cool, and clouds sometimes float through the valleys.', ar: 'في الجنوب الغربي يطير صقر فوق جبال عسير الخضراء. الهواء في أبها لطيف بارد، والسحب أحيانًا تمرّ بين الأودية.' },
          q: { q: { en: 'What is the weather like in the mountains of Abha?', ar: 'كيف هو الطقس في جبال أبها؟' }, opts: [{ en: 'cool and green', ar: 'بارد وأخضر' }, { en: 'always snowy', ar: 'ثلجي دائمًا' }, { en: 'under the sea', ar: 'تحت البحر' }] } },
        { scene: '🎨🔺🟥', text: { en: 'Inside a house, Saqr sees walls painted with bright triangles and lines. This art, called Al-Qatt Al-Asiri, has been painted by women of Asir for a very long time.', ar: 'داخل أحد البيوت يرى صقر جدرانًا ملوّنة بمثلثات وخطوط زاهية. هذا الفن اسمه القطّ العسيري، وترسمه نساء عسير منذ زمن طويل.' },
          q: { q: { en: 'What is the colourful wall art of Asir called?', ar: 'ما اسم فن الجدران الملوّن في عسير؟' }, opts: [{ en: 'Al-Qatt Al-Asiri', ar: 'القطّ العسيري' }, { en: 'sand castles', ar: 'قلاع الرمل' }, { en: 'stickers', ar: 'الملصقات' }] } },
        { scene: '🔺🔺🔺🔺', text: { en: 'Saqr counts the triangles in one row of the painting. A pattern repeats: red, yellow, red, yellow…', ar: 'يعدّ صقر المثلثات في صفّ واحد من الرسم. النقشة تتكرّر: أحمر، أصفر، أحمر، أصفر…' },
          q: { q: { en: 'Red, yellow, red, yellow… what comes next?', ar: 'أحمر، أصفر، أحمر، أصفر… ماذا يأتي بعد ذلك؟' }, opts: [{ en: 'red', ar: 'أحمر' }, { en: 'blue', ar: 'أزرق' }, { en: 'green', ar: 'أخضر' }] } }
      ],
      cards: [
        { id: 'asir-mountains', topic: 'nature', emoji: '⛰️', title: { en: 'Asir mountains', ar: 'جبال عسير' }, fact: { en: 'The Asir mountains in the south-west are green and cool, with terraced farms on the slopes.', ar: 'جبال عسير في الجنوب الغربي خضراء وباردة، وعلى سفوحها مدرّجات زراعية.' } },
        { id: 'qatt-asiri', topic: 'culture', emoji: '🎨', title: { en: 'Al-Qatt Al-Asiri', ar: 'القطّ العسيري' }, fact: { en: 'Al-Qatt Al-Asiri is colourful wall painting made by women in Asir. UNESCO lists it as intangible cultural heritage.', ar: 'القطّ العسيري رسم ملوّن على الجدران تبدعه نساء عسير، وقد أدرجته اليونسكو في قائمة التراث الثقافي غير المادي.' } }
      ]
    },
    {
      id: 'empty-quarter', place: { en: 'The Empty Quarter', ar: 'الربع الخالي' }, emoji: '🐪', color: '#E0A040', pin: [68, 72],
      stages: [
        { scene: '🏜️🏜️☀️', text: { en: 'Saqr flies to the Empty Quarter, the largest sand desert in the whole world. The dunes are as tall as buildings!', ar: 'يطير صقر إلى الربع الخالي، أكبر صحراء رملية في العالم كله. بعض الكثبان بارتفاع المباني!' },
          q: { q: { en: 'What is special about the Empty Quarter?', ar: 'ما الذي يميّز الربع الخالي؟' }, opts: [{ en: 'it is the largest sand desert', ar: 'أكبر صحراء رملية' }, { en: 'it is a forest', ar: 'غابة' }, { en: 'it is a lake', ar: 'بحيرة' }] } },
        { scene: '🐪💧🌵', text: { en: 'Camels can walk for days in the desert. Their wide feet do not sink in the sand, and they can go a long time without drinking.', ar: 'تستطيع الإبل المشي أيامًا في الصحراء. أقدامها العريضة لا تغوص في الرمل، وتصبر على العطش وقتًا طويلًا.' },
          q: { q: { en: 'Why don\'t camels sink in the sand?', ar: 'لماذا لا تغوص الإبل في الرمل؟' }, opts: [{ en: 'they have wide feet', ar: 'لأن أقدامها عريضة' }, { en: 'they can fly', ar: 'لأنها تطير' }, { en: 'they wear shoes', ar: 'لأنها تلبس أحذية' }] } },
        { scene: '🦌🌙⭐', text: { en: 'At night, Saqr spots a white Arabian oryx with long straight horns. Long ago it almost disappeared, but people protected it and now it lives in the wild again.', ar: 'في الليل يلمح صقر مهاة عربية بيضاء بقرنين طويلين مستقيمين. كادت تنقرض قديمًا، لكن الناس حموها فعادت تعيش في البرية.' },
          q: { q: { en: 'How did the Arabian oryx come back?', ar: 'كيف عادت المهاة العربية؟' }, opts: [{ en: 'people protected it', ar: 'لأن الناس حموها' }, { en: 'it learned to fly', ar: 'لأنها تعلّمت الطيران' }, { en: 'it hid in the sea', ar: 'لأنها اختبأت في البحر' }] } }
      ],
      cards: [
        { id: 'rub-al-khali', topic: 'nature', emoji: '🏜️', title: { en: 'The Empty Quarter', ar: 'الربع الخالي' }, fact: { en: 'The Empty Quarter (Rub\' al Khali) is the largest continuous sand desert in the world.', ar: 'الربع الخالي أكبر صحراء رملية متّصلة في العالم.' } },
        { id: 'camel', topic: 'nature', emoji: '🐪', title: { en: 'The camel', ar: 'الجمل' }, fact: { en: 'Camels are perfect for the desert: wide feet for sand, and they can go many days without water.', ar: 'الإبل مناسبة تمامًا للصحراء: أقدام عريضة للرمل، وتصبر على الماء أيامًا كثيرة.' } },
        { id: 'oryx', topic: 'nature', emoji: '🦌', title: { en: 'Arabian oryx', ar: 'المها العربي' }, fact: { en: 'The Arabian oryx almost disappeared from the wild. Thanks to protection, herds now live in the desert again.', ar: 'كادت المها العربي تختفي من البرية، وبفضل الحماية عادت قطعانها تعيش في الصحراء.' } }
      ]
    }
  ];
})();
