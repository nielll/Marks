import { Semester, Module } from '../interface/semester.interface';

export class Semesters implements Semester {
  constructor(
    public id: number,
    public semester_id: number,
    public course_id: number,
    public name: string,
    public module: Module[]
  ) {}
}

export class Modules implements Module {
  constructor(
    public module_id: number,
    public name: string,
    public beschreibung: string
  ) {}
}
