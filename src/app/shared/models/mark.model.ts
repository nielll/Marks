import { Meta, Test, Mark } from '../interface/mark.interface';

export class Metas implements Meta {
  constructor(
    public course_id: number,
    public semester_id: number,
    public module_id: number,
    public test_daten: Test[],
    public id?: number
  ) {}
}

export class Tests implements Test {
  constructor(
    public group_id: number,
    public test_art: string,
    public tests: Mark[]
  ) {}
}

export class Marks implements Mark {
  constructor(
    public test_id: number,
    public titel: string,
    public arbeitspartner: string[],
    public erreichte_punkte: string,
    public max_punkte: string,
    public min_punkte_bestanden: string
  ) {}
}
