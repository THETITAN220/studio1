export interface Material {
  id: string;
  title: string;
  type: 'Question Paper' | 'Notes' | 'Syllabus';
  subject: string;
  semester: number;
  year: number;
  description: string;
  fileUrl: string; // a dummy url for now
}
