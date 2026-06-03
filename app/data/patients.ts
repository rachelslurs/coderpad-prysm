// data/patients.ts — Mock patient data
// DO NOT MODIFY THIS FILE

export type Patient = {
    id: number;
    name: string;
    room: string;
    age: number;
    physician: string;
    status: "Stable" | "Needs Attention" | "Critical";
    diagnosis: string;
    admittedOn: string;
    insurance: string;
  };
  
  export const PATIENTS: Patient[] = [
    {
      id: 1,
      name: "Margaret Holloway",
      room: "101A",
      age: 82,
      physician: "Dr. Sandra Patel",
      status: "Stable",
      diagnosis: "Hip fracture post-op",
      admittedOn: "2024-03-12",
      insurance: "Medicare Part A",
    },
    {
      id: 2,
      name: "Robert Simmons",
      room: "102B",
      age: 76,
      physician: "Dr. James Wu",
      status: "Needs Attention",
      diagnosis: "CHF exacerbation",
      admittedOn: "2024-03-18",
      insurance: "Medicaid",
    },
    {
      id: 3,
      name: "Dolores Fuentes",
      room: "103A",
      age: 91,
      physician: "Dr. Sandra Patel",
      status: "Stable",
      diagnosis: "Stroke recovery",
      admittedOn: "2024-02-28",
      insurance: "Medicare Advantage",
    },
    {
      id: 4,
      name: "Harold Kim",
      room: "104C",
      age: 68,
      physician: "Dr. Aisha Brooks",
      status: "Critical",
      diagnosis: "Sepsis",
      admittedOn: "2024-03-20",
      insurance: "Medicare Part A",
    },
    {
      id: 5,
      name: "Evelyn Marsh",
      room: "105A",
      age: 79,
      physician: "Dr. James Wu",
      status: "Stable",
      diagnosis: "COPD management",
      admittedOn: "2024-03-05",
      insurance: "Private",
    },
    {
      id: 6,
      name: "Thomas Nguyen",
      room: "106B",
      age: 84,
      physician: "Dr. Aisha Brooks",
      status: "Needs Attention",
      diagnosis: "Wound care / pressure ulcer",
      admittedOn: "2024-03-15",
      insurance: "Medicaid",
    },
    {
      id: 7,
      name: "Gloria Washington",
      room: "107A",
      age: 73,
      physician: "Dr. Sandra Patel",
      status: "Stable",
      diagnosis: "Diabetes management",
      admittedOn: "2024-03-01",
      insurance: "Medicare Part A",
    },
    {
      id: 8,
      name: "Frank Deluca",
      room: "108D",
      age: 88,
      physician: "Dr. James Wu",
      status: "Critical",
      diagnosis: "Pneumonia",
      admittedOn: "2024-03-22",
      insurance: "Medicare Advantage",
    },
  ];