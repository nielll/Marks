export interface Semester {
  id: number;
  semester_id: number;
  course_id: number;
  module: Module[];
}

export interface Module {
  module_id: number;
  name: string;
  beschreibung: string;
}
