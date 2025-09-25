export interface Extracurricular {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  sheetUrl: string;
  borderColor: string;
  icon: string; // SVG path for the icon
}

export interface RegistrationDetails {
  fullName: string;
  nisn: string;
  studentClass: string;
  address: string;
  extracurricular: Extracurricular | null;
  registrationDate: string;
}
