// Motorcycle licence rules in Georgia, for licence.html.
// Every fact comes from the Service Agency of the Ministry of Internal Affairs (sa.gov.ge);
// each block lists the page it came from. Re-check these pages when updating, especially fees.

export const CHECKED = '2026-11-13';

const SA = 'https://www.sa.gov.ge';
export const SOURCES = {
  main: `${SA}/s/driver-license`,
  categories: `${SA}/p/driver-license/categories`,
  age: `${SA}/p/driver-license/age`,
  theory: `${SA}/p/driver-license/theoretical-test`,
  practical: `${SA}/p/driver-license/practical-test`,
  expiry: `${SA}/p/driver-license/expiry-date`,
  am: `${SA}/p/am`,
  a: `${SA}/p/akategoria`,
  a1: `${SA}/p/a1qvekategoria`,
  a2: `${SA}/p/a2qvekategoria`,
  booking: `${SA}/p/driver-license/bookingterms`,
  questions: 'https://my.sa.gov.ge/auth',
};

export const CONTENT = {
  en: {
    title: 'Get your motorcycle licence in Georgia',
    lead: 'Riding a motorcycle or a moped needs its own licence category. Here is what the Service Agency asks for, in order, with only the parts that matter for two wheels.',
    checked: 'Checked against the Service Agency website on {date}. Rules and fees can change, so confirm on sa.gov.ge before you book.',
    sourceLabel: 'Source',

    catTitle: 'Which category do you need?',
    catHead: ['Category', 'What you can ride', 'Minimum age'],
    cats: [
      ['AM', 'Moped or light quadricycle: up to 45 km/h, engine up to 50 cm³ or electric motor up to 4 kW', '16'],
      ['A1', 'Light motorcycle: up to 125 cm³ and up to 11 kW', '17'],
      ['A2', 'Motorcycle up to 35 kW, with a power-to-weight ratio up to 0.2 kW/kg', '18'],
      ['A', 'Any motorcycle', '24, or 21 if you have held A2 for at least 2 years'],
    ],
    catNotes: [
      'A higher category includes the lower ones: A covers AM, A1 and A2; A2 covers AM and A1; A1 covers AM. A, A1 and A2 also cover a trike up to 15 kW.',
      'Got category B before 15 December 2014? For A, A1 or A2 you only take the practical test.',
    ],
    catSources: ['categories', 'age', 'a'],

    stepsTitle: 'Step by step',
    steps: [
      {
        title: 'Prepare your documents',
        body: 'Bring your ID and a health certificate on form IV-100/a.',
        list: [
          'Under 18 (AM at 16, A1 at 17): also your birth certificate (original or notarised copy), and a parent with you or their notarised consent.',
          'A1 at 17: also a document from your school or a driving school.',
        ],
        sources: ['a', 'a1', 'am'],
      },
      {
        title: 'Pass the theory test',
        body: 'Book a slot first; for AM booking is not required. You can take the test in Georgian, English, Russian, Armenian, Azerbaijani, Turkish, Abkhaz or Ossetian.',
        list: [
          'A, A1 and A2: 30 questions, at least 27 correct to pass.',
          'AM: 20 questions, at least 18 correct.',
          'Practise with the official question bank at my.sa.gov.ge or in the SERVICE AGENCY app (registration needed).',
        ],
        sources: ['theory', 'booking', 'questions'],
      },
      {
        title: 'Pass the practical test on the training ground',
        body: 'For motorcycles there is no city drive: the training-ground stage is the whole practical test. You have 30 calendar days after the theory test, with free re-sits every 7 days in that period.',
        list: ['Figure of eight', 'Slalom', 'U-turn inside a marked circle'],
        sources: ['practical', 'a'],
      },
      {
        title: 'Collect your licence',
        body: 'The licence is ready within 5 working days of passing. It is valid for 15 years, and you renew it with a new IV-100/a certificate, without an exam.',
        list: [],
        sources: ['main', 'expiry'],
      },
    ],

    feesTitle: 'What it costs',
    feesHead: ['', 'First attempt', 'Each retake'],
    fees: [
      ['A, A1 or A2 theory test (includes making the licence, 15 GEL)', '55 GEL', '40 GEL'],
      ['A1 theory test, under 18', '15 GEL', '40 GEL'],
      ['AM theory test', '15 GEL', '40 GEL'],
      ['Faster licence: ready in 2 working days', '40 GEL', ''],
      ['Faster licence: ready in 1 working day', '50 GEL', ''],
    ],
    feesSources: ['a', 'a1', 'am', 'main'],

    unknownTitle: 'Not on the Service Agency pages we checked',
    unknown: [
      'The fee for the practical test.',
      'Whether adults must train at a driving school before the exams.',
      'Whether a category B licence lets you ride a moped.',
      'Where to get the IV-100/a health certificate.',
    ],
    unknownAsk: 'Ask at any Service Agency hall, or call 1272 (+995 32 2 41 91 91).',

    nextTitle: 'Next',
    next: 'Find a school to practise the figure of eight and slalom before the test.',
    nextLink: 'See riding schools',
  },

  ka: {
    title: 'მოტოციკლის მართვის მოწმობა საქართველოში',
    lead: 'მოტოციკლისა და მოპედის სამართავად საჭიროა ცალკე კატეგორია. აქ არის ის, რასაც მომსახურების სააგენტო ითხოვს, თანმიმდევრობით და მხოლოდ ის, რაც ორბორბლიანებს ეხება.',
    checked: 'გადამოწმებულია მომსახურების სააგენტოს ვებსაიტზე {date}. წესები და საფასური შეიძლება შეიცვალოს, ამიტომ ჯავშნამდე გადაამოწმე sa.gov.ge-ზე.',
    sourceLabel: 'წყარო',

    catTitle: 'რომელი კატეგორია გჭირდება?',
    catHead: ['კატეგორია', 'რისი მართვა შეგიძლია', 'მინიმალური ასაკი'],
    cats: [
      ['AM', 'მოპედი ან მსუბუქი კვადრიციკლი: 45 კმ/სთ-მდე, ძრავა 50 სმ³-მდე ან ელექტროძრავა 4 კვტ-მდე', '16'],
      ['A1', 'მსუბუქი მოტოციკლი: 125 სმ³-მდე და 11 კვტ-მდე', '17'],
      ['A2', 'მოტოციკლი 35 კვტ-მდე, სიმძლავრისა და მასის შეფარდებით 0,2 კვტ/კგ-მდე', '18'],
      ['A', 'ნებისმიერი მოტოციკლი', '24, ან 21, თუ A2 გაქვს მინიმუმ 2 წელი'],
    ],
    catNotes: [
      'მაღალი კატეგორია მოიცავს დაბალს: A მოიცავს AM, A1 და A2-ს; A2 — AM და A1-ს; A1 — AM-ს. A, A1 და A2 ასევე მოიცავს ტრაიკს 15 კვტ-მდე.',
      'B კატეგორია 2014 წლის 15 დეკემბრამდე მიიღე? A, A1 ან A2-სთვის მხოლოდ პრაქტიკულ გამოცდას აბარებ.',
    ],
    catSources: ['categories', 'age', 'a'],

    stepsTitle: 'ნაბიჯ-ნაბიჯ',
    steps: [
      {
        title: 'მოამზადე დოკუმენტები',
        body: 'წაიღე პირადობის დამადასტურებელი დოკუმენტი და ჯანმრთელობის ცნობა (ფორმა IV-100/ა).',
        list: [
          '18 წლამდე (AM 16 წლიდან, A1 17 წლიდან): ასევე დაბადების მოწმობა (დედანი ან ნოტარიულად დამოწმებული ასლი) და მშობელი ან მისი ნოტარიული თანხმობა.',
          'A1 17 წლის ასაკში: ასევე საჯარო სკოლის ან ავტოსკოლის მიერ გაცემული დოკუმენტი.',
        ],
        sources: ['a', 'a1', 'am'],
      },
      {
        title: 'ჩააბარე თეორიული გამოცდა',
        body: 'ჯერ დაჯავშნე რიგი; AM-სთვის ჯავშანი სავალდებულო არ არის. გამოცდის ჩაბარება შეგიძლია ქართულ, ინგლისურ, რუსულ, სომხურ, აზერბაიჯანულ, თურქულ, აფხაზურ ან ოსურ ენებზე.',
        list: [
          'A, A1 და A2: 30 კითხვა, ჩასაბარებლად მინიმუმ 27 სწორი პასუხი.',
          'AM: 20 კითხვა, მინიმუმ 18 სწორი პასუხი.',
          'ივარჯიშე ოფიციალური ბილეთებით my.sa.gov.ge-ზე ან SERVICE AGENCY აპლიკაციაში (საჭიროა რეგისტრაცია).',
        ],
        sources: ['theory', 'booking', 'questions'],
      },
      {
        title: 'ჩააბარე პრაქტიკული გამოცდა მოედანზე',
        body: 'მოტოციკლისთვის ქალაქის ეტაპი არ არის: მოედნის ეტაპი მთელი პრაქტიკული გამოცდაა. თეორიული გამოცდიდან გაქვს 30 კალენდარული დღე, ამ პერიოდში ყოველ 7 დღეში უფასო გასვლით.',
        list: ['რვიანი', 'ზიგზაგი', 'საგაბარიტო წრეში მობრუნება'],
        sources: ['practical', 'a'],
      },
      {
        title: 'აიღე მართვის მოწმობა',
        body: 'მოწმობა მზადდება ჩაბარებიდან 5 სამუშაო დღეში. მოქმედებს 15 წელი და ახალი IV-100/ა ცნობით განახლდება, გამოცდის გარეშე.',
        list: [],
        sources: ['main', 'expiry'],
      },
    ],

    feesTitle: 'რა ღირს',
    feesHead: ['', 'პირველი გასვლა', 'ყოველი შემდეგი'],
    fees: [
      ['A, A1 ან A2 თეორიული გამოცდა (მოწმობის დამზადების 15 ლარის ჩათვლით)', '55 ₾', '40 ₾'],
      ['A1 თეორიული გამოცდა, 18 წლამდე', '15 ₾', '40 ₾'],
      ['AM თეორიული გამოცდა', '15 ₾', '40 ₾'],
      ['დაჩქარებული მოწმობა: 2 სამუშაო დღეში', '40 ₾', ''],
      ['დაჩქარებული მოწმობა: 1 სამუშაო დღეში', '50 ₾', ''],
    ],
    feesSources: ['a', 'a1', 'am', 'main'],

    unknownTitle: 'რაც სააგენტოს გვერდებზე ვერ ვიპოვეთ',
    unknown: [
      'პრაქტიკული გამოცდის საფასური.',
      'სავალდებულოა თუ არა სრულწლოვნისთვის ავტოსკოლაში მომზადება.',
      'B კატეგორიით შეიძლება თუ არა მოპედის მართვა.',
      'სად გაიცემა IV-100/ა ცნობა.',
    ],
    unknownAsk: 'იკითხე სააგენტოს ნებისმიერ სერვის-ცენტრში ან დარეკე 1272-ზე (+995 32 2 41 91 91).',

    nextTitle: 'შემდეგი',
    next: 'იპოვე სკოლა, სადაც გამოცდამდე რვიანსა და ზიგზაგს ივარჯიშებ.',
    nextLink: 'ავტოსკოლების ნახვა',
  },
};
