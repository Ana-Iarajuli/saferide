// Beginner gear advice for gear-guide.html. `category` links a section to the matching
// Sales filter (category values are the scraper's English names, see scraper/normalize.js).

export const CONTENT = {
  en: {
    title: 'Gear basics for new riders',
    lead: 'Good gear turns a fall into a story instead of a hospital visit. You do not need the most expensive kit, but every piece should carry a safety certification. Here is what to check, item by item.',
    orderTitle: 'On a tight budget, buy in this order',
    figureLabel: 'A motorcycle rider in full gear. Choose a piece of gear to read about it.',
    explore: 'Point at a piece of gear, or tap it, to see how to choose it.',
    readMore: 'Go to this section',
    allTitle: 'All the advice in one list',
    look: 'Look for',
    skip: 'Skip',
    shop: 'See {category} on sale',
    sections: [
      {
        id: 'helmet', title: 'Helmet', category: 'Helmets',
        intro: 'The one piece you never ride without. A full-face helmet also protects your chin and jaw; open-face and half helmets leave them bare.',
        look: [
          'ECE 22.06 approval label inside or on the chin strap. It is the current European standard; 22.05 is the older one.',
          'A snug fit: the cheek pads press your cheeks, nothing digs into your forehead, and the helmet does not turn when you shake your head.',
          'Full-face or modular for road riding.',
          'A Pinlock anti-fog insert for the visor, for cold mornings and rain.',
        ],
        skip: [
          'Second-hand helmets. You cannot see damage from an earlier drop.',
          'Any helmet that has hit the ground in a crash. Replace it, even if it looks fine.',
          'Helmets with no approval label.',
        ],
        tip: 'Wear a helmet in the shop for at least 15 minutes before you buy it. Most makers advise replacing a helmet after about 5 years, because the foam liner ages.',
      },
      {
        id: 'gloves', title: 'Gloves', category: 'Gloves',
        intro: 'In a fall your hands go out first. Even a short ride to the shop needs gloves.',
        look: [
          'CE EN 13594 label, level 1 or level 2.',
          'Hard knuckle protection and a reinforced palm or palm slider.',
          'A wrist strap, so the glove cannot come off in a slide.',
          'Pre-curved fingers: you should work the clutch and brake levers without effort.',
        ],
        skip: ['Fashion, work or cycling gloves. They wear through in seconds on asphalt.'],
        tip: 'Two pairs cover the year: vented gloves for summer and waterproof ones for winter. Mountain passes get cold even in July.',
      },
      {
        id: 'jacket', title: 'Jacket', category: 'Jackets & Vests',
        intro: 'A riding jacket resists abrasion and keeps armour on your shoulders and elbows.',
        look: [
          'CE EN 17092 class: AAA is the highest, then AA, then A. Class A is the minimum for city riding.',
          'CE armour in shoulders and elbows (EN 1621-1) and a pocket for a back protector.',
          'Textile with vents for hot summers. Leather resists abrasion best.',
          'A zip that connects the jacket to your trousers.',
        ],
        skip: ['Everyday jackets and hoodies. They have no abrasion resistance and no armour.'],
        tip: 'Try it on in a riding position: with your arms stretched forward, the sleeves should still cover your wrists.',
      },
      {
        id: 'trousers', title: 'Trousers', category: 'Pants',
        intro: 'Ordinary jeans tear open in the first metre of a slide. Riding trousers keep armour on your knees and hips.',
        look: [
          'CE EN 17092 class, as for jackets.',
          'Knee armour with adjustable height.',
          'Hip armour, or pockets to add it.',
          'Riding jeans with an aramid or UHMWPE lining are a practical everyday choice.',
        ],
        skip: ['Plain denim, chinos or sports trousers.'],
        tip: 'Check the knee armour while you sit on a motorcycle. It should cover your knee in that position, not only when you stand.',
      },
      {
        id: 'boots', title: 'Boots', category: 'Boots & Shoes',
        intro: 'Feet and ankles get crushed or twisted even in slow tip-overs.',
        look: [
          'CE EN 13634 label.',
          'A boot that covers the ankle, with a sole that does not twist when you wring it.',
          'Reinforced toe and heel, and a pad for the gear lever.',
          'A grippy sole for putting your foot down on gravel or wet roads.',
        ],
        skip: ['Trainers, and any shoe with laces that can catch on the footpegs.'],
        tip: 'Short riding shoes are a fair compromise for the city. For trips and mountain roads, choose boots that cover the ankle fully.',
      },
      {
        id: 'armour', title: 'Armour and back protector', category: 'Protection',
        intro: 'Armour spreads the force of an impact. Many jackets come with shoulder and elbow armour but an empty back pocket.',
        look: [
          'EN 1621-1 for shoulders, elbows, hips and knees; EN 1621-2 for the back.',
          'Level 2 absorbs more force than level 1.',
          'A back protector: an insert for your jacket or a separate strap-on one.',
        ],
        skip: ['Soft foam pads that come with cheap jackets. They look like armour but carry no certification.'],
        tip: 'A level 2 back insert is one of the cheapest safety upgrades you can make.',
      },
      {
        id: 'visibility', title: 'Visibility and rain', category: null,
        intro: 'Drivers often say they never saw the motorcycle. Make yourself easy to see, and stay dry enough to concentrate.',
        look: [
          'Bright or reflective panels on your jacket and helmet.',
          'A reflective vest over dark gear when you ride at night.',
          'A rain suit that packs small enough to carry every day.',
          'A neck tube and a thermal base layer for mountain roads.',
        ],
        skip: ['All-black gear with no reflective parts for night riding.'],
        tip: 'Ride with your headlight on during the day too.',
      },
    ],
  },

  ka: {
    title: 'ეკიპირების საფუძვლები დამწყებთათვის',
    lead: 'კარგი ეკიპირება დაცემას საავადმყოფოს ნაცვლად უბრალო ამბად აქცევს. ყველაზე ძვირი ეკიპირება არ გჭირდება, მაგრამ ყველა ნივთს უნდა ჰქონდეს უსაფრთხოების სერტიფიკატი. აქ არის, რა უნდა შეამოწმო, ნივთ-ნივთ.',
    orderTitle: 'შეზღუდული ბიუჯეტით იყიდე ამ თანმიმდევრობით',
    figureLabel: 'მოტოციკლისტი სრული ეკიპირებით. აირჩიე ეკიპირების ნაწილი და წაიკითხე მის შესახებ.',
    explore: 'მიიტანე კურსორი ეკიპირების ნაწილზე ან შეეხე მას და ნახე, როგორ აირჩიო.',
    readMore: 'ამ განყოფილებაზე გადასვლა',
    allTitle: 'ყველა რჩევა ერთ სიაში',
    look: 'მიაქციე ყურადღება',
    skip: 'არ იყიდო',
    shop: 'ფასდაკლებები: {category}',
    sections: [
      {
        id: 'helmet', title: 'ჩაფხუტი', category: 'Helmets',
        intro: 'ერთადერთი ნივთი, რომლის გარეშეც არასდროს მართავ. დახურული ჩაფხუტი ნიკაპსა და ყბასაც იცავს; ღია და ნახევარ ჩაფხუტებში ისინი დაუცველია.',
        look: [
          'ECE 22.06 სერტიფიკატის ეტიკეტი შიგნით ან ნიკაპის ღვედზე. ეს მოქმედი ევროპული სტანდარტია; 22.05 ძველია.',
          'მჭიდრო მორგება: ლოყის ბალიშები ლოყებს აწვება, შუბლზე არაფერი გაწვება და თავის ქნევისას ჩაფხუტი არ ტრიალებს.',
          'გზაზე სამართავად დახურული ან მოდულური ჩაფხუტი.',
          'Pinlock-ის საწინააღმდეგო ჩანართი ვიზორზე, ცივი დილისა და წვიმისთვის.',
        ],
        skip: [
          'მეორადი ჩაფხუტი. წინა დაცემის დაზიანებას ვერ დაინახავ.',
          'ჩაფხუტი, რომელიც ავარიისას დაეცა. შეცვალე, მაშინაც კი, თუ კარგად გამოიყურება.',
          'ჩაფხუტი სერტიფიკატის ეტიკეტის გარეშე.',
        ],
        tip: 'ყიდვამდე მაღაზიაში ჩაფხუტი მინიმუმ 15 წუთი გეხუროს. მწარმოებლების უმეტესობა ჩაფხუტის შეცვლას დაახლოებით 5 წელიწადში ურჩევს, რადგან შიდა ფენა ბერდება.',
      },
      {
        id: 'gloves', title: 'ხელთათმანები', category: 'Gloves',
        intro: 'დაცემისას პირველად ხელებს იშვერ. მაღაზიამდე მოკლე გასვლასაც ხელთათმანები სჭირდება.',
        look: [
          'CE EN 13594 ეტიკეტი, 1-ლი ან მე-2 დონე.',
          'მყარი დაცვა თითის სახსრებზე და გამაგრებული ხელისგული.',
          'მაჯის ღვედი, რომ სრიალისას ხელთათმანი არ გაგძვრეს.',
          'წინასწარ მოხრილი თითები: გადაბმულობისა და მუხრუჭის ბერკეტები ძალისხმევის გარეშე უნდა იმართებოდეს.',
        ],
        skip: ['მოდური, სამუშაო ან ველოსიპედის ხელთათმანები. ასფალტზე წამებში იცვითება.'],
        tip: 'მთელი წლისთვის ორი წყვილი საკმარისია: სავენტილაციო ზაფხულისთვის და წყალგაუმტარი ზამთრისთვის. მთის უღელტეხილებზე ივლისშიც ცივა.',
      },
      {
        id: 'jacket', title: 'ქურთუკი', category: 'Jackets & Vests',
        intro: 'მოტოქურთუკი ცვეთას უძლებს და დამცავებს მხრებსა და იდაყვებზე იჭერს.',
        look: [
          'CE EN 17092 კლასი: AAA ყველაზე მაღალია, შემდეგ AA და A. ქალაქში სამართავად მინიმუმ A კლასია საჭირო.',
          'CE დამცავები მხრებსა და იდაყვებზე (EN 1621-1) და ჯიბე ზურგის დამცავისთვის.',
          'სავენტილაციო ქსოვილი ცხელი ზაფხულისთვის. ტყავი ცვეთას ყველაზე კარგად უძლებს.',
          'ელვა, რომელიც ქურთუკს შარვალთან აერთებს.',
        ],
        skip: ['ყოველდღიური ქურთუკები და ჰუდები. მათ არც ცვეთამედეგობა აქვთ და არც დამცავები.'],
        tip: 'მოირგე მართვის პოზაში: წინ გაშლილი ხელებით სახელოებმა მაჯები მაინც უნდა დაფაროს.',
      },
      {
        id: 'trousers', title: 'შარვალი', category: 'Pants',
        intro: 'ჩვეულებრივი ჯინსი სრიალის პირველივე მეტრზე იხევა. მოტოშარვალი დამცავებს მუხლებსა და თეძოებზე იჭერს.',
        look: [
          'CE EN 17092 კლასი, ისევე როგორც ქურთუკზე.',
          'მუხლის დამცავი, რომლის სიმაღლე რეგულირდება.',
          'თეძოს დამცავი ან ჯიბეები მის დასამატებლად.',
          'მოტოჯინსი არამიდის ან UHMWPE-ს სარჩულით ყოველდღიური პრაქტიკული არჩევანია.',
        ],
        skip: ['ჩვეულებრივი ჯინსი, ჩინოსი ან სპორტული შარვალი.'],
        tip: 'მუხლის დამცავი მოტოციკლზე ჯდომისას შეამოწმე. მუხლი ამ პოზაში უნდა ფაროს და არა მხოლოდ ფეხზე დგომისას.',
      },
      {
        id: 'boots', title: 'ჩექმები', category: 'Boots & Shoes',
        intro: 'ტერფი და კოჭი ნელი წაქცევისასაც კი ადვილად ზიანდება.',
        look: [
          'CE EN 13634 ეტიკეტი.',
          'ჩექმა, რომელიც კოჭს ფარავს, და ძირი, რომელიც გადაგრეხისას არ იგრიხება.',
          'გამაგრებული ცხვირი და ქუსლი, და ბალიში სიჩქარის ბერკეტისთვის.',
          'არამოცურებადი ძირი ხრეშზე ან სველ გზაზე ფეხის დასადგმელად.',
        ],
        skip: ['სპორტული ფეხსაცმელი და ნებისმიერი ფეხსაცმელი თასმებით, რომლებიც საფეხურებს შეიძლება წამოედოს.'],
        tip: 'მოკლე მოტოფეხსაცმელი ქალაქისთვის კარგი კომპრომისია. მოგზაურობისა და მთის გზებისთვის აირჩიე ჩექმა, რომელიც კოჭს სრულად ფარავს.',
      },
      {
        id: 'armour', title: 'დამცავები და ზურგის დამცავი', category: 'Protection',
        intro: 'დამცავი დარტყმის ძალას ანაწილებს. ბევრ ქურთუკს მხრისა და იდაყვის დამცავები აქვს, ზურგის ჯიბე კი ცარიელია.',
        look: [
          'EN 1621-1 მხრებისთვის, იდაყვებისთვის, თეძოებისა და მუხლებისთვის; EN 1621-2 ზურგისთვის.',
          'მე-2 დონე უფრო მეტ ძალას შთანთქავს, ვიდრე 1-ლი.',
          'ზურგის დამცავი: ჩანართი ქურთუკისთვის ან ცალკე, ღვედებიანი.',
        ],
        skip: ['რბილი ღრუბლის ბალიშები იაფ ქურთუკებში. დამცავს ჰგავს, მაგრამ სერტიფიკატი არ აქვს.'],
        tip: 'მე-2 დონის ზურგის ჩანართი უსაფრთხოების ერთ-ერთი ყველაზე იაფი გაუმჯობესებაა.',
      },
      {
        id: 'visibility', title: 'ხილვადობა და წვიმა', category: null,
        intro: 'მძღოლები ხშირად ამბობენ, რომ მოტოციკლი ვერ დაინახეს. გახადე თავი ადვილად შესამჩნევი და დარჩი იმდენად მშრალი, რომ ყურადღება არ გაგეფანტოს.',
        look: [
          'ნათელი ან ამრეკლი ელემენტები ქურთუკსა და ჩაფხუტზე.',
          'ამრეკლი ჟილეტი მუქ ეკიპირებაზე ღამით მართვისას.',
          'საწვიმარი კოსტიუმი, რომელიც იმდენად პატარად იკეცება, რომ ყოველდღე თან ატარო.',
          'კისრის სათბური და თერმოსაცვალი მთის გზებისთვის.',
        ],
        skip: ['მთლიანად შავი ეკიპირება ამრეკლი ელემენტების გარეშე ღამით სამართავად.'],
        tip: 'დღისითაც ჩართული ფარით იარე.',
      },
    ],
  },
};

// priority order for a tight budget (section ids)
export const BUY_ORDER = ['helmet', 'gloves', 'jacket', 'boots', 'trousers'];
