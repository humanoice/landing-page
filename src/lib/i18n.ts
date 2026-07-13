import "server-only";

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
    eyebrow: "Humanoid Bootcamp · Bangkok",
    title: ["Teach", "humans to", "build humanoids."],
    description:
      "Thailand's first hands-on humanoid school. From raw materials to full deployment — you assemble, program, and deploy a real humanoid.",
    join: "Apply",
    curriculum: "See the curriculum",
    facts: [
      ["Location", "Phra Khanong, Bangkok"],
      ["Program", "3 Tracks"],
      ["First Batch", "Q4 2026"],
    ],
  },
  curriculum: {
    eyebrow: "// The Tracks",
    title: "Pick your",
    highlight: "track.",
    description:
      "Start with a two-day 101 — software or hardware — or take your team through the full twelve-day build. Every track is hands-on with real humanoids from the first hour. No lecture marathons.",
    track: "Track",
    combined: "Track 01 + Track 02, end to end",
    note: "The curriculum can change based on the pace of learners.",
    tracks: [
      {
        name: "Humanoid Programming 101",
        tag: "Software",
        duration: "2 days",
        price: "7,900 THB",
        blurb:
          "The software side of humanoids: model one, simulate it, and train it to walk.",
        cta: "Apply",
        items: [
          [
            "ROS 2",
            "The framework almost every modern robot runs on — nodes, topics, and control loops.",
          ],
          [
            "Simulation",
            "Isaac Sim and MuJoCo — rehearse every motion in real physics before it touches hardware.",
          ],
          [
            "URDF",
            "Model a humanoid's body so your code knows every link and joint.",
          ],
          [
            "Locomotion policies",
            "Train and tune the controllers that keep a humanoid on its feet.",
          ],
        ],
      },
      {
        name: "Hardware in Humanoid 101",
        tag: "Hardware",
        duration: "2 days",
        price: "9,900 THB",
        blurb:
          "The physical side: build a humanoid's body with your own hands, joint by joint, wire by wire.",
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
            "Power, motor drivers, and the buses that wire every joint together.",
          ],
        ],
      },
      {
        name: "Full Bootcamp",
        tag: "B2B",
        duration: "n days",
        price: "xx,xxx THB",
        blurb:
          "Both tracks end to end for companies and teams — assemble a full humanoid, then program it to walk.",
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
    highlight: "open robots.",
    description:
      "Our students learn on real, open-source humanoid platforms — the same hardware shaping the future of robotics worldwide.",
    asimov:
      "Asimov 1, Here Be Dragons Edition — open-source humanoid robot by Menlo Research.",
    roboparty:
      "ROBOTO ORIGIN, open-source humanoid robot by a Shanghai-based company.",
    label: "Build with us",
    callout: ["Open-source", "a humanoid?", "Partner up"],
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
    closing: "Three steps. One mission.",
    closingHighlight: "Add LINE for more details",
    join: "Apply",
  },
};

export type HomeDictionary = Omit<typeof en, "plan">;
export type MasterPlanCopy = typeof en.plan;

const th: HomeDictionary = {
  nav: {
    curriculum: "หลักสูตร",
    team: "ทีม",
    partners: "Partner",
    apply: "สมัคร",
    language: "ภาษา",
  },
  hero: {
    eyebrow: "บูตแคมป์ฮิวแมนนอยด์ · กรุงเทพฯ",
    title: ["สอนคน", "ให้สร้าง", "ฮิวแมนนอยด์"],
    description:
      "โรงเรียนฮิวแมนนอยด์แบบลงมือทำแห่งแรกของไทย ตั้งแต่ชิ้นส่วนแรกจนพร้อมใช้งานจริง — คุณจะได้ประกอบ เขียนโปรแกรม และพาฮิวแมนนอยด์ของจริงไปลุยงาน",
    join: "สมัคร",
    curriculum: "มาดูหลักสูตร",
    facts: [
      ["ที่ไหน", "พระโขนง, กรุงเทพฯ"],
      ["รูปแบบ", "3 คอร์ส"],
      ["รุ่นแรก", "ไตรมาส 4 ปี 2026"],
    ],
  },
  curriculum: {
    eyebrow: "// คอร์สการเรียน",
    title: "เลือกคอร์ส",
    highlight: "ของคุณ",
    description:
      "เริ่มจากคอร์ส 101 แบบ 2 วัน จะสายซอฟต์แวร์หรือฮาร์ดแวร์ก็ได้ หรือพาทีมมาลุยบูตแคมป์เต็ม 12 วันไปเลย ทุกคอร์สได้ลงมือทำกับฮิวแมนนอยด์ของจริงตั้งแต่ชั่วโมงแรก ไม่มีนั่งฟังเลกเชอร์ยาว ๆ",
    track: "คอร์ส",
    combined: "คอร์ส 01 + คอร์ส 02 แบบครบจบ",
    note: "เนื้อหาอาจปรับตามจังหวะการเรียนของแต่ละรุ่น",
    tracks: [
      {
        name: "Humanoid Programming 101",
        tag: "ซอฟต์แวร์",
        duration: "2 วัน",
        price: "7,900 บาท",
        blurb:
          "สายซอฟต์แวร์ของฮิวแมนนอยด์ — สร้างโมเดล จำลอง แล้วเทรนให้มันเดินได้",
        cta: "สมัครทางไลน์",
        items: [
          [
            "ROS 2",
            "เฟรมเวิร์กที่หุ่นยนต์ยุคใหม่แทบทุกตัวใช้ — โหนด ท็อปปิก และลูปควบคุม",
          ],
          [
            "simulation",
            "Isaac Sim และ MuJoCo — ซ้อมทุกการเคลื่อนไหวในฟิสิกส์สมจริงก่อนลงฮาร์ดแวร์จริง",
          ],
          [
            "URDF",
            "สร้างโมเดลร่างกายฮิวแมนนอยด์ให้โค้ดรู้จักทุกชิ้นส่วนและทุกข้อต่อ",
          ],
          [
            "Locomotion policies",
            "เทรนและจูนตัวควบคุมที่ทำให้ฮิวแมนนอยด์ทรงตัวและก้าวเดินได้",
          ],
        ],
      },
      {
        name: "Hardware in Humanoid 101",
        tag: "ฮาร์ดแวร์",
        duration: "2 วัน",
        price: "9,900 บาท",
        blurb:
          "สายฮาร์ดแวร์ — สร้างร่างกายฮิวแมนนอยด์ด้วยมือคุณเอง ทีละข้อต่อ ทีละเส้นสาย",
        cta: "สมัครทางไลน์",
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
            "ระบบไฟ ไดรเวอร์มอเตอร์ และบัสที่เชื่อมทุกข้อต่อเข้าด้วยกัน",
          ],
        ],
      },
      {
        name: "Full Bootcamp",
        tag: "B2B",
        duration: "n วัน",
        price: "xx,xxx บาท",
        blurb:
          "สองคอร์สแบบครบจบสำหรับบริษัทและทีม — ประกอบฮิวแมนนอยด์เต็มตัว แล้วเขียนโปรแกรมให้มันเดินได้จริง",
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
    description:
      "ที่นี่คุณจะได้เรียนกับแพลตฟอร์มฮิวแมนนอยด์โอเพนซอร์สของจริง — ฮาร์ดแวร์เดียวกับที่กำลังพาโลกหุ่นยนต์ไปข้างหน้า",
    asimov:
      "Asimov 1, Here Be Dragons Edition — ฮิวแมนนอยด์โอเพนซอร์สจาก Menlo Research",
    roboparty: "ROBOTO ORIGIN — ฮิวแมนนอยด์โอเพนซอร์สจากบริษัทในเซี่ยงไฮ้",
    label: "มาสร้างด้วยกัน",
    callout: ["มีฮิวแมนนอยด์", "โอเพนซอร์สเหรอ?", "มาเป็นพาร์ตเนอร์กัน"],
  },
  footer: {
    ticker: "เปลี่ยนประเทศไทยให้เป็น Shenzhen แห่ง Southeast Asia",
    location: "พระโขนง, กรุงเทพฯ",
    title: "แอดไลน์",
    highlight: "เพื่อขอรายละเอียด",
    qrLabel: "@humanoice",
  },
};

const dictionaries = { en, th };

export function getDictionary(locale: "en"): typeof en;
export function getDictionary(locale: "th"): HomeDictionary;
export function getDictionary(locale: Locale): typeof en | HomeDictionary {
  return dictionaries[locale];
}

export function localePath(locale: Locale, path = "/") {
  const normalizedPath = path === "/" ? "" : path;
  return locale === "th" ? `/th${normalizedPath}` : normalizedPath || "/";
}
