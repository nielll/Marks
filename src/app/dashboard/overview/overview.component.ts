import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Course } from '../../shared/interface/course.interface';
import { Module } from '../../shared/interface/module.interface';

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
  modules: Module[];

  @Input()
  title: string;

  @Input()
  activeCourse: string;

  @Input()
  activeSubject: string;

  @Output()
  changeCourse: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  changeSubject: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {}

  ngOnChanges(changes) {}

  getMarksOnSubjectChange(): Module[] {
    //recursion
    //this.modules.find((module) => module['module']);
    return this.modules;
  }

  handleSubjectOnClick(subject: string) {
    this.changeSubject.emit(subject);
  }

  handleCourseChange(course: string) {
    this.changeCourse.emit(course);
  }

  getActiveModules(): Module[] {
    if (this.modules) {
      return this.modules
        .map((module) => module.kurs == this.activeCourse && module)
        .filter((noFalse) => Boolean(noFalse) !== false);
    }
  }
}
