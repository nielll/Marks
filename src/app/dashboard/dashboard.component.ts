import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../shared/services/dashboard.service';
import { Course } from '../shared/interface/course.interface';
import { Semester, Module } from '../shared/interface/semester.interface';
import { Meta, Test, Mark } from '../shared/interface/mark.interface';
import { filter as _filter, find as _find } from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  title = 'Marks';
  course: Course[];
  semester: Semester[];
  filteredSemesters: Semester[];
  marks: Meta[];
  filteredMarks: Meta[];
  activeMeta: Meta;
  activeSemester: number;
  activeCourse: number;
  activeCourseName: string;
  activeModule: number;
  activeModuleName: string;

  constructor(private moduleService: DashboardService) {}

  ngOnInit(): void {
    this.moduleService.getCourse().subscribe((data: Course[]) => {
      this.course = data;
      // set for first render
      this.getFirstCourse(data);
      this.activeCourseName = this.getActiveCourseName();
    });

    this.moduleService.getSemester().subscribe((data: Semester[]) => {
      this.semester = data;

      // set for first render
      this.activeSemester = this.getFirstSemesterByCourseId();

      // set for first render
      this.activeModule = this.getFirstModuleByCourseId();

      // set moduleName for first render
      this.activeModuleName = this.getActiveModuleName();
    });

    this.moduleService.getMarks().subscribe((data: Meta[]) => {
      this.marks = data;

      // filtered arrays based on activeMarks
      this.filteredMarks = this.getAllMarksPerCourse();
    });
  }

  getActiveModuleName() {
    return this.getModulesFromActiveSemester().module.find(
      (module) => module.module_id == this.activeModule
    ).name;
  }

  getActiveCourseName() {
    return this.course.find((course) => course.course_id == this.activeCourse)
      .titel;
  }

  getModulesFromActiveSemester() {
    return this.semester.find(
      (semester) =>
        semester.course_id == this.activeCourse &&
        semester.semester_id == this.activeSemester
    );
  }

  getAllSemesterPerCourse(): Semester[] {
    return this.semester
      .map((semester) => semester.course_id == this.activeCourse && semester)
      .filter((semester) => semester);
  }

  getAllMarksPerCourse(): Meta[] {
    return this.marks
      .map((marks) => marks.course_id == this.activeCourse && marks)
      .filter((marks) => marks);
  }

  getFirstSemesterByCourseId(): number {
    return this.semester.find(
      (subject) => subject.course_id == this.activeCourse
    ).semester_id;
  }

  getFirstSemester(): number {
    return this.filteredSemesters[0].semester_id;
  }

  getFirstCourse(data: Course[]): number {
    return (this.activeCourse = data[0].course_id);
  }

  getFirstModuleByCourseId(): number {
    return this.semester.find(
      (subject) => subject.course_id == this.activeCourse
    ).module[0].module_id;
  }

  getFirstModule(): number {
    return this.filteredSemesters.find(
      (subject) => subject.course_id == this.activeCourse
    ).module[0].module_id;
  }

  getMetaId(markObj: any): number {
    return +this.marks.map(
      (meta) =>
        meta.course_id == markObj.course_id &&
        meta.module_id == markObj.module_id &&
        meta.semester_id == markObj.semester_id &&
        meta
    )[0].id;
  }

  getSpecificMeta(markObj: any): Meta {
    console.log(markObj);
    return this.marks.map(
      (meta) =>
        meta.course_id == markObj.course_id &&
        meta.semester_id == markObj.semester_id &&
        meta.module_id == markObj.module_id &&
        meta
    )[0];
  }

  getMarkId(markObj: any): number {
    let metaObj = this.getSpecificMeta(markObj);

    const groupObj = metaObj.test_daten
      .map((groups) => groups.group_id == markObj.group_id && groups)
      .filter((arr) => arr)[0];

    return groupObj.tests.findIndex(
      (tests) => +tests.test_id == +markObj.updateableMark.test_id
    );
  }

  createDeletableMeta(markObj: any): Meta {
    let metaObj = this.getSpecificMeta(markObj);
    const index = this.getMarkId(markObj);

    // Continue implement deleting -> just create a new meta object excluding the mark which has to be deleted
    if (index >= 0) {
      let test_daten = metaObj.test_daten
        .map((groups) => +groups.group_id == +markObj.group_id && groups)
        .filter((arr) => arr)[0]
        .tests.slice(index, 1);

      console.log(test_daten);

      return metaObj;
    } else {
      throw new Error('Object could not be updated with changed Mark');
    }
  }

  createUpdateableMeta(markObj: any): Meta {
    const metaObj = this.getSpecificMeta(markObj);
    const index = this.getMarkId(markObj);

    if (index >= 0) {
      metaObj.test_daten
        .map((groups) => +groups.group_id == +markObj.group_id && groups)
        .filter((arr) => arr)[0].tests[index] = markObj.updateableMark;

      return metaObj;
    } else {
      throw new Error('Object could not be updated with changed Mark');
    }
  }

  handleActiveSemester(activeSemester: number) {
    this.activeSemester = activeSemester;
  }

  handleActiveCourse(activeCourse: number) {
    // update active Course globally, first step
    this.activeCourse = activeCourse;
    // filter Semester[] with active Course
    this.filteredSemesters = this.getAllSemesterPerCourse();
    // filter Meta[] with active Course
    this.filteredMarks = this.getAllMarksPerCourse();
    // Update active
    this.activeCourseName = this.getActiveCourseName();
    this.activeSemester = this.getFirstSemester();
    this.activeModule = this.getFirstModule();
    this.activeModuleName = this.getActiveModuleName();
  }

  handleActiveModule(activeModule: number) {
    this.activeModule = activeModule;
    this.activeModuleName = this.getActiveModuleName();
  }

  setMetaById() {
    this.moduleService
      .getMarkById(this.activeCourse, this.activeSemester, this.activeModule)
      .subscribe((data) => {
        this.activeMeta = data;
      });
  }

  deleteMark(markObj: any) {
    try {
      this.moduleService
        .deleteMark(this.createDeletableMeta(markObj), this.getMetaId(markObj))
        .subscribe((e) =>
          console.log('Mark has been updated successfully!', e)
        );
    } catch (e: any) {
      console.error('Error has been occurred during deleting process', e);
    }
  }

  updateMark(markObj: any) {
    try {
      this.moduleService
        .updateMark(this.createUpdateableMeta(markObj), this.getMetaId(markObj))
        .subscribe((e) =>
          console.log('Mark has been updated successfully!', e)
        );
    } catch (e: any) {
      console.error('Error has been occurred during update process', e);
    }
  }
}
