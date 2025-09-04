export type ApplicantResponses = Record<string, string>;

export type DomainResponses = Record<string, ApplicantResponses>;

// Technical domain sample responses keyed by applicant id
export const technicalResponses: DomainResponses = {
  t1: {
    registrationNumber: "RA2411033010001",
    personalEmail: "aarav.menon@example.com",
    phone: "9876543210",
    yearOfStudy: "2",
    section: "A",
    branch: "CSE",
    specialization: "AI",
    department: "Computer Science and Engineering",
    programmingLanguages: "TypeScript, Python, C++",
    frameworks: "React, Next.js, Node.js",
    experience: "About 2 years building full-stack projects and bots.",
    learningStyle: "Hands-on projects and docs",
    challenges: "Built a real-time chat app at scale during a hackathon.",
    projects: "Portfolio site, Chat app, IoT dashboard",
    hackathons: "2 hackathons, won 1st place once",
    openSource: "Contributed to a Next.js starter",
    teamwork: "Worked in a team of 4 on a SaaS project",
    mentorship: "Mentored juniors in basic web dev",
    whyJoin: "To ship impactful technical projects for the club",
    learningGoals: "Deepen system design and DevOps",
    contribution: "Lead frontend architecture and DX"
  },
  t2: {
    registrationNumber: "RA2411033010002",
    personalEmail: "diya.sharma@example.com",
    phone: "9876501234",
    yearOfStudy: "1",
    section: "B",
    branch: "ECE",
    specialization: "Embedded",
    department: "Electronics and Communication Engineering",
    programmingLanguages: "C, Python",
    experience: "1 year academic projects",
    challenges: "Optimized sensor data pipeline",
    projects: "Line follower bot, Weather station",
    whyJoin: "Grow with real products",
    learningGoals: "Data structures, networking",
    contribution: "Firmware and integrations"
  },
  t3: {
    registrationNumber: "RA2411033010003",
    personalEmail: "rohan.gupta@example.com",
    phone: "9876009876",
    yearOfStudy: "3",
    section: "C",
    branch: "IT",
    specialization: "Systems",
    department: "Information Technology",
    programmingLanguages: "Go, Rust, TS",
    experience: "3+ years; internships",
    challenges: "Reduced API p95 by 40%",
    projects: "K/V store, CLI tools",
    whyJoin: "Work on infra",
    learningGoals: "Observability, scaling",
    contribution: "Backend performance"
  }
};

// Creatives domain sample responses keyed by applicant id
export const creativesResponses: DomainResponses = {
  c1: {
    registrationNumber: "RA2411033010101",
    personalEmail: "ishita.verma@example.com",
    phone: "9867543210",
    yearOfStudy: "2",
    section: "A",
    branch: "CSE",
    department: "Computer Science and Engineering",
    designTools: "Figma, Photoshop, Illustrator",
    creativeSkills: "UI/UX, Branding",
    experience: "2 years freelance",
    style: "Minimal, functional",
    inspirations: "Dieter Rams, Japanese design",
    projects: "University app redesign, Club branding",
    collaboration: "Worked with devs to ship design system",
    feedback: "Iterative, user testing",
    deadlines: "Plan buffers, versioning",
    innovation: "Moodboards and design sprints",
    whyJoin: "Elevate club visuals",
    growth: "Motion design",
    impact: "Consistent brand across media"
  },
  c2: {
    registrationNumber: "RA2411033010102",
    personalEmail: "kabir.rao@example.com",
    phone: "9812345678",
    yearOfStudy: "1",
    section: "B",
    branch: "Mech",
    department: "Mechanical Engineering",
    designTools: "Blender, After Effects",
    creativeSkills: "3D, Motion",
    projects: "Event intro reels"
  },
  c3: {
    registrationNumber: "RA2411033010103",
    personalEmail: "maya.nair@example.com",
    phone: "9898989898",
    yearOfStudy: "3",
    section: "C",
    branch: "ECE",
    department: "Electronics and Communication Engineering",
    designTools: "Figma, Procreate",
    creativeSkills: "Illustration, UI",
    projects: "Poster series, mobile UI kit"
  }
};

// Corporate domain sample responses keyed by applicant id
export const corporateResponses: DomainResponses = {
  co1: {
    registrationNumber: "RA2411033010201",
    personalEmail: "ritika.agarwal@example.com",
    phone: "9000012345",
    yearOfStudy: "2",
    section: "A",
    branch: "EEE",
    department: "Electrical and Electronics Engineering",
    leadershipExperience: "Led 10-person fest team",
    businessSkills: "PM, Marketing",
    experience: "2 years college clubs",
    communication: "Clear, async updates",
    decisionMaking: "Data-informed"
  },
  co2: {
    registrationNumber: "RA2411033010202",
    personalEmail: "siddharth.iyer@example.com",
    phone: "9123456780",
    yearOfStudy: "1",
    section: "B",
    branch: "CSE",
    department: "Computer Science and Engineering",
    leadershipExperience: "House captain",
    businessSkills: "Finance, Ops"
  },
  co3: {
    registrationNumber: "RA2411033010203",
    personalEmail: "tanya.kapoor@example.com",
    phone: "9345678901",
    yearOfStudy: "3",
    section: "C",
    branch: "IT",
    department: "Information Technology",
    leadershipExperience: "Startup internship",
    businessSkills: "Strategy, BD"
  }
};


