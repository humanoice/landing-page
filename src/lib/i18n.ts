import "server-only";
import type { Language, ProgrammingLanguage, Skill } from "@/lib/apply-options";
import { siteConfig } from "@/lib/site";

export type Locale = "en" | "th";

/** Track syllabi — shared by the public course cards and the B2B program so they never drift. */
const HARDWARE_ITEMS_EN = [
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
];

const SOFTWARE_ITEMS_EN = [
  [
    "ROS 2 & URDF",
    "The framework every modern robot runs on — nodes, topics, and control loops.",
  ],
  [
    "Simulation",
    "Model a humanoid's body so your code knows every link and joint.",
  ],
  [
    "Reinforcement Learning",
    "Rehearse every motion in real physics before it touches hardware.",
  ],
  [
    "Teleoperation & VLA Model",
    "Train the policy that makes the robot walk.",
  ],
];

/** The 2-day hardware + programming course — same content for factories and uni / school. */
const B2B_PROGRAM_EN = [
  {
    name: "Hardware",
    blurb: "Build it with your own hands.",
    items: HARDWARE_ITEMS_EN,
  },
  {
    name: "Software",
    blurb: "Then make it move.",
    items: SOFTWARE_ITEMS_EN,
  },
];

const en = {
  /** The home page's <title> and description; every other page carries its own `title` + `description`. */
  home: {
    // Widened: siteConfig is `as const`, and Thai has to fit this type with its own strings.
    title: siteConfig.title as string,
    description: siteConfig.description as string,
  },
  nav: {
    education: "Education",
    about: "About us",
    apply: "Apply",
    language: "Language",
    menu: "Menu",
  },
  hero: {
    eyebrow: "Humanoid School · Bangkok",
    title: ["Learn to", "build humanoids."],
    description:
      "Thailand's first hands-on humanoid school. From raw materials to full deployment — you assemble, train, and deploy a real humanoid.",
    join: "Apply",
    line: "Add LINE",
    reel: {
      alt: "Students laying out parts, testing a board with a multimeter, and walking a humanoid on a gantry at the Humanoice workshop",
    },
  },
  curriculum: {
    eyebrow: "// Public courses",
    title: "Pick your",
    highlight: "course",
    track: "Track",
    tracks: [
      {
        name: "Building Humanoids",
        photoAlt: "Students and instructors posing with two humanoids they are building",
        tag: "Hardware",
        duration: "8 hours",
        price: "4,900 THB",
        blurb:
          "Like IKEA but for humanoids — build the legs, arms, and body yourself, then wire it up.",
        cta: "Apply",
        items: HARDWARE_ITEMS_EN,
      },
      {
        name: "Physical AI Basic",
        photoAlt: "An instructor presenting on a wall screen to students at their laptops",
        tag: "Software",
        duration: "6 hours",
        price: "2,900 THB",
        blurb:
          "Modern software for humanoids: ROS 2, simulation, reinforcement learning, and VLA models that teach one to walk.",
        cta: "Apply",
        items: SOFTWARE_ITEMS_EN,
      },
    ],
  },
  team: {
    eyebrow: "// Team",
    title: "Meet your",
    highlight: "instructors",
    roles: ["CEO", "Staff Engineer", "Physical AI Engineer"],
    blurbs: [
      "Physics-loving engineer, now he works at a robotics and Physical AI company. Has taught computer science at top universities, including the National University of Singapore and Chulalongkorn.",
      "Computer engineer with a wide-ranging background. Spent 4 years teaching web, AI, and blockchain, and went through the Computer Olympiad camp at Khon Kaen University. Now works on AI and other nerdy tech.",
      "Senior product manager who loves putting AI to work in the real world. Now studying for a master's in Medical Robotics at Mahidol University.",
    ],
  },
  /** Section chrome only — the quotes stay in Thai on every locale, so they live with the names and photos in testimonials.tsx. */
  testimonials: {
    eyebrow: "// Testimonials",
    title: "What students",
    highlight: "say about us",
  },
  partners: {
    eyebrow: "// Open-Source Partners",
    title: "We build on",
    highlight: "open robots",
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
        a: "Yes. Building Humanoids and Physical AI Basic both start from zero, so you don't need any coding background. We walk you through every step on the day.",
      },
      {
        q: "How long is each course, and how often does it run?",
        a: "Building Humanoids is 8 hours; Physical AI Basic is 6 hours.",
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
        a: "A Roboparty humanoid: 1.25 m tall, 34 kg, 23 degrees of freedom, joints up to 120 N·m, and a 48 V / 15 Ah battery.",
      },
      {
        q: "How old do I need to be to join?",
        a: "At least 12 years old.",
        /** Rendered as a link under the answer — an education segment page. */
        link: { segment: "kids" as const, label: "See the Kids session" },
      },
      {
        q: "Can you train my team, class, or kids privately?",
        a: "Yes. Factories, universities, schools, and families book private sessions at their place or our lab. Chat with us on LINE.",
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
    title: "Private training",
    highlight: "for you",
    intro: "We bring the experience of building humanoids to you whenever and wherever you want",
    more: "See the program",
    line: "Chat on LINE",
    programEyebrow: "// The program",
    whyEyebrow: "// Why Train With Us",
    /** Indexed by EducationSegment — see EDUCATION_SEGMENTS below. */
    segments: {
      factory: {
        nav: "Factory",
        hint: "Explore humanoids and physical AI for your production line",
        title: "Humanoid training for factories",
        description:
          "Explore humanoids and physical AI for your production line: in a private 2-day course, your team builds and programs a real humanoid to see what it can do on your line. At your factory or our Bangkok lab.",
        eyebrow: "Education · Factory",
        heading: ["Humanoids for", "your factory."],
        facts: [
          ["Training", "2–16 people"],
          ["Where", "Your factory or our lab"],
          ["Price", "Chat on LINE"],
        ],
        programTitle: "What your team",
        programHighlight: "learns",
        program: B2B_PROGRAM_EN,
        whyTitle: "Understand on",
        whyHighlight: "how it can apply to your factory",
        why: [
          [
            "What it can and can't do",
            "You'll know what a humanoid can and can't do yet — from building one, not from a demo video.",
          ],
          [
            "Customize training for your line",
            "Your engineers don't learn generic concept, but directly apply to your line.",
          ],
          [
            "Installer for your problems",
            "Our team can offer you a solution for your automation needs",
          ]
        ],
      },
      school: {
        nav: "Uni / School",
        hint: "A humanoid research platform to enhance your students' learning",
        title: "Humanoid training for universities and schools",
        description:
          "A humanoid research platform for your students: in a private 2-day course, they build a real open-source humanoid and program it with ROS 2, MuJoCo, and reinforcement learning. On campus or at our Bangkok lab.",
        eyebrow: "Education · Uni / School",
        heading: ["Humanoids for", "your campus."],
        facts: [
          ["Training", "2–30 students"],
          ["Where", "Your campus or our lab"],
          ["Price", "Chat on LINE"],
        ],
        programTitle: "What your students",
        programHighlight: "learn",
        program: B2B_PROGRAM_EN,
        whyTitle: "Enhance your students'",
        whyHighlight: "Opportunity in robotics and AI",
        why: [
          [
            "Innovative move",
            "Get ahead of other schools by providing cutting-edge robotics and physical AI education.",
          ],
          [
            "Learn from real engineers",
            "We are a team of experienced engineers with hands-on robotic works.",
          ],
          [
            "Research platform",
            "Provide best environment for students to research and develop humanoid robotics and physical AI.",
          ],
        ],
      },
      kids: {
        nav: "Kids",
        hint: "Give your children an experience of building a real humanoid",
        title: "Humanoid building for kids",
        description:
          "Give your kids the experience of building a real humanoid: a private 8-hour build for ages 12–18, from legs and arms to driving it with a joystick. At your home or our Bangkok lab.",
        eyebrow: "Education · Kids",
        heading: ["Kids can build a", "real humanoid."],
        facts: [
          ["Age", "12–18"],
          ["Training", "1-6 kids"],
          ["Length", "8 hours"],
          ["Where", "Your home or our lab"],
        ],
        programTitle: "What they",
        programHighlight: "learn",
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
        whyTitle: "Feel magical moment of",
        whyHighlight: "building a real robot",
        why: [
          [
            "Building a humanoid is unique experience",
            "Give your kids a special moment of building a real humanoid with their own hands",
          ],
          [
            "Improve their portfolio",
            "Showing off what your kids capable of to others",
          ],
          [
            "Necessary Skills for the future",
            "Robotics and AI are the future, and building a humanoid is a great way to learn the skills needed for the future",
          ],
        ],
      },
    },
    /** Sample-certificate block on the uni/school and kids pages. */
    certificate: {
      eyebrow: "// On completion",
      title: "Improve your",
      highlight: "portfolio",
      body: "Everyone who finishes our training gets a proof certificate with their name on it.",
      alt: "Sample Humanoice certificate of completion with the name field reading Your Name",
      caption: "Sample certificate",
    },
    /** "Own one" block on the factory and uni/school pages. */
    kit: {
      eyebrow: "// Buy Kit",
      title: "Keep humanoids",
      highlight: "at your site",
      intro: "The humanoid we use is Roboparty's Roboto Origin — 1.25 m tall, 34 kg, 23 degrees of freedom",
      offers: [
        {
          name: "Humanoid kit",
          tag: "Buy",
          items: [
            "Humanoid Body",
            "Computer board",
            "Controller board",
            "Battery 48V / 15 Ah",
          ],
        },
        {
          name: "Maintenance support",
          tag: "12 months",
          items: [
            "2 on-site check-ups",
            "Free repairs and replacements for damaged parts",
          ],
        },
      ],
      cta: "Ask about a kit",
      alt: "The humanoid that comes in the kit, mid-stride",
    },
  },
  about: {
    title: "About us",
    description:
      "Humanoice is a hands-on humanoid robotics lab in Phra Khanong, Bangkok — public courses, private training, and humanoid kits.",
    eyebrow: "// About us",
    heading: ["Make Thailand", "the Shenzhen of Southeast Asia."],
    lead: "Humanoice (ฮิวแมนน้อย) is a humanoid robotics lab in Phra Khanong, Bangkok. We teach people to build real open-source humanoids, and we sell and service the robots too.",
  },
  footer: {
    ticker: "Make Thailand the Shenzhen of Southeast Asia",
    location: "Phra Khanong, Bangkok",
    title: "Add LINE",
    highlight: "for details",
    qrLabel: "@humanoice",
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
    /** B2B escape hatch under the intro — private training never goes through this form. */
    privateTraining: {
      text: "Private training for your team, school, or kids?",
      link: "Talk to us on LINE",
    },
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
      trackTags: ["Hardware", "Software"],
      pickDate: "Pick a date",
      /** Drops this track's pick, for someone who only wants the other one. */
      clear: "Clear",
      dayUnit: ["day", "days"],
      priceUnit: "THB",
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
    /** Every run they picked was already paid for — nothing new to bill. */
    success: {
      eyebrow: "// Thank you",
      title: "You're already",
      highlight: "booked",
      body: "You've paid for every run you picked, so there's nothing more to pay. Need to change something? Message us on LINE.",
      line: "Chat on LINE",
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
export type MasterPlanCopy = typeof en.plan;
export type ApplyCopy = typeof en.apply;
/** What both locales carry. English alone adds `plan` (the master plan isn't translated). */
export type Dictionary = HomeDictionary & { apply: ApplyCopy };

const HARDWARE_ITEMS_TH: typeof HARDWARE_ITEMS_EN = [
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
];

const SOFTWARE_ITEMS_TH: typeof SOFTWARE_ITEMS_EN = [
  [
    "ROS 2 & URDF",
    "framework ที่หุ่นยนต์สมัยใหม่ใช้ — node, topic, และ control loop",
  ],
  [
    "Simulation",
    "สร้างโมเดลร่างกายฮิวแมนนอยด์ให้ code รู้จักทุกชิ้นส่วนและทุกข้อต่อ",
  ],
  [
    "Reinforcement Learning",
    "ซ้อมทุกการเคลื่อนไหวในฟิสิกส์จำลองก่อนลงหุ่นจริง",
  ],
  [
    "Teleoperation & VLA Model",
    "เทรน policy ที่ทำให้หุ่นเดินได้",
  ],
];

const B2B_PROGRAM_TH: typeof B2B_PROGRAM_EN = [
  {
    name: "ฮาร์ดแวร์",
    blurb: "ประกอบด้วยมือตัวเอง",
    items: HARDWARE_ITEMS_TH,
  },
  {
    name: "ซอฟต์แวร์",
    blurb: "แล้วทำให้มันขยับ",
    items: SOFTWARE_ITEMS_TH,
  },
];

const th: Dictionary = {
  home: {
    title: "Humanoice — โรงเรียนฮิวแมนนอยด์แห่งประเทศไทย",
    description: "บูตแคมป์ฮิวแมนนอยด์แบบลงมือทำแห่งแรกของไทย จากการประกอบสู่การทำให้หุ่นยนต์เดินได้",
  },
  nav: {
    education: "การศึกษา",
    about: "เกี่ยวกับเรา",
    apply: "สมัคร",
    language: "ภาษา",
    menu: "เมนู",
  },
  hero: {
    eyebrow: "โรงเรียนสอนฮิวแมนนอยด์ · กรุงเทพฯ",
    title: ["เรียนการสร้าง", "ฮิวแมนนอยด์"],
    description:
      "โรงเรียนสอนประกอบฮิวแมนนอยด์ แบบลงมือทำแห่งแรกของไทย ตั้งแต่ชิ้นส่วนแรกจนพร้อมใช้งานจริง — คุณจะได้ประกอบ เขียนโปรแกรม และพาฮิวแมนนอยด์เดิน",
    join: "สมัคร",
    line: "ติดต่อไลน์",
    reel: {
      alt: "นักเรียนกำลังจัดวางชิ้นส่วน ทดสอบบอร์ดด้วยมัลติมิเตอร์ และพาฮิวแมนนอยด์เดินบนราวช่วยพยุงที่เวิร์กช็อปของ Humanoice",
    },
  },
  curriculum: {
    eyebrow: "// คอร์สทั่วไป",
    title: "เลือกคอร์ส",
    highlight: "ของคุณ",
    track: "คอร์ส",
    tracks: [
      {
        name: "Building Humanoids",
        photoAlt: "ผู้เรียนและผู้สอนถ่ายรูปกับฮิวแมนนอยด์สองตัวที่กำลังประกอบ",
        tag: "ฮาร์ดแวร์",
        duration: "8 ชั่วโมง",
        price: "4,900 บาท",
        blurb:
          "เหมือน IKEA แต่เป็นฮิวแมนนอยด์ — ประกอบขา แขน ลำตัวเอง แล้วเดินสายไฟให้ครบ",
        cta: "สมัคร",
        items: HARDWARE_ITEMS_TH,
      },
      {
        name: "Physical AI Basic",
        photoAlt: "ผู้สอนกำลังบรรยายบนจอผนังให้ผู้เรียนที่นั่งหน้าแล็ปท็อป",
        tag: "ซอฟต์แวร์",
        duration: "6 ชั่วโมง",
        price: "2,900 บาท",
        blurb:
          "ซอฟต์แวร์สมัยใหม่สำหรับฮิวแมนนอยด์ — ROS 2, การจำลอง, reinforcement learning และโมเดล VLA ที่สอนให้หุ่นเดินได้",
        cta: "สมัคร",
        items: SOFTWARE_ITEMS_TH,
      },
    ],
  },
  team: {
    eyebrow: "// ทีมเรา",
    title: "มารู้จัก",
    highlight: "ทีมผู้สอน",
    roles: ["CEO", "Staff Engineer", "Physical AI Engineer"],
    blurbs: [
      "วิศวกรผู้ชื่นชอบฟิสิกส์ ปัจจุบันทำงานในบริษัทหุ่นยนต์และ Physical AI แห่งหนึ่งในกรุงเทพฯ มีประสบการณ์ในการสอนและอบรมด้านวิทยาการคอมพิวเตอร์ในมหาวิทยาลัยชั้นนำ เช่น National University of Singapore และจุฬาลงกรณ์",
      "วิศวกรคอมพิวเตอร์ประสบการณ์หลากหลาย มีประสบการณ์สอนเขียน Web, AI, Blockchain 4 ปี เคยเข้าร่วมค่ายโอลิมปิกวิชาการคอมพิวเตอร์ที่มหาวิทยาลัยขอนแก่น ปัจจุบันทำงานด้าน AI และเทคโนโลยีเนิร์ดๆ",
      "ผู้จัดการผลิตภัณฑ์อาวุโสที่สนุกกับการเอา AI มาใช้ในโลกจริง ปัจจุบันเรียนต่อปริญญาโทที่มหาวิทยาลัยมหิดล ด้าน Medical Robotics",
    ],
  },
  testimonials: {
    eyebrow: "// เสียงจากผู้เรียน",
    title: "ฟังจาก",
    highlight: "ผู้เรียนตัวจริง",

  },
  partners: {
    eyebrow: "// พาร์ตเนอร์โอเพนซอร์ส",
    title: "เราสร้างบน",
    highlight: "หุ่นยนต์เปิด",
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
        a: "ได้เลย ทั้ง Building Humanoids และ Physical AI Basic เริ่มจากศูนย์ได้ ไม่ต้องมีพื้นฐานเขียนโปรแกรมมาก่อน เราพาทำไปทีละขั้นในห้องเรียน",
      },
      {
        q: "แต่ละคอร์สเรียนนานแค่ไหน",
        a: "Building Humanoids เรียน 8 ชั่วโมง ส่วน Physical AI Basic เรียน 6 ชั่วโมง",
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
        a: "ฮิวแมนนอยด์ของ Roboparty สูง 1.25 เมตร หนัก 34 กก. 23 องศาอิสระ (DOF) แรงบิดข้อต่อสูงสุด 120 N·m แบตเตอรี่ 48V 15Ah",
      },
      {
        q: "ต้องอายุเท่าไหร่ถึงจะเรียนได้",
        a: "อายุ 12 ปีขึ้นไป",
        link: { segment: "kids", label: "ดูคลาสสำหรับเด็ก" },
      },
      {
        q: "สอนแบบส่วนตัวให้ทีม ห้องเรียน หรือลูกได้ไหม",
        a: "ได้ โรงงาน มหาวิทยาลัย โรงเรียน และครอบครัวจองคลาสส่วนตัวได้ ทักมาในไลน์เพื่อขอข้อมูลเพิ่มเติม",
      },
      {
        q: "สอนเป็นภาษาอะไร",
        a: "ได้ทั้งภาษาไทยและอังกฤษ แล้วแต่ผู้เรียนในรอบนั้นถนัดภาษาไหน",
      },
    ],
  },
  education: {
    eyebrow: "// การศึกษา",
    title: "คลาสส่วนตัว",
    highlight: "สำหรับทีมของคุณ",
    intro: "เราสอนฮิวแมนนอยด์และ physical AI ในสถานที่และเวลาที่คุณเลือก",
    more: "ดูหลักสูตร",
    line: "ทักไลน์คุยกัน",
    programEyebrow: "// หลักสูตร",
    whyEyebrow: "// ทำไมต้องเรียนกับเรา",
    segments: {
      factory: {
        nav: "โรงงาน",
        hint: "เรียนรู้ฮิวแมนนอยด์และ Physical AI สำหรับสายการผลิตของคุณ",
        title: "คอร์สฮิวแมนนอยด์สำหรับโรงงาน",
        description:
          "เรียนรู้ฮิวแมนนอยด์และ Physical AI สำหรับสายการผลิตของคุณ ในคอร์สส่วนตัว 2 วัน ทีมของคุณจะได้ประกอบและเขียนโปรแกรมหุ่นจริง เพื่อดูว่าใช้กับไลน์ผลิตได้แค่ไหน ที่โรงงานของคุณหรือแล็บเราในกรุงเทพฯ",
        eyebrow: "การศึกษา · โรงงาน",
        heading: ["ฮิวแมนนอยด์", "สำหรับโรงงาน"],
        facts: [
          ["อบรม", "2–16 คน"],
          ["สถานที่", "โรงงานคุณหรือแล็บเรา"],
          ["ราคา", "ทักไลน์คุยกัน"],
        ],
        programTitle: "สิ่งที่ทีมคุณ",
        programHighlight: "จะได้เรียน",
        program: B2B_PROGRAM_TH,
        whyTitle: "เข้าใจว่า",
        whyHighlight: "ใช้กับโรงงานคุณได้ยังไง",
        why: [
          [
            "ทำอะไรได้ อะไรยังไม่ได้",
            "รู้ว่าฮิวแมนนอยด์ทำอะไรได้แล้วและยังทำอะไรไม่ได้ จากการสร้างเอง ไม่ใช่จากวิดีโอเดโม",
          ],
          [
            "ปรับคลาสให้ตรงกับไลน์ผลิตคุณ",
            "วิศวกรของคุณไม่ได้เรียนแค่หลักการทั่วไป แต่ได้ลองกับโจทย์จริงของไลน์ผลิตคุณ",
          ],
          [
            "ติดตั้งให้ตรงโจทย์",
            "ทีมเราพร้อมเสนอโซลูชันระบบอัตโนมัติที่ตอบโจทย์โรงงานของคุณ",
          ],
        ],
      },
      school: {
        nav: "มหาลัย / โรงเรียน",
        hint: "แพลตฟอร์มวิจัยฮิวแมนนอยด์ ที่ช่วยให้นักเรียนเข้าใจหุ่นยนต์อย่างลึกซึ้ง",
        title: "คอร์สฮิวแมนนอยด์สำหรับมหาวิทยาลัยและโรงเรียน",
        description:
          "แพลตฟอร์มวิจัยฮิวแมนนอยด์สำหรับนักเรียนนักศึกษา ในคอร์สส่วนตัว 2 วัน ได้ประกอบฮิวแมนนอยด์โอเพนซอร์สของจริง แล้วเขียนโปรแกรมด้วย ROS 2, MuJoCo และ reinforcement learning ที่สถานศึกษาหรือแล็บเราในกรุงเทพฯ",
        eyebrow: "การศึกษา · มหาลัย / โรงเรียน",
        heading: ["ฮิวแมนนอยด์", "สำหรับสถานศึกษา"],
        facts: [
          ["อบรม", "2–30 คน"],
          ["สถานที่", "สถานศึกษาหรือแล็บเรา"],
          ["ราคา", "ทักไลน์คุยกัน"],
        ],
        programTitle: "สิ่งที่นักเรียน",
        programHighlight: "จะได้สร้าง",
        program: B2B_PROGRAM_TH,
        whyTitle: "เพิ่มโอกาสให้นักเรียนของคุณ",
        whyHighlight: "ในสายหุ่นยนต์และ AI",
        why: [
          [
            "นำหน้าด้วยนวัตกรรม",
            "ก้าวนำสถานศึกษาอื่นด้วยหลักสูตรหุ่นยนต์และ Physical AI ที่ล้ำสมัย",
          ],
          [
            "เรียนกับวิศวกรตัวจริง",
            "ทีมเราเป็นวิศวกรที่มีประสบการณ์ในอุตสาหกรรมหุ่นยนต์จริง",
          ],
          [
            "แพลตฟอร์มวิจัย",
            "สร้างสภาพแวดล้อมที่ดีที่สุดให้นักเรียนได้วิจัยและพัฒนาฮิวแมนนอยด์และ Physical AI",
          ],
        ],
      },
      kids: {
        nav: "เด็ก",
        hint: "สร้างประสบการณ์ให้ลูกได้ลองประกอบฮิวแมนนอยด์ของจริง",
        title: "คลาสประกอบฮิวแมนนอยด์สำหรับเด็ก",
        description:
          "ให้ลูกได้ลองประกอบฮิวแมนนอยด์ของจริง ในคลาสส่วนตัว 8 ชั่วโมงสำหรับเด็กอายุ 12–18 ปี ตั้งแต่ขา แขน ลำตัว ไปจนถึงบังคับด้วยจอยสติ๊ก ที่บ้านคุณหรือแล็บเราในกรุงเทพฯ",
        eyebrow: "การศึกษา · เด็ก",
        heading: ["ประกอบ", "ฮิวแมนนอยด์จริง"],
        facts: [
          ["อายุ", "12–18 ปี"],
          ["ผู้เรียน", "1-6 คน"],
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
        whyTitle: "สัมผัสช่วงเวลาสุดว้าวของ",
        whyHighlight: "การประกอบหุ่นยนต์จริง",
        why: [
          [
            "ประสบการณ์ที่หาที่ไหนไม่ได้",
            "ให้ลูกได้มีช่วงเวลาพิเศษ ประกอบฮิวแมนนอยด์ของจริงด้วยมือตัวเอง",
          ],
          [
            "เพิ่มผลงานใส่พอร์ต",
            "ให้ลูกได้โชว์ว่าเขามีศักยภาพด้านหุ่นยนต์และ AI",
          ],
          [
            "ทักษะที่อนาคตต้องการ",
            "หุ่นยนต์และ AI คืออนาคต การประกอบฮิวแมนนอยด์คือจุดเริ่มต้นที่ดีในการฝึกทักษะเหล่านี้",
          ],
        ],
      },
    },
    certificate: {
      eyebrow: "// หลังเรียนจบ",
      title: "อัพเกรด",
      highlight: "พอร์ตของคุณ",
      body: "ทุกคนที่เรียนจบจะได้ใบประกาศนียบัตรที่มีชื่อของตัวเอง",
      alt: "ตัวอย่างใบประกาศนียบัตร Humanoice ที่ช่องชื่อเขียนว่า Your Name",
      caption: "ตัวอย่างใบประกาศนียบัตร",
    },
    kit: {
      eyebrow: "// ซื้อชุดคิท",
      title: "มีฮิวแมนนอยด์",
      highlight: "ไว้ที่องค์กรคุณ",
      intro: "ฮิวแมนนอยด์ที่เราใช้คือ Roboto Origin ของ Roboparty — สูง 1.25 ม. หนัก 34 กก. 23 องศาอิสระ",
      offers: [
        {
          name: "ชุดคิทฮิวแมนนอยด์",
          tag: "ซื้อ",
          items: [
            "ตัวหุ่นฮิวแมนนอยด์",
            "บอร์ดคอมพิวเตอร์",
            "บอร์ดควบคุม",
            "แบตเตอรี่ 48V / 15 Ah",
          ],
        },
        {
          name: "บริการดูแลรักษา",
          tag: "12 เดือน",
          items: [
            "ตรวจเช็กถึงที่ 2 ครั้ง",
            "ซ่อมและเปลี่ยนชิ้นส่วนที่เสียหายฟรี",
          ],
        },
      ],
      cta: "สอบถามเรื่องชุดคิท",
      alt: "ฮิวแมนนอยด์ที่มากับชุดคิท กำลังก้าวเดิน",
    },
  },
  about: {
    title: "เกี่ยวกับเรา",
    description:
      "Humanoice คือแล็บหุ่นยนต์ฮิวแมนนอยด์แบบลงมือทำที่พระโขนง กรุงเทพฯ มีทั้งคอร์สทั่วไป คลาสส่วนตัว และชุดคิทฮิวแมนนอยด์",
    eyebrow: "// เกี่ยวกับเรา",
    heading: ["เราสร้าง", "ฮิวแมนนอยด์"],
    lead: "ฮิวแมนน้อย (Humanoice) คือแล็บหุ่นยนต์ฮิวแมนนอยด์ที่พระโขนง กรุงเทพฯ เราสอนคนให้ประกอบฮิวแมนนอยด์โอเพนซอร์สของจริง และขายพร้อมดูแลหุ่นด้วย",
  },
  footer: {
    ticker: "เปลี่ยนประเทศไทยให้เป็น Shenzhen แห่ง Southeast Asia",
    location: "พระโขนง, กรุงเทพฯ",
    title: "แอดไลน์",
    highlight: "เพื่อขอรายละเอียด",
    qrLabel: "@humanoice",
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
    privateTraining: {
      text: "อยากได้คลาสส่วนตัวสำหรับทีม โรงเรียน หรือลูก ๆ?",
      link: "ทักไลน์คุยกัน",
    },
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
      trackTags: ["ฮาร์ดแวร์", "ซอฟต์แวร์"],
      pickDate: "เลือกรอบวันที่",
      clear: "ล้าง",
      dayUnit: ["วัน", "วัน"],
      priceUnit: "บาท",
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
      title: "คุณจองไว้",
      highlight: "เรียบร้อยแล้ว",
      body: "รอบที่เลือกจ่ายครบแล้ว ไม่ต้องจ่ายเพิ่ม ถ้าอยากเปลี่ยนอะไร ทักมาทางไลน์ได้เลย",
      line: "แชทใน LINE",
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
export function getDictionary(locale: "th"): Dictionary;
/** For callers that only know the locale at runtime (the apply actions) — `.apply` is `ApplyCopy` either way. */
export function getDictionary(locale: Locale): typeof en | Dictionary;
export function getDictionary(locale: Locale): typeof en | Dictionary {
  return dictionaries[locale];
}

/** courses.slug each public course applies for, index-aligned with `curriculum.tracks`. */
export const COURSE_SLUGS = ["hardware", "software"] as const;

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
