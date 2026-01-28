import { Subject } from "@/types";

export const DEPARTMENTS = [
  "Mathematics",
  "Science",
  "History",
  "Language Arts",
];

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
}));

export const subjects = [
  "Mathematics",
  "Science",
  "History",
  "Language Arts",
];

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    description:
      "An introductory course on computer science principles and programming.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: "MATH201",
    name: "Calculus I",
    department: "Mathematics",
    description:
      "A study of limits, derivatives, and integrals of functions.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    code: "PHYS101",
    name: "General Physics",
    department: "Physics",
    description:
      "An overview of classical mechanics and thermodynamics.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    code: "ENG202",
    name: "English Literature",
    department: "English",
    description:
      "A survey of major works in English literature from various periods.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    code: "BIO101",
    name: "Introduction to Biology",
    department: "Biology",
    description:
      "An exploration of the fundamental concepts of biology, including cell structure and function.",
    createdAt: new Date().toISOString(),
  },
];