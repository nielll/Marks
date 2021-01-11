import { Course } from '../interface/course.interface';

export class Courses implements Course {
  constructor(
    public id: number,
    public course_id: number,
    public titel: string
  ) {}
}
