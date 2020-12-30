import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../shared/services/dashboard.service';
import { Course } from '../shared/interface/course.interface';
import { Semester, Module } from '../shared/interface/semester.interface';
import { Meta, Test, Mark } from '../shared/interface/mark.interface';
import { Metas, Tests, Marks } from '../shared/models/mark.model';
import { filter as _filter, find as _find } from 'lodash';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private moduleService: DashboardService,
    private toastr: ToastrService
  ) {}

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

  async getSpecificMeta(markObj: any): Promise<Meta> {
    // Check if a meta exists for a module, if not create one
    if (
      this.marks.find(
        (meta) =>
          meta.course_id == markObj.course_id &&
          meta.semester_id == markObj.semester_id &&
          meta.module_id == markObj.module_id
      )
    ) {
      return this.marks.find(
        (meta) =>
          meta.course_id == markObj.course_id &&
          meta.semester_id == markObj.semester_id &&
          meta.module_id == markObj.module_id
      );
    } else {
      const newMeta = new Metas(
        this.activeCourse,
        this.activeSemester,
        this.activeModule,
        [],
        this.createNewMarkId()
      );
      // not neccessary?
      //this.marks.push(newMeta);
      await this.addMeta(newMeta);

      return newMeta;
    }
  }

  getMarkId(metaObj: Meta, markObj: any): number {
    return metaObj.test_daten
      .find((groups) => groups.group_id == markObj.group_id)
      .tests.findIndex(
        (tests) => +tests.test_id == +markObj.updateableMark.test_id
      );
  }

  createNewSemesterId(): number {
    return this.semester.length > 0
      ? this.semester.reduce((prev, curr) => (prev.id < curr.id ? curr : prev))
          .id + 1
      : 1;
  }

  createNewMarkId(): number {
    return this.marks.length > 0
      ? this.marks.reduce((prev, curr) => (prev.id < curr.id ? curr : prev))
          .id + 1
      : 1;
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

  /**
   * create an updated meta object in order to push to server
   * Update, add, remove a Mark Object
   *
   * Set param adding to true when adding, false to removing
   * @param markObj any
   * @param action add, remove, update
   */
  createUpdateableMeta(metaObj: Meta, markObj: any, action: string): Meta {
    if (action == 'add') {
      metaObj.test_daten
        .find((groups) => +groups.group_id == +markObj.group_id)
        .tests.push(markObj.updateableMark);
    } else if (action == 'update') {
      let index = this.getMarkId(metaObj, markObj);

      metaObj.test_daten.find(
        (groups) => +groups.group_id == +markObj.group_id
      ).tests[index] = markObj.updateableMark;
    } else if (action == 'remove') {
      let index = this.getMarkId(metaObj, markObj);

      metaObj.test_daten
        .find((groups) => +groups.group_id == +markObj.group_id)
        .tests.splice(index, 1);
    } else {
      throw new Error("Falscher 'action' param!");
    }

    return metaObj;
  }

  /**
   * create an updated meta object in order to push to server
   * Update, add, remove a Test/Group Object
   *
   * Set param adding to true when adding, false to removing
   * @param groupObj any
   * @param action add, remove, update
   */
  createUpdateableGroup(metaObj: Meta, groupObj: any, action: string): Meta {
    if (action == 'add') {
      metaObj.test_daten.push(groupObj.updateableGroup);
    } else if (action == 'remove') {
      let index = metaObj.test_daten.findIndex(
        (group) => group.group_id == groupObj.group_id
      );

      metaObj.test_daten.splice(index, 1);
    } else if (action == 'update') {
      let index = metaObj.test_daten.findIndex(
        (group) => group.group_id == groupObj.group_id
      );

      metaObj.test_daten.splice(index, 1, groupObj.updateableGroup);
    } else {
      throw new Error("Falscher 'action' param!");
    }

    return metaObj;
  }

  async addMeta(meta: Meta) {
    try {
      this.moduleService
        .addMeta(meta)
        .subscribe((e) => console.log('Meta added', e));

      try {
        // update local data with changed data from backend
        this.moduleService.getMarks().subscribe((data: Meta[]) => {
          this.marks = data;

          // filtered arrays based on activeMarks
          this.filteredMarks = this.getAllMarksPerCourse();
        });
      } catch (e: any) {
        throw new Error(e);
      }
    } catch (e: any) {
      this.toastr.error('Error has been detected');
      throw new Error(e);
    }
  }

  addMark(markObj: any) {
    this.getSpecificMeta(markObj).then((metaObj) => {
      try {
        this.moduleService
          .updateMark(
            this.createUpdateableMeta(metaObj, markObj, 'add'),
            metaObj.id
          )
          .subscribe((e) =>
            this.toastr.success('Mark has been added successfully!')
          );
      } catch (e: any) {
        this.toastr.error('Error has been detected during adding process');
        throw new Error(e);
      }
    });
  }

  deleteMark(markObj: any) {
    this.getSpecificMeta(markObj).then((metaObj) => {
      try {
        this.moduleService
          .updateMark(
            this.createUpdateableMeta(metaObj, markObj, 'remove'),
            metaObj.id
          )
          .subscribe((e) =>
            this.toastr.success('Mark has been updated successfully!')
          );
      } catch (e: any) {
        this.toastr.error('Error has been detected during deleting process');
        throw new Error(e);
      }
    });
  }

  updateMark(markObj: any) {
    this.getSpecificMeta(markObj).then((metaObj) => {
      try {
        this.moduleService
          .updateMark(
            this.createUpdateableMeta(metaObj, markObj, 'update'),
            metaObj.id
          )
          .subscribe((e) =>
            this.toastr.success('Mark has been updated successfully!')
          );
      } catch (e: any) {
        this.toastr.error('Error has been detected during update process');
        throw new Error(e);
      }
    });
  }

  addGroup(groupObj: any) {
    this.getSpecificMeta(groupObj).then((metaObj) => {
      try {
        this.moduleService
          .updateMark(
            this.createUpdateableGroup(metaObj, groupObj, 'add'),
            metaObj.id
          )
          .subscribe((e) =>
            this.toastr.success('Group has been added successfully!')
          );
      } catch (e: any) {
        this.toastr.error(
          'Error has been detected during group adding process'
        );
        throw new Error(e);
      }
    });
  }

  deleteGroup(groupObj: any) {
    this.getSpecificMeta(groupObj).then((metaObj) => {
      try {
        this.moduleService
          .updateMark(
            this.createUpdateableGroup(metaObj, groupObj, 'remove'),
            metaObj.id
          )
          .subscribe((e) =>
            this.toastr.success('Group has been removed successfully!')
          );
      } catch (e: any) {
        this.toastr.error(
          'Error has been detected during group removing process'
        );
        throw new Error(e);
      }
    });
  }

  changeGroup(groupObj: any) {
    this.getSpecificMeta(groupObj).then((metaObj) => {
      try {
        this.moduleService
          .updateMark(
            this.createUpdateableGroup(metaObj, groupObj, 'update'),
            metaObj.id
          )
          .subscribe((e) =>
            this.toastr.success('Group has been updated successfully!')
          );
      } catch (e: any) {
        this.toastr.error(
          'Error has been detected during group updating process'
        );
        throw new Error(e);
      }
    });
  }
}
