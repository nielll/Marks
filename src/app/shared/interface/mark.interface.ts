export interface Meta {
  id?: number;
  semester_id: number;
  course_id: number;
  module_id: number;
  test_daten: Test[];
}

export interface Test {
  group_id: number;
  test_art: string;
  tests: Mark[];
}

export interface Mark {
  test_id: number;
  titel: string;
  arbeitspartner: string[];
  erreichte_punkte: string;
  max_punkte: string;
  min_punkte_bestanden: string;
}
