import { Test, Mark } from '../interface/mark.interface';

export class Metas {
  constructor(
    public mark_id: number,
    public course_id: number,
    public module_id: number,
    public test_daten: Test[]
  ) {}
}

export class Tests {
  constructor(
    public group_id: number,
    public test_art: string,
    public tests: Mark[]
  ) {}
}

export class Marks {
  public test_id: number;
  public titel: string;
  public arbeitspartner: string[];
  public erreichte_punkte: string;
  public max_punkte: string;
  public min_punkte_bestanden: string;

  constructor(obj: Mark) {
    this.test_id = obj.test_id;
    this.titel = obj.titel;
    this.arbeitspartner = obj.arbeitspartner;
    this.erreichte_punkte = obj.erreichte_punkte;
    this.max_punkte = obj.max_punkte;
    this.min_punkte_bestanden = obj.min_punkte_bestanden;
  }
}
