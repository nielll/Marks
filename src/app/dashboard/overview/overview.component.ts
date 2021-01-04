import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Course } from '../../shared/interface/course.interface';
import { Semester } from '../../shared/interface/semester.interface';
import { Meta } from '../../shared/interface/mark.interface';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnChanges {
  constructor() {}

  semesterName: string;

  @Input()
  courses: Course[];

  @Input()
  marks: Meta[];

  @Input()
  semesters: Semester[];

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

  @Output()
  addSemester: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  changingSemester: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  removeSemester: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  addModule: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  changingModule: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  removeModule: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {}

  ngOnChanges(changes) {
    if (changes.semesters && changes.semesters.currentValue) {
      this.semesterName = changes.semesters.currentValue.name;
    }
  }

  changeSemesterName(semesterName: string) {
    this.semesterName = semesterName;
  }

  getActiveSemester(): Semester[] {
    if (this.semesters) {
      return this.semesters.filter(
        (semester) => semester.course_id == this.activeCourse
      );
    }
  }

  handleModuleOnClick(subject: number, semester: number) {
    this.changeSemester.emit(semester);
    this.changeModule.emit(subject);
  }

  handleCourseChange(course_name: string) {
    var course_id = this.courses.find((course) => course.titel == course_name)
      .course_id;
    this.changeCourse.emit(course_id);
  }

  handleAddSemester(semesterObj: any) {
    this.addSemester.emit(semesterObj);
  }

  handleChangeSemester(semesterObj: any) {
    this.changingSemester.emit(semesterObj);
  }

  handleRemoveSemester(semesterObj: any) {
    this.removeSemester.emit(semesterObj);
  }

  handleAddModule(moduleObj: any) {
    this.addModule.emit(moduleObj);
  }

  handleChangeModule(moduleObj: any) {
    this.changingModule.emit(moduleObj);
  }

  handleRemoveModule(moduleObj: any) {
    this.removeModule.emit(moduleObj);
  }
}
