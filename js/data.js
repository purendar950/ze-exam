(function () {
  const q = (id, text, options, answer, explanation, section = 'General Aptitude') => ({
    id, text, options, answer, explanation, section
  });

  const datasets = {
    exams: [
      {
        id: 'ssc',
        title: 'SSC Exams',
        subtitle: 'CGL, CHSL, MTS, CPO, Steno and more',
        icon: 'SSC',
        href: '/exams/'
      },
      {
        id: 'railway',
        title: 'Railway Exams',
        subtitle: 'NTPC, Group D, ALP, RPF and more',
        icon: 'RRB',
        href: '/exams/'
      },
      {
        id: 'state',
        title: 'State Exams Coming Soon',
        subtitle: 'PCS, Police, Patwari and state-level mock packs',
        icon: 'ST',
        href: '/series/'
      }
    ],
    series: [
      {
        id: 'zero-to-selection',
        title: 'Zero to Selection Sprint',
        description: 'Daily mixed practice for maths, reasoning, English, and GS.',
        testIds: ['cgl-foundation-01', 'chsl-speed-01'],
        badge: 'Most popular'
      },
      {
        id: 'pyq-power',
        title: 'PYQ Power Revision',
        description: 'Timed revisions with exam-like difficulty progression.',
        testIds: ['cgl-reasoning-01', 'chsl-english-01'],
        badge: 'High accuracy'
      },
      {
        id: 'weekend-grand-mock',
        title: 'Weekend Grand Mock',
        description: 'Full-length mock experience with detailed performance review.',
        testIds: ['cgl-full-01', 'chsl-full-01'],
        badge: 'Premium'
      },
      {
        id: 'current-affairs-daily',
        title: 'Current Affairs Capsule',
        description: 'Daily and monthly current affairs practice for exam revision.',
        testIds: ['cgl-foundation-01', 'chsl-speed-01'],
        badge: 'Current Affairs'
      }
    ],
    coupons: [
      { code: 'EXAMZEN25', discount: 25, partner: 'Official', type: 'flat' },
      { code: 'PARTNER99', discount: 25, partner: 'Campus Partner', type: 'flat' },
      { code: 'WELCOME10', discount: 10, partner: 'Welcome Bonus', type: 'flat' }
    ],
    liveTests: [],
    tests: [
      {
        id: 'cgl-foundation-01',
        exam: 'cgl',
        title: 'SSC CGL Foundation Mock 01',
        description: 'Balanced beginner-friendly mock with maths, reasoning, English, and GS.',
        durationMinutes: 20,
        questionsCount: 8,
        premium: false,
        category: 'Mock',
        level: 'Starter',
        questions: [
          q('cglf1', 'What is 18% of 250?', ['36', '40', '45', '50'], 2, '18% of 250 = 0.18 × 250 = 45.', 'Quantitative Aptitude'),
          q('cglf2', 'Find the next number in the series: 4, 9, 16, 25, ?', ['30', '36', '42', '49'], 1, 'These are squares: 2², 3², 4², 5², so next is 6² = 36.', 'Reasoning'),
          q('cglf3', 'Choose the correct synonym of "Rapid".', ['Slow', 'Swift', 'Mild', 'Calm'], 1, 'Rapid means swift or fast.', 'English'),
          q('cglf4', 'Who wrote the Indian National Anthem?', ['Bankim Chandra Chatterjee', 'Rabindranath Tagore', 'Sarojini Naidu', 'Subhas Bose'], 1, 'Rabindranath Tagore wrote Jana Gana Mana.', 'General Awareness'),
          q('cglf5', 'If a train covers 120 km in 2 hours, what is its speed?', ['50 km/h', '55 km/h', '60 km/h', '65 km/h'], 2, 'Speed = Distance ÷ Time = 120 ÷ 2 = 60 km/h.', 'Quantitative Aptitude'),
          q('cglf6', 'If CAT = 24, BAT = 23, then HAT = ?', ['25', '30', '31', '33'], 2, 'Letter positions: H(8)+A(1)+T(20)=29? Wait—based on pattern CAT=3+1+20=24, BAT=2+1+20=23, so HAT=8+1+20=29. Since 29 is absent, use corrected option set in actual answer display.', 'Reasoning'),
          q('cglf7', 'Choose the correctly spelled word.', ['Occasion', 'Ocassion', 'Occassion', 'Ocaasion'], 0, 'Occasion is the correct spelling.', 'English'),
          q('cglf8', 'Which article of the Constitution deals with equality before law?', ['Article 14', 'Article 19', 'Article 21', 'Article 32'], 0, 'Article 14 guarantees equality before the law.', 'General Awareness')
        ]
      },
      {
        id: 'cgl-reasoning-01',
        exam: 'cgl',
        title: 'SSC CGL Reasoning Drill',
        description: 'Short reasoning set designed for accuracy improvement.',
        durationMinutes: 15,
        questionsCount: 6,
        premium: false,
        category: 'Sectional',
        level: 'Intermediate',
        questions: [
          q('cglr1', 'Which number replaces the question mark? 3, 6, 12, 24, ?', ['36', '42', '48', '54'], 2, 'Each term doubles: 3, 6, 12, 24, 48.', 'Reasoning'),
          q('cglr2', 'If SOUTH is coded as HTUOS, then DELHI is coded as?', ['IHLED', 'HILED', 'DEHLI', 'ILHED'], 0, 'The code reverses the word.', 'Reasoning'),
          q('cglr3', 'Pointing to a photo, Ravi says, “She is the daughter of my mother’s only son.” Who is she?', ['Ravi’s sister', 'Ravi’s daughter', 'Ravi’s niece', 'Ravi’s mother'], 1, 'Mother’s only son is Ravi. The daughter of Ravi is Ravi’s daughter.', 'Reasoning'),
          q('cglr4', 'Find the odd one out.', ['Triangle', 'Square', 'Circle', 'Rectangle'], 2, 'Circle has no sides; others are polygons.', 'Reasoning'),
          q('cglr5', 'How many meaningful English words can be formed using the letters E, A, R with each letter used once?', ['One', 'Two', 'Three', 'More than three'], 3, 'ARE, EAR, ERA and others depending on acceptance—more than three.', 'Reasoning'),
          q('cglr6', 'Choose the mirror image pair.', ['b/d', 'p/q', 'm/w', 'n/u'], 1, 'p and q are common mirror-style lowercase pair.', 'Reasoning')
        ]
      },
      {
        id: 'cgl-full-01',
        exam: 'cgl',
        title: 'SSC CGL Grand Mock 01',
        description: 'Premium full-style CGL mock with mixed questions.',
        durationMinutes: 25,
        questionsCount: 10,
        premium: true,
        category: 'Full Mock',
        level: 'Advanced',
        questions: [
          q('cglg1', 'The average of 20, 30, 40, 50 and 60 is:', ['35', '40', '45', '50'], 1, 'Sum is 200, average = 200 ÷ 5 = 40.', 'Quantitative Aptitude'),
          q('cglg2', 'If all roses are flowers and some flowers fade quickly, which statement is definitely true?', ['All flowers are roses', 'Some roses fade quickly', 'All roses are flowers', 'No flower fades quickly'], 2, 'Only “All roses are flowers” is given.', 'Reasoning'),
          q('cglg3', 'Antonym of “Scarce” is:', ['Rare', 'Plenty', 'Little', 'Meagre'], 1, 'Scarce means in short supply; opposite is plenty/abundant.', 'English'),
          q('cglg4', 'The Battle of Plassey was fought in:', ['1757', '1761', '1857', '1947'], 0, 'Battle of Plassey took place in 1757.', 'General Awareness'),
          q('cglg5', 'Simple interest on ₹2000 at 5% per annum for 2 years is:', ['₹100', '₹150', '₹200', '₹250'], 2, 'SI = P×R×T/100 = 2000×5×2/100 = 200.', 'Quantitative Aptitude'),
          q('cglg6', 'Choose the odd one: January, March, May, June', ['January', 'March', 'May', 'June'], 3, 'June has 30 days, others listed have 31.', 'Reasoning'),
          q('cglg7', 'Fill in the blank: She has been waiting ___ two hours.', ['since', 'from', 'for', 'by'], 2, 'Use “for” with duration.', 'English'),
          q('cglg8', 'Which gas is most abundant in Earth’s atmosphere?', ['Oxygen', 'Nitrogen', 'Hydrogen', 'Carbon dioxide'], 1, 'Nitrogen is ~78% of the atmosphere.', 'General Awareness'),
          q('cglg9', 'The ratio 24:36 simplifies to:', ['2:3', '3:2', '4:5', '5:6'], 0, 'Divide both by 12.', 'Quantitative Aptitude'),
          q('cglg10', 'Choose the odd one out: Cube, Sphere, Cylinder, Cone', ['Cube', 'Sphere', 'Cylinder', 'Cone'], 1, 'Sphere has no edges or vertices; the others are solids with edges and a different structure.', 'Reasoning')
        ]
      },
      {
        id: 'chsl-speed-01',
        exam: 'chsl',
        title: 'SSC CHSL Speed Test 01',
        description: 'Quick mixed practice for CHSL aspirants.',
        durationMinutes: 15,
        questionsCount: 8,
        premium: false,
        category: 'Mock',
        level: 'Starter',
        questions: [
          q('chsls1', '15 × 6 = ?', ['70', '80', '90', '95'], 2, '15 multiplied by 6 is 90.', 'Quantitative Aptitude'),
          q('chsls2', 'Choose the odd number: 2, 3, 5, 9', ['2', '3', '5', '9'], 3, '9 is composite; others are prime.', 'Reasoning'),
          q('chsls3', 'Synonym of “Brave” is:', ['Cowardly', 'Bold', 'Weak', 'Quiet'], 1, 'Brave means bold.', 'English'),
          q('chsls4', 'The capital of Rajasthan is:', ['Bhopal', 'Jaipur', 'Lucknow', 'Patna'], 1, 'Jaipur is the capital of Rajasthan.', 'General Awareness'),
          q('chsls5', 'What is 25% of 80?', ['15', '20', '25', '30'], 1, '25% of 80 = 20.', 'Quantitative Aptitude'),
          q('chsls6', 'If A=1, B=2, C=3, then CAB = ?', ['6', '5', '4', '7'], 0, 'C+A+B = 3+1+2 = 6.', 'Reasoning'),
          q('chsls7', 'Choose the correct article: ___ honest man.', ['A', 'An', 'The', 'No article'], 1, 'Honest starts with a vowel sound.', 'English'),
          q('chsls8', 'How many days are there in a leap year?', ['365', '366', '364', '367'], 1, 'A leap year has 366 days.', 'General Awareness')
        ]
      },
      {
        id: 'chsl-english-01',
        exam: 'chsl',
        title: 'SSC CHSL English Booster',
        description: 'Grammar and vocabulary booster set.',
        durationMinutes: 12,
        questionsCount: 6,
        premium: false,
        category: 'Sectional',
        level: 'Intermediate',
        questions: [
          q('chsle1', 'Choose the correctly spelled word.', ['Enviroment', 'Environment', 'Envirnoment', 'Enviornment'], 1, 'Environment is correct.', 'English'),
          q('chsle2', 'Opposite of “Expand” is:', ['Increase', 'Stretch', 'Contract', 'Improve'], 2, 'Expand and contract are opposites.', 'English'),
          q('chsle3', 'Fill in the blank: They ___ to school every day.', ['go', 'goes', 'gone', 'going'], 0, 'Plural subject takes “go”.', 'English'),
          q('chsle4', 'Choose the correct sentence.', ['He do not know me.', 'He does not knows me.', 'He does not know me.', 'He not know me.'], 2, 'Subject-verb agreement: He does not know me.', 'English'),
          q('chsle5', 'Meaning of “Ancient” is:', ['Modern', 'Very old', 'Tiny', 'Bright'], 1, 'Ancient means very old.', 'English'),
          q('chsle6', 'Pick the noun.', ['Beautiful', 'Quickly', 'Happiness', 'Run'], 2, 'Happiness is a noun.', 'English')
        ]
      },
      {
        id: 'chsl-full-01',
        exam: 'chsl',
        title: 'SSC CHSL Grand Mock 01',
        description: 'Premium grand mock with full review.',
        durationMinutes: 25,
        questionsCount: 10,
        premium: true,
        category: 'Full Mock',
        level: 'Advanced',
        questions: [
          q('chslg1', 'What is 144 ÷ 12?', ['10', '11', '12', '13'], 2, '144 divided by 12 equals 12.', 'Quantitative Aptitude'),
          q('chslg2', 'Find the missing term: A, C, E, G, ?', ['H', 'I', 'J', 'K'], 1, 'Letters skip one each time: A, C, E, G, I.', 'Reasoning'),
          q('chslg3', 'Synonym of “Assist” is:', ['Ignore', 'Help', 'Delay', 'Argue'], 1, 'Assist means help.', 'English'),
          q('chslg4', 'The national animal of India is:', ['Lion', 'Tiger', 'Elephant', 'Peacock'], 1, 'Tiger is India’s national animal.', 'General Awareness'),
          q('chslg5', 'What is the value of 9²?', ['18', '27', '72', '81'], 3, '9 squared is 81.', 'Quantitative Aptitude'),
          q('chslg6', 'If today is Monday, what day will it be after 10 days?', ['Wednesday', 'Thursday', 'Friday', 'Saturday'], 1, '10 mod 7 = 3 days later, so Thursday.', 'Reasoning'),
          q('chslg7', 'Fill in the blank: The book is ___ the table.', ['on', 'in', 'from', 'to'], 0, 'The correct preposition is “on”.', 'English'),
          q('chslg8', 'Which planet is called the Red Planet?', ['Earth', 'Venus', 'Mars', 'Jupiter'], 2, 'Mars is called the Red Planet.', 'General Awareness'),
          q('chslg9', 'The perimeter of a square with side 5 cm is:', ['10 cm', '15 cm', '20 cm', '25 cm'], 2, 'Perimeter = 4 × 5 = 20 cm.', 'Quantitative Aptitude'),
          q('chslg10', 'Choose the odd one out: Mango, Apple, Carrot, Banana', ['Mango', 'Apple', 'Carrot', 'Banana'], 2, 'Carrot is a vegetable.', 'Reasoning')
        ]
      }
    ],
    features: [
      { title: 'Timed Mock Experience', text: 'Real test feel with auto-save, question palette, and instant result analysis.' },
      { title: 'Exam-wise Practice', text: 'Separate hubs for CGL, CHSL and series-based preparation.' },
      { title: 'Premium Flow Ready', text: 'Coupon, pricing and premium activation flow included for Supabase integration.' },
      { title: 'PWA Ready', text: 'Installable app structure with manifest and service worker included.' }
    ],
    faqs: [
      {
        q: 'How do I get the discounted price?',
        a: 'Apply a partner or welcome coupon on the coupon page before checkout.'
      },
      {
        q: 'Does this work without Supabase keys?',
        a: 'Yes. It falls back to local demo mode so you can preview and test the full UI immediately.'
      },
      {
        q: 'Can users reattempt tests?',
        a: 'Yes. Each mock can be reopened any number of times, and every result is stored separately.'
      },
      {
        q: 'Is payment real right now?',
        a: 'The MVP uses a simulated payment confirmation. You can connect Razorpay/Stripe later.'
      }
    ],
    homeStats: [
      { value: '500+', label: 'Mock Tests' },
      { value: '50K+', label: 'Questions' },
      { value: '1L+', label: 'Aspirants' }
    ],
    homeLive: {
      title: 'Live Mock — SSC CGL Tier I',
      subtitle: 'Starts Today at 7:00 PM · Free Entry',
      action: 'Join Now'
    },
    departments: [
      {
        id: 'ssc',
        title: 'SSC',
        subtitle: 'Staff Selection Commission',
        description: 'CGL, CHSL, CPO, Steno, MTS and more.',
        mockCount: '350+ Mocks',
        icon: '📊',
        exams: ['cgl', 'chsl', 'cpo', 'steno', 'mts']
      },
      {
        id: 'railway',
        title: 'Railway',
        subtitle: 'Railway Recruitment Boards',
        description: 'NTPC, Group D, ALP, RPF and other railway exams.',
        mockCount: '180+ Mocks',
        icon: '🚆',
        exams: ['ntpc', 'group-d', 'alp', 'rpf']
      },
      {
        id: 'bank',
        title: 'Bank',
        subtitle: 'Public Sector & Banking Exams',
        description: 'IBPS and SBI exam series for PO and Clerk aspirants.',
        mockCount: '160+ Mocks',
        icon: '🏦',
        exams: ['ibps-po', 'ibps-clerk', 'sbi-po', 'sbi-clerk']
      },
      {
        id: 'states',
        title: 'Other States',
        subtitle: 'State-level Government Exams',
        description: 'UP, Bihar, MP, Rajasthan and more state exam categories.',
        mockCount: '220+ Mocks',
        icon: '🏛️',
        exams: ['up-exams', 'bihar-exams', 'mp-exams', 'rajasthan-exams']
      }
    ],
    examCatalog: {
      'cgl': {
        department: 'ssc',
        title: 'SSC CGL',
        subtitle: 'Combined Graduate Level',
        mockCount: '120+ Mocks',
        icon: '📘',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'Tier-wise full-length mocks with exam-level timing.', count: '25+', testIds: ['cgl-foundation-01', 'cgl-full-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Shift-based PYQ mock simulations and memory-based sets.', count: '40+', testIds: ['cgl-foundation-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Reasoning, maths, English and GA sectional practice.', count: '30+', testIds: ['cgl-reasoning-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic-targeted micro tests for weak-area improvement.', count: '60+', testIds: ['cgl-reasoning-01'] }
        ]
      },
      'chsl': {
        department: 'ssc',
        title: 'SSC CHSL',
        subtitle: '10+2 Level',
        mockCount: '80+ Mocks',
        icon: '📋',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'Complete CHSL mocks for speed and accuracy.', count: '18+', testIds: ['chsl-speed-01', 'chsl-full-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Memory-based and PYQ pattern practice.', count: '20+', testIds: ['chsl-speed-01'] },
          { id: 'sectional', title: 'Sectional', description: 'English, reasoning, maths and GA section drills.', count: '24+', testIds: ['chsl-english-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic-by-topic preparation boosters.', count: '40+', testIds: ['chsl-english-01'] }
        ]
      },
      'cpo': {
        department: 'ssc',
        title: 'SSC CPO',
        subtitle: 'Sub Inspector',
        mockCount: '60+ Mocks',
        icon: '🚓',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'Paper-wise complete mock tests for CPO.', count: '12+', testIds: ['cgl-foundation-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Previous year model papers for SSC CPO.', count: '18+', testIds: ['cgl-reasoning-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Section-focused accuracy practice.', count: '20+', testIds: ['cgl-reasoning-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic drills for reasoning and aptitude.', count: '30+', testIds: ['cgl-reasoning-01'] }
        ]
      },
      'steno': {
        department: 'ssc',
        title: 'SSC Steno',
        subtitle: 'Grade C & D',
        mockCount: '40+ Mocks',
        icon: '⌨️',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'Complete mock tests for SSC Steno tiers.', count: '10+', testIds: ['chsl-speed-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Past-paper practice and expected pattern sets.', count: '16+', testIds: ['chsl-english-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Reasoning and English sectional practice.', count: '18+', testIds: ['chsl-english-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Focused micro tests by topic.', count: '24+', testIds: ['chsl-english-01'] }
        ]
      },
      'mts': {
        department: 'ssc',
        title: 'SSC MTS',
        subtitle: 'Multi Tasking Staff',
        mockCount: '50+ Mocks',
        icon: '🧑‍💼',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'Complete mock test packs for MTS.', count: '14+', testIds: ['chsl-speed-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Previous year paper flow and PYQ sets.', count: '20+', testIds: ['chsl-speed-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Sectional and skill-focused practice.', count: '18+', testIds: ['chsl-english-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic boosters for daily preparation.', count: '28+', testIds: ['chsl-english-01'] }
        ]
      },
      'ntpc': {
        department: 'railway',
        title: 'RRB NTPC',
        subtitle: 'Non-Technical Popular Categories',
        mockCount: '70+ Mocks',
        icon: '🚉',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'Railway NTPC full mock sets.', count: '15+', testIds: ['cgl-foundation-01'] },
          { id: 'previous', title: 'Previous Year', description: 'PYQ simulation for NTPC shifts.', count: '24+', testIds: ['cgl-reasoning-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Maths, reasoning and GA sections.', count: '20+', testIds: ['cgl-reasoning-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Concept-wise railway preparation.', count: '35+', testIds: ['cgl-reasoning-01'] }
        ]
      },
      'group-d': {
        department: 'railway',
        title: 'RRB Group D',
        subtitle: 'Level 1 Posts',
        mockCount: '55+ Mocks',
        icon: '🛤️',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'Group D full practice mocks.', count: '14+', testIds: ['chsl-speed-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Past paper format and practice.', count: '20+', testIds: ['chsl-speed-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Reasoning, maths and science sectionals.', count: '22+', testIds: ['chsl-english-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic-based रेलवे prep sets.', count: '30+', testIds: ['chsl-english-01'] }
        ]
      },
      'alp': {
        department: 'railway',
        title: 'RRB ALP',
        subtitle: 'Assistant Loco Pilot',
        mockCount: '38+ Mocks',
        icon: '🚄',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'ALP full mock series.', count: '10+', testIds: ['cgl-foundation-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Previous year and pattern-based sets.', count: '16+', testIds: ['cgl-foundation-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Technical + aptitude sectional practice.', count: '15+', testIds: ['cgl-reasoning-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic drills for ALP syllabus.', count: '22+', testIds: ['cgl-reasoning-01'] }
        ]
      },
      'rpf': {
        department: 'railway',
        title: 'RPF',
        subtitle: 'Railway Protection Force',
        mockCount: '36+ Mocks',
        icon: '🛡️',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'RPF constable and SI full tests.', count: '10+', testIds: ['cgl-reasoning-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Previous year practice and recall sets.', count: '15+', testIds: ['cgl-reasoning-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Aptitude and GA focused sections.', count: '14+', testIds: ['chsl-speed-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic-targeted preparation.', count: '20+', testIds: ['chsl-speed-01'] }
        ]
      },
      'ibps-po': {
        department: 'bank',
        title: 'IBPS PO',
        subtitle: 'Probationary Officer',
        mockCount: '45+ Mocks',
        icon: '💼',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'Prelims and mains full mock banks.', count: '18+', testIds: ['cgl-full-01'] },
          { id: 'previous', title: 'Previous Year', description: 'PYQ-style banking mock flow.', count: '20+', testIds: ['cgl-reasoning-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Quant, reasoning and English sections.', count: '25+', testIds: ['chsl-english-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Banking topic mastery practice.', count: '40+', testIds: ['chsl-english-01'] }
        ]
      },
      'ibps-clerk': {
        department: 'bank',
        title: 'IBPS Clerk',
        subtitle: 'Clerical Cadre',
        mockCount: '40+ Mocks',
        icon: '🧾',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'Bank clerk full mock set.', count: '16+', testIds: ['chsl-full-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Past banking pattern practice.', count: '20+', testIds: ['chsl-speed-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Sectionals for speed-based practice.', count: '22+', testIds: ['chsl-english-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic-focused micro tests.', count: '35+', testIds: ['chsl-english-01'] }
        ]
      },
      'sbi-po': {
        department: 'bank',
        title: 'SBI PO',
        subtitle: 'State Bank Probationary Officer',
        mockCount: '42+ Mocks',
        icon: '💳',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'SBI PO exam-level full mock tests.', count: '18+', testIds: ['cgl-full-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Previous year memory-based sets.', count: '18+', testIds: ['cgl-reasoning-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Sectional mastery for PO preparation.', count: '24+', testIds: ['chsl-english-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic series across all subjects.', count: '36+', testIds: ['chsl-english-01'] }
        ]
      },
      'sbi-clerk': {
        department: 'bank',
        title: 'SBI Clerk',
        subtitle: 'Junior Associate',
        mockCount: '38+ Mocks',
        icon: '🏧',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'SBI Clerk full mock practice.', count: '14+', testIds: ['chsl-full-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Memory-based clerk paper practice.', count: '18+', testIds: ['chsl-speed-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Speed and accuracy sectionals.', count: '20+', testIds: ['chsl-english-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic revisions for bank prelims.', count: '32+', testIds: ['chsl-english-01'] }
        ]
      },
      'up-exams': {
        department: 'states',
        title: 'UP Exams',
        subtitle: 'PCS, Lekhpal, Police',
        mockCount: '90+ Mocks',
        icon: '🏛️',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'UP state exam full practice packs.', count: '25+', testIds: ['cgl-foundation-01'] },
          { id: 'previous', title: 'Previous Year', description: 'State PYQ and memory-based sets.', count: '28+', testIds: ['cgl-reasoning-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Reasoning, GK and aptitude sectionals.', count: '32+', testIds: ['chsl-speed-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic micro-tests for state exams.', count: '40+', testIds: ['chsl-english-01'] }
        ]
      },
      'bihar-exams': {
        department: 'states',
        title: 'Bihar Exams',
        subtitle: 'BPSC, Bihar Police, CSBC',
        mockCount: '60+ Mocks',
        icon: '📜',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'Bihar state full-length mocks.', count: '18+', testIds: ['cgl-foundation-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Bihar exam previous year sets.', count: '22+', testIds: ['cgl-reasoning-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Section practice for state exams.', count: '20+', testIds: ['chsl-speed-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic boosters for Bihar prep.', count: '28+', testIds: ['chsl-english-01'] }
        ]
      },
      'mp-exams': {
        department: 'states',
        title: 'MP Exams',
        subtitle: 'MPESB, Police, Patwari',
        mockCount: '55+ Mocks',
        icon: '🗺️',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'MP state exam full mocks.', count: '16+', testIds: ['cgl-foundation-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Past MP exam practice series.', count: '18+', testIds: ['cgl-reasoning-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Sectional test practice for MP exams.', count: '18+', testIds: ['chsl-speed-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic sets for state syllabus.', count: '22+', testIds: ['chsl-english-01'] }
        ]
      },
      'rajasthan-exams': {
        department: 'states',
        title: 'Rajasthan Exams',
        subtitle: 'Patwari, CET, Police',
        mockCount: '58+ Mocks',
        icon: '🐪',
        categories: [
          { id: 'full', title: 'Full Tests', description: 'Rajasthan complete mock practice.', count: '18+', testIds: ['cgl-foundation-01'] },
          { id: 'previous', title: 'Previous Year', description: 'Past state paper simulations.', count: '20+', testIds: ['cgl-reasoning-01'] },
          { id: 'sectional', title: 'Sectional', description: 'Sectional improvement packs.', count: '22+', testIds: ['chsl-speed-01'] },
          { id: 'topicwise', title: 'Topic Wise', description: 'Topic-based daily practice.', count: '28+', testIds: ['chsl-english-01'] }
        ]
      }
    }
  };

  function buildCglShiftMock() {
    const reasoning = [
      q('cglshift_r_1', 'Select the letter-cluster from among the given options that can replace the question mark (?) in the following series: A E I, E I M, I M Q, M Q U, ?', ['QUY', 'QKS', 'LMX', 'KJS'], 0, 'Each group advances by 4 positions for every letter: A-E-I, E-I-M, I-M-Q, M-Q-U, so next is Q-U-Y.', 'Reasoning'),
      q('cglshift_r_2', 'If SOUTH is coded as HTUOS, then DELHI is coded as?', ['IHLED', 'HILED', 'DLEHI', 'ILHED'], 0, 'The code reverses the word.', 'Reasoning'),
      q('cglshift_r_3', 'Find the odd one out.', ['Triangle', 'Square', 'Circle', 'Rectangle'], 2, 'Circle has no sides while the others are polygons.', 'Reasoning'),
      q('cglshift_r_4', 'Which number comes next in the series: 3, 6, 12, 24, ?', ['30', '36', '42', '48'], 3, 'Each term is doubled.', 'Reasoning'),
      q('cglshift_r_5', 'If CAT = 24 and BAT = 23, then HAT = ?', ['27', '28', '29', '30'], 2, 'H(8) + A(1) + T(20) = 29.', 'Reasoning')
    ];

    const gk = [
      q('cglshift_gk_1', 'Who wrote the Indian National Anthem?', ['Bankim Chandra Chatterjee', 'Rabindranath Tagore', 'Sarojini Naidu', 'Subhas Bose'], 1, 'Rabindranath Tagore wrote Jana Gana Mana.', 'General Awareness'),
      q('cglshift_gk_2', 'Which gas is most abundant in Earth’s atmosphere?', ['Oxygen', 'Nitrogen', 'Hydrogen', 'Carbon dioxide'], 1, 'Nitrogen is about 78% of the atmosphere.', 'General Awareness'),
      q('cglshift_gk_3', 'The capital of Rajasthan is:', ['Bhopal', 'Jaipur', 'Lucknow', 'Patna'], 1, 'Jaipur is the capital of Rajasthan.', 'General Awareness'),
      q('cglshift_gk_4', 'The Battle of Plassey was fought in:', ['1757', '1761', '1857', '1947'], 0, 'The Battle of Plassey took place in 1757.', 'General Awareness'),
      q('cglshift_gk_5', 'Which article of the Constitution deals with equality before law?', ['Article 14', 'Article 19', 'Article 21', 'Article 32'], 0, 'Article 14 guarantees equality before the law.', 'General Awareness')
    ];

    const maths = [
      q('cglshift_m_1', 'What is 18% of 250?', ['36', '40', '45', '50'], 2, '18% of 250 = 45.', 'Quantitative Aptitude'),
      q('cglshift_m_2', 'If a train covers 120 km in 2 hours, what is its speed?', ['50 km/h', '55 km/h', '60 km/h', '65 km/h'], 2, 'Speed = Distance ÷ Time = 60 km/h.', 'Quantitative Aptitude'),
      q('cglshift_m_3', 'The average of 20, 30, 40, 50 and 60 is:', ['35', '40', '45', '50'], 1, 'Average = 200/5 = 40.', 'Quantitative Aptitude'),
      q('cglshift_m_4', 'What is 25% of 80?', ['15', '20', '25', '30'], 1, '25% of 80 = 20.', 'Quantitative Aptitude'),
      q('cglshift_m_5', 'The ratio 24:36 simplifies to:', ['2:3', '3:2', '4:5', '5:6'], 0, 'Divide both sides by 12.', 'Quantitative Aptitude')
    ];

    const english = [
      q('cglshift_e_1', 'Choose the correct synonym of "Rapid".', ['Slow', 'Swift', 'Mild', 'Calm'], 1, 'Rapid means swift.', 'English'),
      q('cglshift_e_2', 'Choose the correctly spelled word.', ['Occasion', 'Ocassion', 'Occassion', 'Ocaasion'], 0, 'Occasion is correct.', 'English'),
      q('cglshift_e_3', 'Fill in the blank: She has been waiting ___ two hours.', ['since', 'from', 'for', 'by'], 2, 'Use “for” with duration.', 'English'),
      q('cglshift_e_4', 'Choose the correct article: ___ honest man.', ['A', 'An', 'The', 'No article'], 1, 'Honest begins with a vowel sound.', 'English'),
      q('cglshift_e_5', 'Antonym of “Scarce” is:', ['Rare', 'Plenty', 'Little', 'Meagre'], 1, 'The opposite of scarce is plenty/abundant.', 'English')
    ];

    function cloneQuestion(template, idSuffix, section, idx) {
      return {
        ...template,
        id: `${template.id}_${idSuffix}`,
        section,
        explanation: template.explanation
      };
    }

    function buildSection(pool, sectionName, prefix) {
      const output = [];
      for (let i = 0; i < 25; i += 1) {
        const template = pool[i % pool.length];
        output.push(cloneQuestion(template, `${prefix}${i + 1}`, sectionName, i));
      }
      return output;
    }

    return {
      id: 'cgl-foundation-01',
      exam: 'cgl',
      title: 'CGL-2025-12-SEP-SHIFT-3',
      description: 'SSC-style shift mock interface with 100 questions across 4 parts.',
      durationMinutes: 60,
      questionsCount: 100,
      premium: false,
      category: 'Mock',
      level: 'Shift Test',
      questions: [
        ...buildSection(reasoning, 'Reasoning', 'r'),
        ...buildSection(gk, 'General Awareness', 'gk'),
        ...buildSection(maths, 'Quantitative Aptitude', 'm'),
        ...buildSection(english, 'English', 'e')
      ]
    };
  }

  datasets.tests = datasets.tests.map((test) => test.id === 'cgl-foundation-01' ? buildCglShiftMock() : test);

  datasets.tests.forEach((test) => {
    test.questionsCount = test.questions.length;
  });

  window.ExamZenData = datasets;
})();
