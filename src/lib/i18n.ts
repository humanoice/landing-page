import "server-only";
import type { Language, ProgrammingLanguage, Skill } from "@/lib/apply-options";

export type Locale = "en" | "th";

/** The 2-day hardware + programming course — same content for factories and uni / school. */
const B2B_PROGRAM_EN = [
  {
    name: "Hardware",
    blurb: "Build it with your own hands.",
    items: [
      ["Mechanical build", "Legs, arms, and body, assembled from parts."],
      ["Wiring & controller board", "Power and signal to every joint, run by one board."],
      ["Motors & IMU", "How a humanoid moves, and how it knows which way is up."],
    ],
  },
  {
    name: "Software",
    blurb: "Then make it move.",
    items: [
      ["ROS 2 & URDF", "Model the body and drive every joint from code."],
      ["MuJoCo simulation", "Rehearse motion in real physics before it touches hardware."],
      ["Reinforcement learning", "Train the policy that makes it walk."],
    ],
  },
];

const en = {
  nav: {
    education: "Education",
    about: "About us",
    apply: "Apply",
    language: "Language",
    menu: "Menu",
  },
  hero: {
    eyebrow: "Humanoid School · Bangkok",
    title: ["Learn to", "", "build humanoids."],
    description:
      "Thailand's first hands-on humanoid school. From raw materials to full deployment — you assemble, program, and deploy a real humanoid.",
    join: "Apply",
    curriculum: "See the curriculum",
    reel: {
      alt: "Students laying out parts, testing a board with a multimeter, and walking a humanoid on a gantry at the Humanoice workshop",
    },
    facts: [
      ["Location", "Phra Khanong, Bangkok"],
      ["Courses", "2 · Monthly"],
    ],
  },
  curriculum: {
    eyebrow: "// Public courses",
    title: "Pick your",
    highlight: "course",
    track: "Track",
    note: "Each course runs once a month and goes ahead with 2 or more people.",
    tracks: [
      {
        name: "Humanoid Building",
        tag: "Hardware",
        duration: "8 hours",
        price: "4,900 THB",
        blurb:
          "It's like IKEA but for humanoids — build the legs, arms, and body yourself, then wire it up.",
        cta: "Apply",
        items: [
          [
            "Mechanical build",
            "Legs, arms, and body — build the joints that carry all the weight.",
          ],
          [
            "Wiring",
            "Run power and signal to every joint, neatly enough to debug later.",
          ],
          [
            "Controller board",
            "The board that turns commands into motion, and how it talks to each motor.",
          ],
          [
            "Motors & IMU",
            "How a humanoid moves, and how it knows which way is up.",
          ],
        ],
      },
      {
        name: "Physical AI Basic",
        tag: "Software",
        duration: "6 hours",
        price: "2,900 THB",
        blurb:
          "Modern software for humanoids: model the body, simulate it, and train it to walk.",
        cta: "Apply",
        items: [
          [
            "ROS 2",
            "The framework every modern robot runs on — nodes, topics, and control loops.",
          ],
          [
            "URDF",
            "Model a humanoid's body so your code knows every link and joint.",
          ],
          [
            "MuJoCo",
            "Rehearse every motion in real physics before it touches hardware.",
          ],
          [
            "Reinforcement learning",
            "Train the policy that makes the robot walk.",
          ],
        ],
      },
    ],
  },
  team: {
    eyebrow: "// Team",
    title: "Meet your",
    highlight: "instructors",
    roles: ["CEO", "Senior Robotic Engineer", "Physical AI Engineer"],
    blurbs: [
      "On a mission to make Thailand the Shenzhen of Southeast Asia",
      "Robot enthusiast with intensive background in the automation industry",
      "Senior product manager who loves applying intelligence to the physical world",
    ],
  },
  partners: {
    eyebrow: "// Open-Source Partners",
    title: "We build on",
    highlight: "open robots",
    asimov:
      "Asimov 1, Here Be Dragons Edition — open-source humanoid robot by Menlo Research.",
    roboparty:
      "ROBOTO ORIGIN, open-source humanoid robot by a Shanghai-based company.",
    lerobot:
      "SO-ARM 101, open-source robot arm from Hugging Face's LeRobot project.",
  },
  faq: {
    eyebrow: "// FAQ",
    title: "Questions,",
    highlight: "answered",
    items: [
      {
        q: "No background at all — can I still join?",
        a: "Yes. Humanoid Building and Physical AI Basic both start from zero, so you don't need any coding background. We walk you through every step on the day.",
      },
      {
        q: "How long is each course, and how often does it run?",
        a: "Humanoid Building is 8 hours; Physical AI Basic is 6 hours. Each runs once a month and goes ahead with 2 or more people — dates and times are on the application page.",
      },
      {
        q: "Why learn to build a humanoid?",
        a: "Because once you’ve built one yourself, you understand it to the core. As Confucius put it: “I hear and I forget. I see and I remember. I do and I understand.”",
      },
      {
        q: "What do I walk away with?",
        a: "A certificate from Humanoice — and the experience of having built a real humanoid with your own hands.",
      },
      {
        q: "Which humanoid do we learn on, and what are its specs?",
        a: "1.25 m tall, 34 kg, 23 degrees of freedom, joints up to 120 N·m, and a 48 V / 15 Ah battery.",
      },
      {
        q: "How old do I need to be to join?",
        a: "15+ for the public courses. This is real mechanical and electrical work — it can be dangerous if you’re careless. For ages 12–18, book a private Kids session.",
      },
      {
        q: "Can you train my team, class, or kids privately?",
        a: "Yes. Factories, universities, schools, and families book private sessions at their place or our lab. Pick yours under Education, then chat with us on LINE for a quote.",
      },
      {
        q: "What language do you teach in?",
        a: "Thai or English — whichever the room needs.",
      },
    ],
  },
  /** Private (B2B) training: the home teaser, the nav dropdown, and /education/[segment]. No prices — every CTA is LINE. */
  education: {
    eyebrow: "// Education",
    title: "Private training for",
    highlight: "your team",
    intro: "We bring the humanoid to your factory, campus, or home — or you come to our lab.",
    more: "See the program",
    line: "Chat on LINE",
    programEyebrow: "// The program",
    whyEyebrow: "// Why it works",
    /** Indexed by EducationSegment — see EDUCATION_SEGMENTS below. */
    segments: {
      factory: {
        nav: "Factory",
        hint: "Physical AI for your floor",
        who: "Managers & engineers",
        meta: "2 days · 2–8 people",
        title: "Humanoid training for factories",
        description:
          "A private 2-day humanoid course for your team: build a real humanoid, then program it with ROS 2, MuJoCo, and reinforcement learning. At your factory or our Bangkok lab.",
        eyebrow: "Education · Factory",
        heading: ["Humanoids for", "your factory."],
        lead: "Before you bet on physical AI, build one. Your team assembles a real humanoid and programs it in two days.",
        facts: [
          ["Team", "2–8 people"],
          ["Length", "2 days"],
          ["Where", "Your factory or our lab"],
          ["Price", "Quote on LINE"],
        ],
        programTitle: "What your team",
        programHighlight: "builds",
        program: B2B_PROGRAM_EN,
        whyTitle: "What you",
        whyHighlight: "walk away with",
        why: [
          [
            "Judgement, not hype",
            "You'll know what a humanoid can and can't do yet — from building one, not from a demo video.",
          ],
          [
            "A shared language",
            "Your engineers learn the stack behind physical AI: ROS 2, simulation, and RL.",
          ],
          [
            "A path to a pilot",
            "Keep a kit on site and keep testing ideas on your own line.",
          ],
        ],
        kit: true,
      },
      school: {
        nav: "Uni / School",
        hint: "A research platform for your students",
        who: "Professors & robotics clubs",
        meta: "2 days · 2–8 students",
        title: "Humanoid training for universities and schools",
        description:
          "A private 2-day humanoid course for students: build a real open-source humanoid, then program it with ROS 2, MuJoCo, and reinforcement learning. On campus or at our Bangkok lab.",
        eyebrow: "Education · Uni / School",
        heading: ["Humanoids for", "your campus."],
        lead: "Give your students a real humanoid to build, program, and research on — then keep it as your lab's platform.",
        facts: [
          ["Group", "2–8 students"],
          ["Length", "2 days"],
          ["Where", "Your campus or our lab"],
          ["Price", "Quote on LINE"],
        ],
        programTitle: "What your students",
        programHighlight: "build",
        program: B2B_PROGRAM_EN,
        whyTitle: "What your lab",
        whyHighlight: "gets",
        why: [
          [
            "A lab that looks ahead",
            "A walking humanoid on campus shows your program teaches what's next.",
          ],
          [
            "An open research platform",
            "Open-source hardware and software, so students can take it apart, change it, and publish.",
          ],
          [
            "Builders who can fix it",
            "The students who assembled it know every joint, so the robot keeps working after we leave.",
          ],
        ],
        kit: true,
      },
      kids: {
        nav: "Kids",
        hint: "Build a real humanoid, ages 12–18",
        who: "Ages 12–18",
        meta: "8 hours · 1–6 kids",
        title: "Humanoid building for kids",
        description:
          "A private 8-hour humanoid build for kids aged 12–18: assemble a real humanoid's legs, arms, and body, then drive it with a joystick. At your home or our Bangkok lab.",
        eyebrow: "Education · Kids",
        heading: ["Build a", "real humanoid."],
        lead: "No theory, no slides. Your kids assemble a real humanoid in one day, then take the joystick and make it walk.",
        facts: [
          ["Age", "12–18"],
          ["Group", "1–2 or 3–6 kids"],
          ["Length", "8 hours"],
          ["Where", "Your home or our lab"],
        ],
        programTitle: "What they",
        programHighlight: "build",
        program: [
          {
            name: "Build it",
            blurb: "A real humanoid, assembled with their own hands.",
            items: [
              ["Legs", "Hips, knees, and ankles — the joints that carry all the weight."],
              ["Body", "The torso every other part hangs off."],
              ["Arms", "Shoulders to wrists, joint by joint."],
            ],
          },
          {
            name: "Drive it",
            blurb: "Then the fun part.",
            items: [
              ["Joystick control", "Take the controller and make the robot move."],
              ["First steps", "Walk the humanoid they just built."],
            ],
          },
        ],
        whyTitle: "What they",
        whyHighlight: "take home",
        why: [
          [
            "A portfolio piece",
            "A Humanoice certificate, and a robot they can say they built themselves.",
          ],
          [
            "A real test of interest",
            "One day at the bench shows whether robotics is their thing.",
          ],
          [
            "Close supervision",
            "Small groups, with instructors at the bench the whole time.",
          ],
        ],
        kit: false,
      },
    },
    /** "Own one" block on the factory and uni/school pages. */
    kit: {
      eyebrow: "// Own one",
      title: "Keep a humanoid",
      highlight: "on site",
      intro: "Buy the same humanoid we teach on, and we'll keep it running.",
      offers: [
        {
          name: "Humanoid kit",
          tag: "Buy",
          items: [
            "The humanoid we teach on",
            "The tools to build and service it",
            "A crane to hang it from while it learns to walk",
          ],
        },
        {
          name: "Maintenance support",
          tag: "12 months",
          items: [
            "Two on-site check-ups",
            "Free repairs and replacements for wear and tear",
            "Damage from misuse is billed separately",
          ],
        },
      ],
      cta: "Ask about a kit",
    },
  },
  about: {
    title: "About us",
    description:
      "Humanoice is a hands-on humanoid robotics lab in Phra Khanong, Bangkok — public courses, private training, and humanoid kits.",
    eyebrow: "// About us",
    heading: ["We build", "humanoids."],
    lead: "Humanoice (ฮิวแมนน้อย) is a humanoid robotics lab in Phra Khanong, Bangkok. We teach people to build real open-source humanoids, and we sell and service the robots too.",
    mission: {
      eyebrow: "// Our mission",
      text: "Make Thailand the Shenzhen of Southeast Asia.",
      link: "Read the master plan",
    },
    whatEyebrow: "// What we do",
    whatTitle: "Three ways",
    whatHighlight: "in",
    what: [
      ["Public courses", "Humanoid Building and Physical AI Basic, once a month at our lab. Book a seat online."],
      ["Private training", "For factories, universities, schools, and kids — at your place or ours."],
      ["Humanoid kits", "Buy the robot we teach on, with a year of maintenance support."],
    ],
  },
  footer: {
    ticker: "Make Thailand the Shenzhen of Southeast Asia",
    location: "Phra Khanong, Bangkok",
    title: "Add LINE",
    highlight: "for details",
    qrLabel: "@humanoice",
  },
  /** Flash Sale popup, 21–26 Oct 2026 — temporary. */
  flashSale: {
    label: "Flash sale",
    alt: "Flash sale: 50% off when you apply between 21 and 26 Oct 2026",
    close: "Close",
    /** Before the code, on home: "Code FLASHSALE" */
    note: "// Code",
    /** Before the code, on /apply: "Already in your form: FLASHSALE" */
    applied: "// Already in your form:",
    cta: "Claim 50% off",
    ok: "Got it",
  },
  plan: {
    title: "The Master Plan",
    description:
      "Make Thailand the Shenzhen of Southeast Asia. A humanoid bootcamp, a robotics installer, and a parts factory — each step pays for the next.",
    home: "Home",
    heading: "Make Thailand the Shenzhen of Southeast Asia.",
    date: "Bangkok · 2026",
    paragraphs: [
      "The world's robots are dreamed up in one country and bolted together in another. We don't think the next wave — humanoids — has to follow that old map. It can be designed, built, and shipped from right here.",
      "But you can't manufacture what you can't build, and you can't build what no one's been taught to build. So we start with people. Thailand already has the makers, the curiosity, and the manufacturing roots. What's missing is a place to learn humanoids end to end — from the first bolt to a robot that walks out the door. That's where we begin.",
      "From there, the plan compounds. Skilled builders become a business that puts robots to work. That business funds the factory that makes the parts.",
    ],
    emphasis: "Each step pays for the next.",
    short: "So, in short, the master plan is:",
    steps: [
      [
        "Create a humanoid bootcamp",
        "Teach people to build humanoids end to end — assembly, simulation, and deployment — on real open-source platforms.",
      ],
      [
        "Become a robotics installer",
        "Use the profit and the talent we produce to put humanoids to work across Thai industry.",
      ],
      [
        "Make the parts",
        "Use the profit to manufacture the actuators and sensors the replacement market will need.",
      ],
    ],
  },
  apply: {
    title: "Apply",
    description:
      "Tell us about yourself, choose the track, we'll confirm you a seat in a few days.",
    home: "Home",
    eyebrow: "// Application",
    heading: ["Book a", "seat."],
    sticker: "~2 min",
    intro:
      "Tell us about yourself, choose the track, we'll confirm you a seat in a few days.",
    sections: {
      about: "About you",
      background: "Your background",
      course: "Pick your track",
      payer: "Receipt & payment",
    },
    optional: "optional",
    /** Shown under the email field while / after we look a returning applicant up. */
    lookup: {
      checking: "Looking you up…",
      /** We filled the form in ourselves. */
      found: "Welcome back — we filled in what we already have. Change anything that's out of date.",
      /** We know them, but they'd already started typing, so it's their call. */
      known: "We've got you on file. Want your saved answers filled in?",
      fill: "Use my saved details",
    },
    fields: {
      firstName: "First name",
      lastName: "Last name",
      nickname: "Nickname",
      email: "Email",
      phone: "Phone",
      lineId: "LINE ID",
      jobTitle: "Job title",
      company: "Company / university",
      languages: "Languages you can speak",
      roboticsYears: "Years in robotics",
      programmingYears: "Years programming",
      programmingLanguages: "Languages & tools you use",
      skills: "Hands-on skills",
      discountCode: "Discount code",
    },
    backgroundHint:
      "Your answwer will increase the chance of acceptance",
    courseHint: "Pick a date in the track you want — or one in each.",
    languages: { th: "Thai", en: "English" } satisfies Record<Language, string>,
    programmingLanguages: {
      python: "Python",
      cpp: "C / C++",
      plc: "PLC",
      javascript: "JavaScript",
      linux: "Linux",
      ros: "ROS",
    } satisfies Record<ProgrammingLanguage, string>,
    skills: {
      electronics: "Electronics",
      mechanics: "Mechanics",
      cad: "CAD / 3D printing",
      ml: "Machine learning",
    } satisfies Record<Skill, string>,
    course: {
      track: "Track",
      // indexed by courses.track_no − 1
      trackTags: ["Hardware", "Software", "B2B"],
      pickDate: "Pick a date",
      /** Drops this track's pick, for someone who only wants the other one. */
      clear: "Clear",
      dayUnit: ["day", "days"],
      priceUnit: "THB",
      priceTbd: "Talk to us",
      seatsLeft: ["seat left", "seats left"],
      full: "Full",
      empty:
        "No runs are open right now. Add us on LINE and we'll ping you the moment the next one opens.",
      line: "Add LINE",
      /** The two-track bundle line: the words either side of BUNDLE_PERCENT (src/lib/payment.ts). */
      bundle: ["Pick both tracks and ", "% comes off the total."],
    },
    submit: "Send application",
    submitting: "Sending…",
    errors: {
      required: "Required",
      email: "That doesn't look like an email",
      number: "Whole years, please",
      course: "Pick at least one date",
      oneTrack: "One date per track, please",
      full: "That run just filled up — pick another date",
      rateLimit: "Too many tries just now. Give it a few minutes, or ping us on LINE.",
      server: "Something broke on our side. Try again, or ping us on LINE.",
      payer: "Pick one",
      discountInvalid: "That code isn't one of ours",
      discountExpired: "That code has expired",
      discountExhausted: "That code has been used up",
    },
    success: {
      eyebrow: "// Thank you",
      title: "Registration complete",
      highlight: "Payment pending",
      body: "Your seat will only be confirmed after payment. Please add us on LINE to make your payment.",
      line: "Pay via LINE",
      qrLabel: "@humanoice",
    },
    /** Section 04: who pays, what goes on the receipt, and a live total. */
    payer: {
      hint: "Who's paying? It sets the amount to transfer and what goes on the receipt.",
      individual: "Individual",
      individualHint: "Paying yourself",
      company: "Company",
      companyHint: "Your company pays",
      individualNote: "Receipt details are optional — fill them in if you'd like the receipt in your name.",
      companyNote:
        "A company deducts 3% withholding tax at source, so you transfer 97% and send us the withholding tax certificate (50 ทวิ).",
      fields: {
        individual: {
          name: "Full name on the receipt",
          taxId: "National ID / passport no.",
          address: "Address",
        },
        company: { name: "Company name", taxId: "Tax ID", address: "Registered address" },
      },
      /** The live check on a discount code; failures keyed by DiscountReason (src/lib/discount.ts). */
      discount: {
        checking: "Checking the code…",
        /** Around the percent: "Code applied — 20% off" */
        applied: ["Code applied —", "% off"],
        failed: {
          invalid: "That code isn't one of ours",
          expired: "That code has expired",
          exhausted: "That code has been used up",
        },
      },
      preview: {
        title: "What you'll transfer",
        fee: "Course fee",
        bundle: "Both-tracks bundle",
        discount: "Discount",
        withholding: "3% withholding tax",
        due: "Transfer",
        pickFirst: "Pick a date above and the amount shows up here.",
        onRequest: "Price on request — we'll sort payment out on LINE.",
      },
    },
    /** Step 2: bank details, slip upload, and what to say when the slip doesn't pass. */
    pay: {
      eyebrow: "// Step 2 of 2",
      title: "Transfer,",
      highlight: "then upload the slip.",
      intro:
        "Transfer the amount below to our Kasikorn account, then upload the slip. We check it on the spot — it takes up to a minute.",
      runs: "Your seats",
      amount: "Amount to transfer",
      withholdingNote: "3% withholding tax deducted",
      discountNote: "discount code applied",
      /** Around the percent: "20% off for both tracks" */
      bundleNote: ["", "% off for both tracks"],
      bank: "Kasikorn Bank",
      accountName: "Account name",
      copy: "Copy",
      copied: "Copied!",
      slip: "Transfer slip",
      slipHint: "A screenshot from your banking app. JPEG, PNG or WebP, up to 4 MB.",
      choose: "Choose image",
      change: "Change image",
      submit: "Verify payment",
      submitting: "Checking your slip…",
      errors: {
        missingSlip: "Add the slip image first",
        unsupportedType: "JPEG, PNG or WebP only",
        tooLarge: "That image is over 4 MB — a screenshot is plenty",
        rateLimit: "Too many tries just now. Give it a few minutes, or send the slip on LINE.",
        expired: "This payment link has gone stale. Send the form again — your answers are saved.",
        server: "We couldn't check the slip just now. Try again, or send it on LINE.",
      },
      rejected: {
        eyebrow: "// Hmm",
        title: "That slip",
        highlight: "didn't match",
        // keyed by SlipIssue (src/lib/slip.ts)
        issues: {
          unreadable: "We couldn't read the image. Try a clearer screenshot — or send it on LINE.",
          notSlip: "That doesn't look like a transfer slip. Upload the screenshot from your banking app.",
          recipient: "The recipient isn't our account. Check it's Kasikorn 238-1-20282-0, บจก. ฮิวแมน น้อย.",
          amount:
            "The amount doesn't match what's due. If you paid a different figure, send the slip on LINE and we'll sort it out.",
          suspicious:
            "Something about that slip didn't look right to us. Send it on LINE and a human will check it properly.",
          duplicate: "That slip has already been used for another seat. If that's a mistake, tell us on LINE.",
        },
        body: "If you did pay, your seat isn't lost — send us the slip on LINE and a human will sort it out.",
        line: "Send slip on LINE",
        retry: "Or try another image below.",
      },
    },
    /** The end of the road: paid, invited, done. */
    paid: {
      eyebrow: "// You're in",
      title: "Seat",
      highlight: "confirmed.",
      /** Wraps the email address: [before, after]. */
      body: ["Payment received. We've emailed a calendar invite to", "— add us on LINE for updates before the day."],
      /** Same shape, for a seat a discount code covered in full. */
      bodyFree: ["Your code covers the whole fee, so there's nothing to transfer. We've emailed a calendar invite to", "— add us on LINE for updates before the day."],
      runs: "Your bootcamp",
      where: "Where",
      map: "Open in Google Maps",
      calendar: "Add to Google Calendar",
      line: "Add LINE for updates",
      qrLabel: "@humanoice",
    },
    /** How to get here. Shown on the paid panel, in the email, and as the calendar event's description. */
    directions: {
      title: "How to get to Humanoice",
      steps: [
        "BTS Phra Khanong (5-minute walk)",
        "Driving (we have limited parking space — first come, first served)",
      ],
      landmark: "The Humanoice lab is next to the Chapter Optical glasses shop.",
      laptop: "If you're coming to learn software, please bring your laptop.",
      onTime: "Please arrive on time — we start on time.",
      questions: "If you have any questions, reach us on LINE @humanoice.",
    },
    /** The confirmation email (src/lib/email.ts). */
    email: {
      subject: "You're in",
      greeting: "Hi",
      body: "Payment received — your seat is confirmed. Here's what's coming up:",
      /** For a seat a discount code covered in full. */
      bodyFree: "Your code covers the whole fee — your seat is confirmed. Here's what's coming up:",
      calendarLink: "Add to Google Calendar",
      where: "Where",
      map: "Open in Google Maps",
      calendar: "The calendar invite is attached — accept it and the dates land in your calendar.",
      lineCta: "Add LINE",
      signoff: "See you at the workshop,",
      team: "The Humanoice team",
    },
  },
};

export type HomeDictionary = Omit<typeof en, "plan" | "apply">;
export type EducationCopy = typeof en.education;
export type AboutCopy = typeof en.about;
export type MasterPlanCopy = typeof en.plan;
export type ApplyCopy = typeof en.apply;
type ThaiDictionary = HomeDictionary & { apply: ApplyCopy };

const B2B_PROGRAM_TH: typeof B2B_PROGRAM_EN = [
  {
    name: "ฮาร์ดแวร์",
    blurb: "ประกอบด้วยมือตัวเอง",
    items: [
      ["ประกอบกลไก", "ขา แขน และลำตัว ประกอบจากชิ้นส่วน"],
      ["สายไฟ & บอร์ดควบคุม", "ไฟและสัญญาณไปถึงทุกข้อต่อ ควบคุมด้วยบอร์ดเดียว"],
      ["มอเตอร์ & IMU", "ฮิวแมนนอยด์ขยับได้ยังไง และรู้ได้ยังไงว่าทางไหนคือข้างบน"],
    ],
  },
  {
    name: "ซอฟต์แวร์",
    blurb: "แล้วทำให้มันขยับ",
    items: [
      ["ROS 2 & URDF", "สร้างโมเดลร่างกาย แล้วสั่งทุกข้อต่อด้วย code"],
      ["จำลองใน MuJoCo", "ซ้อมการเคลื่อนไหวในฟิสิกส์จำลองก่อนลงหุ่นจริง"],
      ["Reinforcement learning", "เทรน policy ที่ทำให้มันเดินได้"],
    ],
  },
];

const th: ThaiDictionary = {
  nav: {
    education: "การศึกษา",
    about: "เกี่ยวกับเรา",
    apply: "สมัคร",
    language: "ภาษา",
    menu: "เมนู",
  },
  hero: {
    eyebrow: "โรงเรียนสอนฮิวแมนนอยด์ · กรุงเทพฯ",
    title: ["เรียนการสร้าง", "", "ฮิวแมนนอยด์"],
    description:
      "โรงเรียนสอนประกอบฮิวแมนนอยด์ แบบลงมือทำแห่งแรกของไทย ตั้งแต่ชิ้นส่วนแรกจนพร้อมใช้งานจริง — คุณจะได้ประกอบ เขียนโปรแกรม และพาฮิวแมนนอยด์เดิน",
    join: "สมัคร",
    curriculum: "มาดูหลักสูตร",
    reel: {
      alt: "นักเรียนกำลังจัดวางชิ้นส่วน ทดสอบบอร์ดด้วยมัลติมิเตอร์ และพาฮิวแมนนอยด์เดินบนราวช่วยพยุงที่เวิร์กช็อปของ Humanoice",
    },
    facts: [
      ["สถานที่", "พระโขนง, กรุงเทพฯ"],
      ["คอร์ส", "2 คอร์ส · ทุกเดือน"],
    ],
  },
  curriculum: {
    eyebrow: "// คอร์สทั่วไป",
    title: "เลือกคอร์ส",
    highlight: "ของคุณ",
    track: "คอร์ส",
    note: "แต่ละคอร์สเปิดเดือนละรอบ และเปิดเรียนเมื่อมีผู้เรียนตั้งแต่ 2 คนขึ้นไป",
    tracks: [
      {
        name: "Humanoid Building",
        tag: "ฮาร์ดแวร์",
        duration: "8 ชั่วโมง",
        price: "4,900 บาท",
        blurb:
          "เหมือน IKEA แต่เป็นฮิวแมนนอยด์ — ประกอบขา แขน ลำตัวเอง แล้วเดินสายไฟให้ครบ",
        cta: "สมัคร",
        items: [
          [
            "ประกอบกลไก",
            "ขา แขน และลำตัว — ประกอบข้อต่อที่รับน้ำหนักทั้งตัว",
          ],
          [
            "เดินสายไฟ",
            "ต่อไฟและสัญญาณไปทุกข้อต่อ ให้เป็นระเบียบพอจะแก้ปัญหาทีหลังได้",
          ],
          [
            "บอร์ดควบคุม",
            "บอร์ดที่แปลงคำสั่งเป็นการเคลื่อนไหว และคุยกับมอเตอร์แต่ละตัวยังไง",
          ],
          [
            "มอเตอร์ & IMU",
            "ฮิวแมนนอยด์ขยับได้ยังไง และรู้ได้ยังไงว่าทางไหนคือข้างบน",
          ],
        ],
      },
      {
        name: "Physical AI Basic",
        tag: "ซอฟต์แวร์",
        duration: "6 ชั่วโมง",
        price: "2,900 บาท",
        blurb:
          "สายซอฟต์แวร์ของฮิวแมนนอยด์ — สร้างโมเดล จำลอง แล้วเทรนให้มันเดินได้",
        cta: "สมัคร",
        items: [
          [
            "ROS 2",
            "framework ที่หุ่นยนต์สมัยใหม่ใช้ — node, topic, และ control loop",
          ],
          [
            "URDF",
            "สร้างโมเดลร่างกายฮิวแมนนอยด์ให้ code รู้จักทุกชิ้นส่วนและทุกข้อต่อ",
          ],
          [
            "MuJoCo",
            "ซ้อมทุกการเคลื่อนไหวในฟิสิกส์จำลองก่อนลงหุ่นจริง",
          ],
          [
            "Reinforcement learning",
            "เทรน policy ที่ทำให้หุ่นเดินได้",
          ],
        ],
      },
    ],
  },
  team: {
    eyebrow: "// ทีมเรา",
    title: "มารู้จัก",
    highlight: "ทีมผู้สอน",
    roles: ["CEO", "วิศวกรหุ่นยนต์อาวุโส", "Physical AI Engineer"],
    blurbs: [
      "ตั้งใจเปลี่ยนประเทศไทยให้เป็น Shenzhen แห่ง Southeast Asia",
      "สายหุ่นยนต์ตัวจริง พร้อมประสบการณ์แน่นในวงการระบบอัตโนมัติ",
      "ผู้จัดการผลิตภัณฑ์อาวุโสที่สนุกกับการเอา AI มาใช้ในโลกจริง",
    ],
  },
  partners: {
    eyebrow: "// พาร์ตเนอร์โอเพนซอร์ส",
    title: "เราสร้างบน",
    highlight: "หุ่นยนต์เปิด",
    asimov:
      "Asimov 1, Here Be Dragons Edition — ฮิวแมนนอยด์โอเพนซอร์สจาก Menlo Research",
    roboparty: "ROBOTO ORIGIN — ฮิวแมนนอยด์โอเพนซอร์สจากบริษัทในเซี่ยงไฮ้",
    lerobot: "SO-ARM 101 — แขนหุ่นยนต์โอเพนซอร์สจากโปรเจกต์ LeRobot ของ Hugging Face",
  },
  faq: {
    eyebrow: "// คำถามที่พบบ่อย",
    title: "คำถาม",
    highlight: "ที่เจอบ่อย",
    items: [
      {
        q: "ถ้าไม่มีความรู้พื้นฐานเลย เรียนได้ไหม",
        a: "ได้เลย ทั้ง Humanoid Building และ Physical AI Basic เริ่มจากศูนย์ได้ ไม่ต้องมีพื้นฐานเขียนโปรแกรมมาก่อน เราพาทำไปทีละขั้นในห้องเรียน",
      },
      {
        q: "แต่ละคอร์สเรียนนานแค่ไหน เปิดบ่อยแค่ไหน",
        a: "Humanoid Building เรียน 8 ชั่วโมง ส่วน Physical AI Basic เรียน 6 ชั่วโมง แต่ละคอร์สเปิดเดือนละรอบ และเปิดเรียนเมื่อมีผู้เรียนตั้งแต่ 2 คน ดูวันและเวลาได้ในหน้าสมัคร",
      },
      {
        q: "ทำไมต้องเรียนประกอบฮิวแมนนอยด์",
        a: "เพราะถ้าได้ทำด้วยตัวเอง คุณจะเข้าใจฮิวแมนนอยด์ถึงแก่น อย่างที่ขงจื๊อว่าไว้ “ได้ยินแล้วลืม ได้เห็นแล้วจำ ได้ลงมือทำจึงเข้าใจ”",
      },
      {
        q: "เรียนจบแล้วได้อะไร",
        a: "ได้ใบประกาศนียบัตรจาก Humanoice พร้อมประสบการณ์ประกอบและควบคุมฮิวแมนนอยด์จริงด้วยมือตัวเอง",
      },
      {
        q: "ฮิวแมนนอยด์ที่ใช้สอน มีรายละเอียดเป็นยังไง",
        a: "สูง 1.25 เมตร หนัก 34 กก. 23 องศาอิสระ (DOF) แรงบิดข้อต่อสูงสุด 120 N·m แบตเตอรี่ 48V 15Ah",
      },
      {
        q: "ต้องอายุเท่าไหร่ถึงจะเรียนได้",
        a: "คอร์สทั่วไปรับอายุ 15 ปีขึ้นไป เพราะเป็นงาน mechanic และไฟฟ้าของจริง ถ้าไม่ระวังก็อาจเกิดอันตรายได้ ถ้าอายุ 12–18 ปี จองคลาสส่วนตัวสำหรับเด็กได้",
      },
      {
        q: "สอนแบบส่วนตัวให้ทีม ห้องเรียน หรือลูกได้ไหม",
        a: "ได้ โรงงาน มหาวิทยาลัย โรงเรียน และครอบครัวจองคลาสส่วนตัวได้ ที่สถานที่ของคุณหรือที่แล็บเรา เลือกแบบที่ใช่ในเมนูการศึกษา แล้วทักไลน์มาขอใบเสนอราคา",
      },
      {
        q: "สอนเป็นภาษาอะไร",
        a: "ได้ทั้งภาษาไทยและอังกฤษ แล้วแต่ผู้เรียนในรอบนั้นถนัดภาษาไหน",
      },
    ],
  },
  education: {
    eyebrow: "// การศึกษา",
    title: "คลาสส่วนตัวสำหรับ",
    highlight: "ทีมของคุณ",
    intro: "เราขนฮิวแมนนอยด์ไปสอนถึงโรงงาน มหาวิทยาลัย หรือบ้านคุณ หรือจะมาเรียนที่แล็บเราก็ได้",
    more: "ดูหลักสูตร",
    line: "ทักไลน์คุยกัน",
    programEyebrow: "// หลักสูตร",
    whyEyebrow: "// ได้อะไร",
    segments: {
      factory: {
        nav: "โรงงาน",
        hint: "Physical AI สำหรับสายการผลิต",
        who: "ผู้จัดการและวิศวกร",
        meta: "2 วัน · 2–8 คน",
        title: "คอร์สฮิวแมนนอยด์สำหรับโรงงาน",
        description:
          "คอร์สฮิวแมนนอยด์ส่วนตัว 2 วันสำหรับทีมของคุณ ประกอบหุ่นจริง แล้วเขียนโปรแกรมด้วย ROS 2, MuJoCo และ reinforcement learning ที่โรงงานของคุณหรือแล็บเราในกรุงเทพฯ",
        eyebrow: "การศึกษา · โรงงาน",
        heading: ["ฮิวแมนนอยด์", "สำหรับโรงงาน"],
        lead: "ก่อนลงทุนกับ physical AI ลองสร้างเองสักตัว ทีมของคุณจะได้ประกอบฮิวแมนนอยด์จริงและเขียนโปรแกรมให้มันใน 2 วัน",
        facts: [
          ["ทีม", "2–8 คน"],
          ["ระยะเวลา", "2 วัน"],
          ["สถานที่", "โรงงานคุณหรือแล็บเรา"],
          ["ราคา", "ขอใบเสนอราคาทางไลน์"],
        ],
        programTitle: "สิ่งที่ทีมคุณ",
        programHighlight: "จะได้สร้าง",
        program: B2B_PROGRAM_TH,
        whyTitle: "สิ่งที่คุณ",
        whyHighlight: "จะได้กลับไป",
        why: [
          [
            "รู้จริง ไม่ใช่แค่กระแส",
            "รู้ว่าฮิวแมนนอยด์ทำอะไรได้แล้วและยังทำอะไรไม่ได้ จากการสร้างเอง ไม่ใช่จากวิดีโอเดโม",
          ],
          [
            "ภาษาเดียวกันทั้งทีม",
            "วิศวกรของคุณได้เรียนเทคโนโลยีเบื้องหลัง physical AI ทั้ง ROS 2 การจำลอง และ RL",
          ],
          [
            "ทางไปสู่โปรเจกต์นำร่อง",
            "มีหุ่นไว้ที่โรงงาน แล้วทดลองไอเดียกับสายการผลิตของคุณต่อได้เลย",
          ],
        ],
        kit: true,
      },
      school: {
        nav: "มหาลัย / โรงเรียน",
        hint: "แพลตฟอร์มวิจัยสำหรับนักศึกษา",
        who: "อาจารย์และชมรมหุ่นยนต์",
        meta: "2 วัน · 2–8 คน",
        title: "คอร์สฮิวแมนนอยด์สำหรับมหาวิทยาลัยและโรงเรียน",
        description:
          "คอร์สฮิวแมนนอยด์ส่วนตัว 2 วันสำหรับนักเรียนนักศึกษา ประกอบฮิวแมนนอยด์โอเพนซอร์สของจริง แล้วเขียนโปรแกรมด้วย ROS 2, MuJoCo และ reinforcement learning ที่สถานศึกษาหรือแล็บเราในกรุงเทพฯ",
        eyebrow: "การศึกษา · มหาลัย / โรงเรียน",
        heading: ["ฮิวแมนนอยด์", "สำหรับสถานศึกษา"],
        lead: "ให้นักเรียนได้ประกอบ เขียนโปรแกรม และทำวิจัยกับฮิวแมนนอยด์ตัวจริง แล้วเก็บไว้เป็นแพลตฟอร์มของแล็บต่อได้",
        facts: [
          ["กลุ่ม", "2–8 คน"],
          ["ระยะเวลา", "2 วัน"],
          ["สถานที่", "สถานศึกษาหรือแล็บเรา"],
          ["ราคา", "ขอใบเสนอราคาทางไลน์"],
        ],
        programTitle: "สิ่งที่นักเรียน",
        programHighlight: "จะได้สร้าง",
        program: B2B_PROGRAM_TH,
        whyTitle: "สิ่งที่แล็บคุณ",
        whyHighlight: "จะได้",
        why: [
          [
            "แล็บที่มองไปข้างหน้า",
            "ฮิวแมนนอยด์ที่เดินได้ในสถานศึกษา บอกว่าหลักสูตรของคุณสอนเรื่องที่กำลังจะมา",
          ],
          [
            "แพลตฟอร์มวิจัยแบบเปิด",
            "ฮาร์ดแวร์และซอฟต์แวร์โอเพนซอร์ส นักศึกษาแกะ แก้ และตีพิมพ์ผลงานได้",
          ],
          [
            "คนสร้างเองก็ซ่อมเองได้",
            "นักเรียนที่ประกอบหุ่นมากับมือรู้จักทุกข้อต่อ หุ่นจึงใช้งานต่อได้แม้เรากลับไปแล้ว",
          ],
        ],
        kit: true,
      },
      kids: {
        nav: "เด็ก",
        hint: "ประกอบฮิวแมนนอยด์จริง อายุ 12–18 ปี",
        who: "อายุ 12–18 ปี",
        meta: "8 ชั่วโมง · 1–6 คน",
        title: "คลาสประกอบฮิวแมนนอยด์สำหรับเด็ก",
        description:
          "คลาสส่วนตัว 8 ชั่วโมงสำหรับเด็กอายุ 12–18 ปี ประกอบขา แขน และลำตัวของฮิวแมนนอยด์จริง แล้วบังคับด้วยจอยสติ๊ก ที่บ้านคุณหรือแล็บเราในกรุงเทพฯ",
        eyebrow: "การศึกษา · เด็ก",
        heading: ["ประกอบ", "ฮิวแมนนอยด์จริง"],
        lead: "ไม่มีทฤษฎี ไม่มีสไลด์ ลูกของคุณจะได้ประกอบฮิวแมนนอยด์จริงในหนึ่งวัน แล้วจับจอยบังคับให้มันเดิน",
        facts: [
          ["อายุ", "12–18 ปี"],
          ["กลุ่ม", "1–2 หรือ 3–6 คน"],
          ["ระยะเวลา", "8 ชั่วโมง"],
          ["สถานที่", "บ้านคุณหรือแล็บเรา"],
        ],
        programTitle: "สิ่งที่เด็กๆ",
        programHighlight: "จะได้สร้าง",
        program: [
          {
            name: "ประกอบ",
            blurb: "ฮิวแมนนอยด์ตัวจริง ประกอบด้วยมือตัวเอง",
            items: [
              ["ขา", "สะโพก เข่า และข้อเท้า — ข้อต่อที่รับน้ำหนักทั้งตัว"],
              ["ลำตัว", "โครงที่ทุกชิ้นส่วนมายึดเกาะ"],
              ["แขน", "จากหัวไหล่ถึงข้อมือ ทีละข้อต่อ"],
            ],
          },
          {
            name: "บังคับ",
            blurb: "แล้วก็ถึงช่วงสนุก",
            items: [
              ["บังคับด้วยจอย", "จับคอนโทรลเลอร์แล้วสั่งให้หุ่นขยับ"],
              ["ก้าวแรก", "พาหุ่นที่เพิ่งประกอบเสร็จออกเดิน"],
            ],
          },
        ],
        whyTitle: "สิ่งที่เด็กๆ",
        whyHighlight: "จะได้กลับไป",
        why: [
          [
            "ผลงานใส่พอร์ต",
            "ใบประกาศนียบัตรจาก Humanoice และหุ่นที่บอกได้เต็มปากว่าประกอบเอง",
          ],
          [
            "ได้รู้ว่าชอบจริงไหม",
            "ลงมือหนึ่งวันเต็มก็รู้แล้วว่าหุ่นยนต์ใช่ทางของเขาหรือเปล่า",
          ],
          [
            "ดูแลใกล้ชิด",
            "กลุ่มเล็ก มีผู้สอนอยู่ข้างโต๊ะตลอดเวลา",
          ],
        ],
        kit: false,
      },
    },
    kit: {
      eyebrow: "// มีหุ่นเป็นของตัวเอง",
      title: "มีฮิวแมนนอยด์",
      highlight: "ไว้ใช้เอง",
      intro: "ซื้อฮิวแมนนอยด์รุ่นเดียวกับที่เราใช้สอน แล้วเราดูแลให้มันใช้งานได้ต่อเนื่อง",
      offers: [
        {
          name: "ชุดคิทฮิวแมนนอยด์",
          tag: "ซื้อ",
          items: [
            "ฮิวแมนนอยด์รุ่นที่เราใช้สอน",
            "เครื่องมือสำหรับประกอบและซ่อมบำรุง",
            "เครนสำหรับแขวนหุ่นระหว่างหัดเดิน",
          ],
        },
        {
          name: "บริการดูแลรักษา",
          tag: "12 เดือน",
          items: [
            "ตรวจเช็กถึงที่ 2 ครั้ง",
            "ซ่อมและเปลี่ยนชิ้นส่วนที่เสื่อมตามการใช้งานฟรี",
            "ความเสียหายจากการใช้งานผิดวิธีคิดค่าใช้จ่ายแยก",
          ],
        },
      ],
      cta: "สอบถามเรื่องชุดคิท",
    },
  },
  about: {
    title: "เกี่ยวกับเรา",
    description:
      "Humanoice คือแล็บหุ่นยนต์ฮิวแมนนอยด์แบบลงมือทำที่พระโขนง กรุงเทพฯ มีทั้งคอร์สทั่วไป คลาสส่วนตัว และชุดคิทฮิวแมนนอยด์",
    eyebrow: "// เกี่ยวกับเรา",
    heading: ["เราสร้าง", "ฮิวแมนนอยด์"],
    lead: "ฮิวแมนน้อย (Humanoice) คือแล็บหุ่นยนต์ฮิวแมนนอยด์ที่พระโขนง กรุงเทพฯ เราสอนคนให้ประกอบฮิวแมนนอยด์โอเพนซอร์สของจริง และขายพร้อมดูแลหุ่นด้วย",
    mission: {
      eyebrow: "// พันธกิจ",
      text: "เปลี่ยนประเทศไทยให้เป็น Shenzhen แห่ง Southeast Asia",
      link: "อ่าน Master Plan",
    },
    whatEyebrow: "// สิ่งที่เราทำ",
    whatTitle: "สามทาง",
    whatHighlight: "ที่จะเริ่ม",
    what: [
      ["คอร์สทั่วไป", "Humanoid Building และ Physical AI Basic เปิดเดือนละรอบที่แล็บเรา จองที่นั่งออนไลน์ได้เลย"],
      ["คลาสส่วนตัว", "สำหรับโรงงาน มหาวิทยาลัย โรงเรียน และเด็ก ที่สถานที่ของคุณหรือของเรา"],
      ["ชุดคิทฮิวแมนนอยด์", "ซื้อหุ่นรุ่นที่เราใช้สอน พร้อมบริการดูแลรักษา 1 ปี"],
    ],
  },
  footer: {
    ticker: "เปลี่ยนประเทศไทยให้เป็น Shenzhen แห่ง Southeast Asia",
    location: "พระโขนง, กรุงเทพฯ",
    title: "แอดไลน์",
    highlight: "เพื่อขอรายละเอียด",
    qrLabel: "@humanoice",
  },
  flashSale: {
    label: "Flash sale",
    alt: "Flash sale ลด 50% เมื่อสมัครเรียนภายใน 21–26 ต.ค. 2026",
    close: "ปิด",
    note: "// โค้ด",
    applied: "// ใส่โค้ดในฟอร์มให้แล้ว:",
    cta: "รับส่วนลด 50%",
    ok: "เข้าใจแล้ว",
  },
  apply: {
    title: "สมัครเรียน",
    description:
      "บอกเราเกี่ยวกับตัวคุณ เลือกรอบที่อยากเรียน แล้วเราจะยืนยันที่นั่งทางไลน์",
    home: "หน้าแรก",
    eyebrow: "// ใบสมัคร",
    heading: ["จอง", "ที่นั่ง"],
    sticker: "~2 นาที",
    intro:
      "ทำความรู้จักกันหน่อย เลือกคอร์สที่คุณสนใจ แล้วเราจะติดต่อกลับเพื่อยืนยันที่นั่ง",
    sections: {
      about: "เกี่ยวกับคุณ",
      background: "พื้นฐานของคุณ",
      course: "เลือกรอบเรียน",
      payer: "ใบเสร็จ & การชำระเงิน",
    },
    optional: "ไม่บังคับ",
    lookup: {
      checking: "กำลังค้นหาข้อมูลของคุณ…",
      found: "ยินดีต้อนรับกลับมา — เรากรอกข้อมูลที่มีอยู่ให้แล้ว แก้ส่วนที่เปลี่ยนไปได้เลย",
      known: "เราเคยเจออีเมลนี้แล้ว ให้กรอกข้อมูลเดิมให้ไหม",
      fill: "ใช้ข้อมูลเดิมของฉัน",
    },
    fields: {
      firstName: "ชื่อ",
      lastName: "นามสกุล",
      nickname: "ชื่อเล่น",
      email: "อีเมล",
      phone: "เบอร์โทร",
      lineId: "LINE ID",
      jobTitle: "อาชีพ / ตำแหน่ง",
      company: "บริษัท / มหาวิทยาลัย",
      languages: "ภาษาที่เรียนได้",
      roboticsYears: "ประสบการณ์ด้านหุ่นยนต์ (ปี)",
      programmingYears: "ประสบการณ์เขียนโปรแกรม (ปี)",
      programmingLanguages: "ภาษาโปรแกรม / เครื่องมือที่ใช้",
      skills: "ทักษะที่ลงมือทำได้",
      discountCode: "โค้ดส่วนลด",
    },
    backgroundHint:
      "คำตอบของคุณจะช่วยเพิ่มโอกาสในการได้รับการตอบรับ",
    courseHint: "เลือกรอบวันที่ของคอร์สที่สนใจ จะเลือกคอร์สเดียวหรือทั้งสองคอร์สก็ได้",
    languages: { th: "ไทย", en: "อังกฤษ" },
    programmingLanguages: {
      python: "Python",
      cpp: "C / C++",
      plc: "PLC",
      javascript: "JavaScript",
      linux: "Linux",
      ros: "ROS",
    },
    skills: {
      electronics: "อิเล็กทรอนิกส์",
      mechanics: "เครื่องกล",
      cad: "CAD / 3D printing",
      ml: "Machine learning",
    },
    course: {
      track: "คอร์ส",
      trackTags: ["ฮาร์ดแวร์", "ซอฟต์แวร์", "B2B"],
      pickDate: "เลือกรอบวันที่",
      clear: "ล้าง",
      dayUnit: ["วัน", "วัน"],
      priceUnit: "บาท",
      priceTbd: "ทักมาคุยกัน",
      seatsLeft: ["ที่นั่งว่าง", "ที่นั่งว่าง"],
      full: "เต็มแล้ว",
      empty:
        "ตอนนี้ยังไม่มีรอบเปิดรับสมัคร แอดไลน์ไว้ แล้วเราจะแจ้งทันทีที่รอบใหม่เปิด",
      line: "แอดไลน์",
      bundle: ["สมัครสองคอร์สพร้อมกัน ลดทันที ", "% จากยอดรวม"],
    },
    submit: "ส่งใบสมัคร",
    submitting: "กำลังส่ง…",
    errors: {
      required: "กรุณากรอก",
      email: "รูปแบบอีเมลไม่ถูกต้อง",
      number: "กรอกเป็นจำนวนปีเต็ม",
      course: "กรุณาเลือกอย่างน้อยหนึ่งรอบ",
      oneTrack: "เลือกได้คอร์สละหนึ่งรอบ",
      full: "รอบนี้เพิ่งเต็ม กรุณาเลือกรอบอื่น",
      rateLimit: "ส่งคำสมัครบ่อยเกินไป รอสักครู่แล้วลองใหม่ หรือทักเราทางไลน์",
      server: "ระบบมีปัญหา ลองใหม่อีกครั้ง หรือทักเราทางไลน์",
      payer: "กรุณาเลือก",
      discountInvalid: "ไม่พบโค้ดนี้",
      discountExpired: "โค้ดนี้หมดอายุแล้ว",
      discountExhausted: "โค้ดนี้ถูกใช้ครบแล้ว",
    },
    success: {
      eyebrow: "// ขอบคุณ",
      title: "สมัครเรียบร้อย",
      highlight: "รอจ่ายเงิน",
      body: "ยืนยันที่นั่ง หลังจ่ายเงินเรียบร้อยแล้วเท่านั้น รบกวนแอดไลน์มาจ่ายเงินกับเราหน่อยน้า",
      line: "จ่ายเงินใน LINE",
      qrLabel: "@humanoice",
    },
    payer: {
      hint: "ใครเป็นผู้ชำระเงิน? ส่วนนี้กำหนดยอดโอนและชื่อบนใบเสร็จ",
      individual: "บุคคลธรรมดา",
      individualHint: "ชำระเอง",
      company: "นิติบุคคล",
      companyHint: "บริษัทเป็นผู้ชำระ",
      individualNote: "ข้อมูลใบเสร็จไม่บังคับ กรอกไว้ถ้าต้องการใบเสร็จในชื่อของคุณ",
      companyNote:
        "นิติบุคคลหักภาษี ณ ที่จ่าย 3% จึงโอนเพียง 97% ของค่าเรียน และรบกวนส่งหนังสือรับรองหัก ณ ที่จ่าย (50 ทวิ) ให้เราด้วยนะ",
      fields: {
        individual: {
          name: "ชื่อ-นามสกุลบนใบเสร็จ",
          taxId: "เลขบัตรประชาชน / พาสปอร์ต",
          address: "ที่อยู่",
        },
        company: { name: "ชื่อบริษัท", taxId: "เลขประจำตัวผู้เสียภาษี", address: "ที่อยู่จดทะเบียน" },
      },
      discount: {
        checking: "กำลังตรวจสอบโค้ด…",
        applied: ["ใช้โค้ดแล้ว ลด", "%"],
        failed: {
          invalid: "ไม่พบโค้ดนี้",
          expired: "โค้ดนี้หมดอายุแล้ว",
          exhausted: "โค้ดนี้ถูกใช้ครบแล้ว",
        },
      },
      preview: {
        title: "ยอดที่ต้องโอน",
        fee: "ค่าเรียน",
        bundle: "ส่วนลดเรียนคู่",
        discount: "ส่วนลด",
        withholding: "หัก ณ ที่จ่าย 3%",
        due: "ยอดโอน",
        pickFirst: "เลือกรอบเรียนด้านบนก่อน แล้วยอดโอนจะแสดงตรงนี้",
        onRequest: "ราคาตามตกลง เดี๋ยวคุยเรื่องชำระเงินกันทางไลน์",
      },
    },
    pay: {
      eyebrow: "// ขั้นตอนที่ 2 จาก 2",
      title: "โอนเงิน",
      highlight: "แล้วอัปโหลดสลิป",
      intro:
        "โอนยอดด้านล่างเข้าบัญชีกสิกรไทยของเรา แล้วอัปโหลดสลิป ระบบจะตรวจสอบให้ทันที ใช้เวลาไม่เกินหนึ่งนาที",
      runs: "ที่นั่งของคุณ",
      amount: "ยอดที่ต้องโอน",
      withholdingNote: "หักภาษี ณ ที่จ่าย 3% แล้ว",
      discountNote: "หักส่วนลดจากโค้ดแล้ว",
      bundleNote: ["ส่วนลดเรียนคู่ ", "%"],
      bank: "ธนาคารกสิกรไทย",
      accountName: "ชื่อบัญชี",
      copy: "คัดลอก",
      copied: "คัดลอกแล้ว!",
      slip: "สลิปโอนเงิน",
      slipHint: "ภาพหน้าจอจากแอปธนาคาร ไฟล์ JPEG, PNG หรือ WebP ขนาดไม่เกิน 4 MB",
      choose: "เลือกรูป",
      change: "เปลี่ยนรูป",
      submit: "ตรวจสอบการชำระเงิน",
      submitting: "กำลังตรวจสลิป…",
      errors: {
        missingSlip: "กรุณาแนบรูปสลิปก่อน",
        unsupportedType: "รองรับเฉพาะ JPEG, PNG หรือ WebP",
        tooLarge: "รูปใหญ่เกิน 4 MB ใช้ภาพหน้าจอก็พอแล้ว",
        rateLimit: "ลองบ่อยเกินไป รอสักครู่แล้วลองใหม่ หรือส่งสลิปมาทางไลน์",
        expired: "ลิงก์ชำระเงินหมดอายุแล้ว กรุณาส่งใบสมัครอีกครั้ง ข้อมูลของคุณยังอยู่ครบ",
        server: "ตรวจสลิปไม่สำเร็จในตอนนี้ ลองใหม่อีกครั้ง หรือส่งสลิปมาทางไลน์",
      },
      rejected: {
        eyebrow: "// อืม",
        title: "สลิปนี้",
        highlight: "ไม่ตรงกัน",
        issues: {
          unreadable: "อ่านรูปไม่ออก ลองภาพหน้าจอที่ชัดกว่านี้ หรือส่งมาทางไลน์",
          notSlip: "รูปนี้ไม่เหมือนสลิปโอนเงิน กรุณาอัปโหลดภาพหน้าจอจากแอปธนาคาร",
          recipient: "บัญชีปลายทางไม่ใช่บัญชีของเรา เช็กว่าเป็นกสิกรไทย 238-1-20282-0 บจก. ฮิวแมน น้อย",
          amount: "ยอดเงินไม่ตรงกับยอดที่ต้องโอน ถ้าโอนยอดอื่นไว้ ส่งสลิปมาทางไลน์ เดี๋ยวเราจัดการให้",
          suspicious: "สลิปนี้ดูมีบางอย่างไม่ปกติ ส่งมาทางไลน์ให้ทีมงานตรวจอีกทีนะ",
          duplicate: "สลิปนี้ถูกใช้ยืนยันที่นั่งอื่นไปแล้ว ถ้าคิดว่าผิดพลาด ทักเราทางไลน์ได้เลย",
        },
        body: "ถ้าโอนแล้วจริง ที่นั่งของคุณไม่หายไปไหน ส่งสลิปมาทางไลน์ แล้วทีมงานจะตรวจให้เอง",
        line: "ส่งสลิปทางไลน์",
        retry: "หรือลองรูปอื่นด้านล่าง",
      },
    },
    paid: {
      eyebrow: "// ยืนยันแล้ว",
      title: "ที่นั่ง",
      highlight: "ยืนยันเรียบร้อย",
      body: ["ได้รับเงินแล้ว เราส่งคำเชิญปฏิทินไปที่", "แล้ว แอดไลน์ไว้เพื่อรับข่าวสารก่อนวันเรียนน้า"],
      bodyFree: ["โค้ดของคุณครอบคลุมค่าเรียนทั้งหมด ไม่ต้องโอนเงิน เราส่งคำเชิญปฏิทินไปที่", "แล้ว แอดไลน์ไว้เพื่อรับข่าวสารก่อนวันเรียนน้า"],
      runs: "คอร์สของคุณ",
      where: "สถานที่",
      map: "เปิดใน Google Maps",
      calendar: "เพิ่มลง Google Calendar",
      line: "แอดไลน์รับข่าวสาร",
      qrLabel: "@humanoice",
    },
    directions: {
      title: "เดินทางมา Humanoice ยังไง",
      steps: [
        "BTS พระโขนง (เดินประมาณ 5 นาที)",
        "ขับรถมา (ที่จอดรถมีจำกัด มาก่อนได้ก่อน)",
      ],
      landmark: "ร้าน Humanoice อยู่ติดกับร้านแว่น Chapter Optical",
      laptop: "ถ้ามาเรียนคอร์สซอฟต์แวร์ กรุณานำแล็ปท็อปมาด้วย",
      onTime: "กรุณามาให้ตรงเวลา เพราะเราจะเริ่มตรงเวลา",
      questions: "มีคำถามทักเราได้ที่ LINE @humanoice",
    },
    email: {
      subject: "ยืนยันที่นั่งแล้ว",
      greeting: "สวัสดีคุณ",
      body: "ได้รับเงินเรียบร้อย ที่นั่งของคุณยืนยันแล้ว รายละเอียดคอร์สมีดังนี้",
      bodyFree: "โค้ดของคุณครอบคลุมค่าเรียนทั้งหมด ที่นั่งของคุณยืนยันแล้ว รายละเอียดคอร์สมีดังนี้",
      calendarLink: "เพิ่มลง Google Calendar",
      where: "สถานที่",
      map: "เปิดใน Google Maps",
      calendar: "แนบคำเชิญปฏิทินมาด้วย กดตอบรับแล้ววันเรียนจะเข้าปฏิทินของคุณทันที",
      lineCta: "แอดไลน์",
      signoff: "แล้วเจอกันที่เวิร์กช็อป",
      team: "ทีม Humanoice",
    },
  },
};

const dictionaries = { en, th };

export function getDictionary(locale: "en"): typeof en;
export function getDictionary(locale: "th"): ThaiDictionary;
/** For callers that only know the locale at runtime (the apply actions) — `.apply` is `ApplyCopy` either way. */
export function getDictionary(locale: Locale): typeof en | ThaiDictionary;
export function getDictionary(locale: Locale): typeof en | ThaiDictionary {
  return dictionaries[locale];
}

/** The application page, optionally pre-ticking a run: /apply?course=hardware, /th/apply?course=software */
export function applyPath(locale: Locale, course?: string) {
  return `${localePath(locale, "/apply")}${course ? `?course=${course}` : ""}`;
}

/** The private-training pages, in nav order: /education/factory, /th/education/kids… */
export const EDUCATION_SEGMENTS = ["factory", "school", "kids"] as const;
export type EducationSegment = (typeof EDUCATION_SEGMENTS)[number];

export function isEducationSegment(value: string): value is EducationSegment {
  return (EDUCATION_SEGMENTS as readonly string[]).includes(value);
}

export function educationPath(locale: Locale, segment: EducationSegment) {
  return localePath(locale, `/education/${segment}`);
}

export function localePath(locale: Locale, path = "/") {
  const normalizedPath = path === "/" ? "" : path;
  return locale === "th" ? `/th${normalizedPath}` : normalizedPath || "/";
}
