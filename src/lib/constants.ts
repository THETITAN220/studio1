import type { Material } from './types';

export const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

export const subjects = [
  "Data Structures",
  "Algorithms",
  "Operating Systems",
  "Database Management",
  "Computer Networks",
  "Software Engineering"
];

export const materials: Material[] = [
  {
    id: "ds-qp-2023",
    title: "DS Question Paper 2023",
    type: "Question Paper",
    subject: "Data Structures",
    semester: 3,
    year: 2023,
    description: "Final term question paper for Data Structures.",
    fileUrl: "/path/to/dummy.pdf"
  },
  {
    id: "algo-notes-unit1",
    title: "Algorithms Unit 1 Notes",
    type: "Notes",
    subject: "Algorithms",
    semester: 4,
    year: 2024,
    description: "Comprehensive notes for the first unit of Algorithms.",
    fileUrl: "/path/to/dummy.pdf"
  },
  {
    id: "os-syllabus",
    title: "Operating Systems Syllabus",
    type: "Syllabus",
    subject: "Operating Systems",
    semester: 5,
    year: 2024,
    description: "Official syllabus for the OS course.",
    fileUrl: "/path/to/dummy.pdf"
  },
  {
    id: "dbms-qp-2022",
    title: "DBMS Question Paper 2022",
    type: "Question Paper",
    subject: "Database Management",
    semester: 5,
    year: 2022,
    description: "Mid-term question paper for DBMS.",
    fileUrl: "/path/to/dummy.pdf"
  },
  {
    id: "cn-notes-full",
    title: "Computer Networks Full Notes",
    type: "Notes",
    subject: "Computer Networks",
    semester: 6,
    year: 2023,
    description: "Complete handwritten notes for all units of CN.",
    fileUrl: "/path/to/dummy.pdf"
  },
  {
    id: "se-qp-2023-internals",
    title: "SE Internals Paper 2023",
    type: "Question Paper",
    subject: "Software Engineering",
    semester: 6,
    year: 2023,
    description: "Internal assessment question paper.",
    fileUrl: "/path/to/dummy.pdf"
  },
    {
    id: "ds-notes-unit2",
    title: "DS Unit 2 Notes",
    type: "Notes",
    subject: "Data Structures",
    semester: 3,
    year: 2024,
    description: "Detailed notes on Trees and Graphs.",
    fileUrl: "/path/to/dummy.pdf"
  },
  {
    id: "algo-qp-2023",
    title: "Algorithms QP 2023",
    type: "Question Paper",
    subject: "Algorithms",
    semester: 4,
    year: 2023,
    description: "Final exam paper for Algorithms course.",
    fileUrl: "/path/to/dummy.pdf"
  }
];
