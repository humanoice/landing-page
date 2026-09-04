import "server-only";
import type { Language, ProgrammingLanguage, Skill } from "@/lib/apply-options";

export type Locale = "en" | "th";

const en = {
  nav: {
    curriculum: "Curriculum",
    team: "Team",
    partners: "Partners",
    apply: "Apply",
    language: "Language",
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
      ["Program", "2 Tracks"],
    ],
  },
  curriculum: {
    eyebrow: "// The Tracks",
    title: "Pick your",
    highlight: "track",
    track: "Track",
    combined: "Track 01 + Track 02, end to end",
    note: "The curriculum can change based on the pace of learners.",
    tracks: [
      {
        name: "Hardware in Humanoid 101",
        tag: "Hardware",
        duration: "2 days",
        price: "12,900 THB",
        blurb:
          "It's like IKEA but for humanoids - assemble from ground up yourself",
        cta: "Apply",
        items: [
          [
            "Leg assembly",
            "Hips, knees, and ankles — build the joints that carry all the weight.",
          ],
          [
            "Body assembly",
            "The torso and spine that every other part hangs off.",
          ],
          [
            "Arm assembly",
            "Shoulders to wrists — linkages, actuators, and range of motion.",
          ],
          [
            "Electronics in humanoid",
            "Actuators, IMU, and CAN buses that wire every joint together.",
          ],
        ],
      },
      {
        name: "Humanoid Programming 101",
        tag: "Software",
        duration: "1 day",
        price: "8,900 THB",
        blurb:
          "Modern software for humanoids: From modeling to simulate for policy.",
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
            "Simulation",
            "Gazebo and MuJoCo — rehearse every motion in real physics before it touches hardware.",
          ],
          [
            "Policy",
            "Deploy the RL model that make the robot walk.",
          ],
        ],
      },
      {
        name: "B2B",
        tag: "Full Scope",
        duration: "n days",
        price: "xxx,xxx THB",
        blurb:
          "Buy the robot kit. We teach you from assemble to programming. Suitable for labs or companies.",
        cta: "Talk to us",
        items: [
          [
            "Hardware — Assemble",
            "The complete build: legs, body, arms, and every wire in between.",
          ],
          [
            "Software — Make it walk",
            "ROS 2, simulation, URDF, and locomotion policies — until it takes real steps.",
          ],
        ],
      },
    ],
  },
  team: {
    eyebrow: "// Team",
    title: "Meet your",
    highlight: "instructors",
    roles: ["Main Instructor", "Senior Robotic Engineer", "Head of AI"],
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
    label: "Build with us",
    callout: ["Open-source", "a humanoid?", "Partner up"],
  },
  faq: {
    eyebrow: "// FAQ",
    title: "Questions,",
    highlight: "answered",
    items: [
      {
        q: "No background at all — can I still join?",
        a: "Yes. Hardware in Humanoid 101 is beginner-friendly. Humanoid Programming 101 requires programming basics: if you can write simple Python or use a command line, that's enough.",
      },
      {
        q: "How many days is it, and what time?",
        a: "Hardware in Humanoid 101 runs 2 days; Humanoid Programming 101 is 1 day. Both run 10:00–17:00.",
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
        a: "15+ years old. This is real mechanical and electrical work — it can be dangerous if you’re careless.",
      },
      {
        q: "What language do you teach in?",
        a: "Thai or English — whichever the room needs.",
      },
    ],
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
    sections: {
      about: "About you",
      background: "Your background",
      course: "Pick your track",
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
      seatsLeft: "seats left",
      full: "Full",
      empty:
        "No runs are open right now. Add us on LINE and we'll ping you the moment the next one opens.",
      line: "Add LINE",
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
    },
    success: {
      eyebrow: "// Thank you",
      title: "Registration complete",
      highlight: "Payment pending",
      body: "Your seat will only be confirmed after payment. Please add us on LINE to make your payment.",
      line: "Pay via LINE",
      qrLabel: "@humanoice",
    },
  },
};

export type HomeDictionary = Omit<typeof en, "plan" | "apply">;
export type MasterPlanCopy = typeof en.plan;
export type ApplyCopy = typeof en.apply;
type ThaiDictionary = HomeDictionary & { apply: ApplyCopy };

const th: ThaiDictionary = {
  nav: {
    curriculum: "หลักสูตร",
    team: "ทีม",
    partners: "Partner",
    apply: "สมัคร",
    language: "ภาษา",
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
      ["รูปแบบ", "2 คอร์ส"],
    ],
  },
  curriculum: {
    eyebrow: "// คอร์สการเรียน",
    title: "เลือกคอร์ส",
    highlight: "ของคุณ",
    track: "คอร์ส",
    combined: "คอร์ส 01 + คอร์ส 02 แบบครบจบ",
    note: "เนื้อหาอาจปรับตามจังหวะการเรียนของแต่ละรุ่น",
    tracks: [
      {
        name: "Hardware in Humanoid 101",
        tag: "ฮาร์ดแวร์",
        duration: "2 วัน",
        price: "12,900 บาท",
        blurb:
          "เหมือน IKEA แต่เป็นฮิวแมนนอยด์ — ประกอบเองตั้งแต่ชิ้นแรกจนครบทั้งตัว",
        cta: "สมัคร",
        items: [
          [
            "ประกอบขา",
            "สะโพก เข่า และข้อเท้า — ประกอบข้อต่อที่รับน้ำหนักทั้งตัว",
          ],
          [
            "ประกอบลำตัว",
            "โครงลำตัวและกระดูกสันหลังที่ทุกชิ้นส่วนมายึดเกาะ",
          ],
          [
            "ประกอบแขน",
            "จากหัวไหล่ถึงข้อมือ — กลไก แอคชูเอเตอร์ และองศาการเคลื่อนไหว",
          ],
          [
            "อิเล็กทรอนิกส์ในฮิวแมนนอยด์",
            "actuator, IMU, และ CAN bus ที่เชื่อมทุกข้อต่อเข้าด้วยกัน",
          ],
        ],
      },
      {
        name: "Humanoid Programming 101",
        tag: "ซอฟต์แวร์",
        duration: "1 วัน",
        price: "8,900 บาท",
        blurb:
          "สายซอฟต์แวร์ของฮิวแมนนอยด์ — สร้างโมเดล จำลอง แล้วเทรนให้มันเดินได้",
        cta: "สมัคร",
        items: [
          [
            "ROS 2",
            "framework ที่หุ่นยนต์สมัยใหม่ใช้ — node, topic, และ control loop",
          ],
          [
            "simulation",
            "Gazebo และ MuJoCo — รัน simulation ทุกการเคลื่อนไหวในฟิสิกส์",
          ],
          [
            "URDF",
            "สร้างโมเดลร่างกายฮิวแมนนอยด์ให้ code รู้จักทุกชิ้นส่วนและทุกข้อต่อ",
          ],
          [
            "Deployment",
            "deploy policy ลงไปควบคุมหุ่นจริงจนมันเดินได้",
          ],
        ],
      },
      {
        name: "Full Bootcamp",
        tag: "B2B",
        duration: "n วัน",
        price: "xx,xxx บาท",
        blurb:
          "หลักสูตรแบบเอ็กซ์คลูซีฟที่ปรับแต่งได้สำหรับบริษัท — ตั้งแต่การประกอบไปจนถึงการเขียนโปรแกรม humanoid",
        cta: "ทักมาคุยกันทางไลน์",
        items: [
          [
            "ฮาร์ดแวร์ — ประกอบ",
            "สร้างครบทั้งตัว ขา ลำตัว แขน และสายไฟทุกเส้น",
          ],
          [
            "ซอฟต์แวร์ — ทำให้มันเดิน",
            "ROS 2 simulation URDF และ locomotion policies จนหุ่นก้าวเดินได้จริง",
          ],
        ],
      },
    ],
  },
  team: {
    eyebrow: "// ทีมเรา",
    title: "มารู้จัก",
    highlight: "ทีมผู้สอน",
    roles: ["ผู้สอนหลัก", "วิศวกรหุ่นยนต์อาวุโส", "หัวหน้าทีม AI"],
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
    label: "มาสร้างด้วยกัน",
    callout: ["มีฮิวแมนนอยด์", "โอเพนซอร์สเหรอ?", "มาเป็นพาร์ตเนอร์กัน"],
  },
  faq: {
    eyebrow: "// คำถามที่พบบ่อย",
    title: "คำถาม",
    highlight: "ที่เจอบ่อย",
    items: [
      {
        q: "ถ้าไม่มีความรู้พื้นฐานเลย เรียนได้ไหม",
        a: "คุณสามารถเรียน Hardware in Humanoid 101 ได้ ไม่ต้องมีพื้นฐานอะไรมาก่อน ส่วน Humanoid Programming 101 ขอพื้นฐานการเขียนโปรแกรมนิดหน่อย ถ้าเขียน Python ง่าย ๆ ได้ หรือใช้ command line เป็น ก็พอแล้ว",
      },
      {
        q: "เรียนกี่วัน กี่โมง",
        a: "Hardware in Humanoid 101 เรียน 2 วัน และ Humanoid Programming 101 เรียน 1 วัน เวลา 10:00–17:00 น.",
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
        a: "อายุ 15+ ปี เพราะเป็นงาน mechanic และไฟฟ้าของจริง ถ้าไม่ระวังก็อาจเกิดอันตรายได้",
      },
      {
        q: "สอนเป็นภาษาอะไร",
        a: "ได้ทั้งภาษาไทยและอังกฤษ แล้วแต่ผู้เรียนในรอบนั้นถนัดภาษาไหน",
      },
    ],
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
    sections: {
      about: "เกี่ยวกับคุณ",
      background: "พื้นฐานของคุณ",
      course: "เลือกรอบเรียน",
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
      seatsLeft: "ที่นั่งว่าง",
      full: "เต็มแล้ว",
      empty:
        "ตอนนี้ยังไม่มีรอบเปิดรับสมัคร แอดไลน์ไว้ แล้วเราจะแจ้งทันทีที่รอบใหม่เปิด",
      line: "แอดไลน์",
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
    },
    success: {
      eyebrow: "// ขอบคุณ",
      title: "สมัครเรียบร้อย",
      highlight: "รอจ่ายเงิน",
      body: "ยืนยันที่นั่ง หลังจ่ายเงินเรียบร้อยแล้วเท่านั้น รบกวนแอดไลน์มาจ่ายเงินกับเราหน่อยน้า",
      line: "จ่ายเงินใน LINE",
      qrLabel: "@humanoice",
    },
  },
};

const dictionaries = { en, th };

export function getDictionary(locale: "en"): typeof en;
export function getDictionary(locale: "th"): ThaiDictionary;
export function getDictionary(locale: Locale): typeof en | ThaiDictionary {
  return dictionaries[locale];
}

/** The application page, optionally pre-ticking a run: /apply?course=hardware, /th/apply?course=software */
export function applyPath(locale: Locale, course?: string) {
  return `${localePath(locale, "/apply")}${course ? `?course=${course}` : ""}`;
}

export function localePath(locale: Locale, path = "/") {
  const normalizedPath = path === "/" ? "" : path;
  return locale === "th" ? `/th${normalizedPath}` : normalizedPath || "/";
}
