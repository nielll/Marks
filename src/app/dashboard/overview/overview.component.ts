import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Course } from '../../shared/interface/course.interface';
import { Semester, Module } from '../../shared/interface/semester.interface';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnChanges {
  constructor() {}

  @Input()
  courses: Course[];

  @Input()
  semester: Semester[];

  @Input()
  title: string;

  @Input()
  activeCourse: number;

  @Input()
  activeSemester: number;

  @Input()
  activeModule: number;

  @Output()
  changeCourse: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  changeSemester: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  changeModule: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit(): void {}

  ngOnChanges(changes) {}

  handleModuleOnClick(subject: number, semester: number) {
    // console.log('subject' + subject, 'semester' + semester);
    this.changeSemester.emit(semester);
    this.changeModule.emit(subject);
  }

  handleCourseChange(course_name: string) {
    var course_id = this.courses.find((course) => course.titel == course_name)
      .course_id;
    this.changeCourse.emit(course_id);
  }

  getActiveModules(): Semester[] {
    if (this.semester) {
      return this.semester
        .map((module) => module.course_id == this.activeCourse && module)
        .filter((noFalse) => Boolean(noFalse) !== false);
    }
  }
}
