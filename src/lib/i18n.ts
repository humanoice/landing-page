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
      ["Program", "3-Stage Build"],
      ["First Batch", "Q4 2026"],
    ],
  },
  curriculum: {
    eyebrow: "// The Curriculum",
    title: "From bolts",
    highlight: "to brains.",
    description:
      "A three-month bootcamp that meets once a week — twelve hands-on sessions, no lecture marathons. Two months building the body, one month bringing it to life, and a humanoid that can walk.",
    part: "Part",
    parts: [
      {
        name: "Assemble",
        tag: "Build the body",
        span: "Months 1–2 · Sessions 1–8",
        blurb: "The curriculum can change based on the pace of learners",
        sessions: [
          [
            "Foundations & safety",
            "Robotics fundamentals, shop tooling and safety, the bill of materials, and the open-source platform you build on.",
          ],
          [
            "Actuators & joints",
            "BLDC motors, FOC drivers, and cycloidal gearboxes — the joint modules that make a robot move.",
          ],
          [
            "Legs & drivetrain",
            "Assemble the hip, knee, and ankle joints that carry the robot's weight and define its gait.",
          ],
          [
            "Torso & arms",
            "Build out the spine, shoulders, and arm linkages from 3D-printed and CNC structural parts.",
          ],
          [
            "Power system",
            "Battery, BMS, and power distribution sized to keep a moving humanoid running.",
          ],
          [
            "Wiring & buses",
            "Route the harness and wire the CAN / EtherCAT buses linking every joint to power and data.",
          ],
          [
            "Sensing",
            "Install and calibrate the IMU, joint encoders, and force-torque sensors the robot feels with.",
          ],
          [
            "Hardware bring-up",
            "First power-on: joint-by-joint checks, safe limits, and a skeleton that answers to commands.",
          ],
        ],
      },
      {
        name: "Software",
        tag: "Make it walk",
        span: "Month 3 · Sessions 9–12",
        blurb: "The curriculum can change based on the pace of learners",
        sessions: [
          [
            "Kinematics & control",
            "URDF modeling, forward / inverse kinematics, and PID joint loops on ROS 2 Control.",
          ],
          [
            "Digital twin",
            "Mirror your robot in Isaac Sim / MuJoCo, rehearse motions safely, and close the sim-to-real gap.",
          ],
          [
            "Balance & first steps",
            "Whole-body control and a learned walking gait — tune the policy until it holds balance and steps.",
          ],
          [
            "Capstone & demo day",
            "Get it walking on the floor, run a real task, and present to family and friends.",
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
    join: "Apply on LINE",
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
      ["รูปแบบ", "สร้าง 3 ช่วง"],
      ["รุ่นแรก", "ไตรมาส 4 ปี 2026"],
    ],
  },
  curriculum: {
    eyebrow: "// หลักสูตร",
    title: "จากน็อต",
    highlight: "สู่สมองกล",
    description:
      "บูตแคมป์ 3 เดือน เรียนสัปดาห์ละครั้ง รวม 12 เซสชันที่ได้ลงมือทำจริง ๆ ไม่มีนั่งฟังเลกเชอร์ยาว ๆ สองเดือนแรกมาสร้างร่างกาย เดือนสุดท้ายมาปลุกให้มีชีวิต แล้วจบด้วยฮิวแมนนอยด์ที่เดินได้",
    part: "พาร์ต",
    parts: [
      {
        name: "ประกอบ",
        tag: "มาสร้างร่างกาย",
        span: "เดือน 1–2 · เซสชัน 1–8",
        blurb: "เนื้อหาอาจปรับตามจังหวะการเรียนของทุกคน",
        sessions: [
          [
            "พื้นฐานและความปลอดภัย",
            "ปูพื้นฐานหุ่นยนต์ รู้จักเครื่องมือและความปลอดภัยในเวิร์กช็อป ไล่ดูรายการชิ้นส่วน และแพลตฟอร์มโอเพนซอร์สที่เราจะใช้สร้างกัน",
          ],
          [
            "แอคชูเอเตอร์และข้อต่อ",
            "มาทำความรู้จักมอเตอร์ BLDC ไดรเวอร์ FOC และเกียร์ไซโคลิดัล — โมดูลข้อต่อที่ทำให้หุ่นยนต์ขยับได้",
          ],
          [
            "ขาและระบบขับเคลื่อน",
            "ประกอบข้อต่อสะโพก เข่า และข้อเท้า ที่ช่วยรับน้ำหนักและกำหนดจังหวะเดินของหุ่นยนต์",
          ],
          [
            "ลำตัวและแขน",
            "สร้างกระดูกสันหลัง หัวไหล่ และกลไกแขนจากชิ้นส่วนโครงสร้างที่พิมพ์ 3 มิติและขึ้นรูปด้วย CNC",
          ],
          [
            "ระบบพลังงาน",
            "เลือกแบตเตอรี่ BMS และระบบกระจายไฟให้พอดีกับฮิวแมนนอยด์ตอนกำลังเคลื่อนที่",
          ],
          [
            "สายไฟและบัส",
            "เดินสายและต่อบัส CAN / EtherCAT เพื่อให้ทุกข้อต่อคุยกับระบบไฟและข้อมูลได้",
          ],
          [
            "ระบบรับรู้",
            "ติดตั้งและคาลิเบรต IMU เอ็นโค้ดเดอร์ข้อต่อ และเซนเซอร์แรง-แรงบิดที่ช่วยให้หุ่นยนต์รับรู้สิ่งรอบตัว",
          ],
          [
            "เปิดระบบฮาร์ดแวร์",
            "เปิดเครื่องครั้งแรก เช็กทีละข้อต่อ ตั้งขีดจำกัดความปลอดภัย แล้วดูโครงหุ่นยนต์ตอบสนองต่อคำสั่งของเรา",
          ],
        ],
      },
      {
        name: "ซอฟต์แวร์",
        tag: "มาทำให้มันเดิน",
        span: "เดือน 3 · เซสชัน 9–12",
        blurb: "เนื้อหาอาจปรับตามจังหวะการเรียนของทุกคน",
        sessions: [
          [
            "จลนศาสตร์และการควบคุม",
            "สร้างโมเดล URDF เรียนรู้จลนศาสตร์ไปข้างหน้า/ย้อนกลับ และทำวงควบคุมข้อต่อ PID บน ROS 2 Control",
          ],
          [
            "ดิจิทัลทวิน",
            "จำลองหุ่นยนต์ของเราใน Isaac Sim / MuJoCo ซ้อมการเคลื่อนไหวอย่างปลอดภัย แล้วค่อยลดช่องว่างระหว่างซิมกับของจริง",
          ],
          [
            "ทรงตัวและก้าวแรก",
            "ลองควบคุมทั้งร่างกายและท่าเดินที่เรียนรู้ได้ ปรับนโยบายไปด้วยกันจนมันทรงตัวและก้าวเดินได้",
          ],
          [
            "แคปสโตนและวันเดโม",
            "พาหุ่นยนต์เดินบนพื้นจริง ทำงานจริง แล้วโชว์ให้ครอบครัวและเพื่อน ๆ ดูกัน",
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
