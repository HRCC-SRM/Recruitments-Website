export type SampleApplication = {
  id: string
  name: string
  registrationNumber: string
  srmEmail: string
  personalEmail: string
  phone: string
  yearOfStudy: string
  section?: string
  branch: string
  specialization?: string
  department: string
  domain: string
}

export const technicalApplications: SampleApplication[] = [
  {
    id: "t1",
    name: "Aarav Menon",
    registrationNumber: "RA2411033010001",
    srmEmail: "aarav.menon@srmist.edu.in",
    personalEmail: "aarav.menon@example.com",
    phone: "9876543210",
    yearOfStudy: "2",
    section: "A",
    branch: "CSE",
    specialization: "AI",
    department: "Computer Science and Engineering",
    domain: "technical"
  },
  {
    id: "t2",
    name: "Diya Sharma",
    registrationNumber: "RA2411033010002",
    srmEmail: "diya.sharma@srmist.edu.in",
    personalEmail: "diya.sharma@example.com",
    phone: "9876501234",
    yearOfStudy: "1",
    section: "B",
    branch: "ECE",
    specialization: "Embedded",
    department: "Electronics and Communication Engineering",
    domain: "technical"
  },
  {
    id: "t3",
    name: "Rohan Gupta",
    registrationNumber: "RA2411033010003",
    srmEmail: "rohan.gupta@srmist.edu.in",
    personalEmail: "rohan.gupta@example.com",
    phone: "9876009876",
    yearOfStudy: "3",
    section: "C",
    branch: "IT",
    specialization: "Systems",
    department: "Information Technology",
    domain: "technical"
  }
]

export const creativesApplications: SampleApplication[] = [
  {
    id: "c1",
    name: "Ishita Verma",
    registrationNumber: "RA2411033010101",
    srmEmail: "ishita.verma@srmist.edu.in",
    personalEmail: "ishita.verma@example.com",
    phone: "9867543210",
    yearOfStudy: "2",
    section: "A",
    branch: "CSE",
    specialization: "UX",
    department: "Computer Science and Engineering",
    domain: "creatives"
  },
  {
    id: "c2",
    name: "Kabir Rao",
    registrationNumber: "RA2411033010102",
    srmEmail: "kabir.rao@srmist.edu.in",
    personalEmail: "kabir.rao@example.com",
    phone: "9812345678",
    yearOfStudy: "1",
    section: "B",
    branch: "Mech",
    specialization: "3D",
    department: "Mechanical Engineering",
    domain: "creatives"
  },
  {
    id: "c3",
    name: "Maya Nair",
    registrationNumber: "RA2411033010103",
    srmEmail: "maya.nair@srmist.edu.in",
    personalEmail: "maya.nair@example.com",
    phone: "9898989898",
    yearOfStudy: "3",
    section: "C",
    branch: "ECE",
    specialization: "Motion",
    department: "Electronics and Communication Engineering",
    domain: "creatives"
  }
]

export const corporateApplications: SampleApplication[] = [
  {
    id: "co1",
    name: "Ritika Agarwal",
    registrationNumber: "RA2411033010201",
    srmEmail: "ritika.agarwal@srmist.edu.in",
    personalEmail: "ritika.agarwal@example.com",
    phone: "9000012345",
    yearOfStudy: "2",
    section: "A",
    branch: "EEE",
    department: "Electrical and Electronics Engineering",
    domain: "corporate"
  },
  {
    id: "co2",
    name: "Siddharth Iyer",
    registrationNumber: "RA2411033010202",
    srmEmail: "siddharth.iyer@srmist.edu.in",
    personalEmail: "siddharth.iyer@example.com",
    phone: "9123456780",
    yearOfStudy: "1",
    section: "B",
    branch: "CSE",
    department: "Computer Science and Engineering",
    domain: "corporate"
  },
  {
    id: "co3",
    name: "Tanya Kapoor",
    registrationNumber: "RA2411033010203",
    srmEmail: "tanya.kapoor@srmist.edu.in",
    personalEmail: "tanya.kapoor@example.com",
    phone: "9345678901",
    yearOfStudy: "3",
    section: "C",
    branch: "IT",
    department: "Information Technology",
    domain: "corporate"
  }
]


