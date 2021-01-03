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
  semesters: Semester[];
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
      this.semesters = data;

      // set for first render
      this.activeSemester = this.getFirstSemesterByCourseId();

      // set for first render
      this.activeModule =
        this.getFirstModuleByCourseId() != null
          ? this.getFirstModuleByCourseId()
          : null;

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
    return this.getModulesFromActiveSemester()
      ? this.getModulesFromActiveSemester().module
        ? this.getModulesFromActiveSemester().module.find(
            (module) => module.module_id == this.activeModule
          )
          ? this.getModulesFromActiveSemester().module.find(
              (module) => module.module_id == this.activeModule
            ).name
          : null
        : null
      : null;
  }

  getActiveCourseName() {
    return this.course.find((course) => course.course_id == this.activeCourse)
      .titel;
  }

  getModulesFromActiveSemester() {
    return this.semesters.find(
      (semester) =>
        semester.course_id == this.activeCourse &&
        semester.semester_id == this.activeSemester
    );
  }

  getAllSemesterPerCourse(): Semester[] {
    return this.semesters
      .map((semester) => semester.course_id == this.activeCourse && semester)
      .filter((semester) => semester);
  }

  getAllMarksPerCourse(): Meta[] {
    return this.marks
      .map((marks) => marks.course_id == this.activeCourse && marks)
      .filter((marks) => marks);
  }

  getFirstSemesterByCourseId(): number {
    return this.semesters.find(
      (subject) => subject.course_id == this.activeCourse
    )
      ? this.semesters.find((subject) => subject.course_id == this.activeCourse)
          .semester_id
      : null;
  }

  getFirstSemester(): number {
    return this.filteredSemesters
      ? this.filteredSemesters[0]
        ? this.filteredSemesters[0].semester_id
        : null
      : null;
  }

  getFirstCourse(data: Course[]): number {
    return (this.activeCourse = data[0].course_id);
  }

  getFirstModuleByCourseId(): any {
    return this.semesters.find(
      (subject) => subject.course_id == this.activeCourse
    )
      ? this.semesters.find((subject) => subject.course_id == this.activeCourse)
          .module
        ? this.semesters.find(
            (subject) => subject.course_id == this.activeCourse
          ).module[0]
          ? this.semesters.find(
              (subject) => subject.course_id == this.activeCourse
            ).module[0].module_id
          : null
        : null
      : null;
  }

  getFirstModule(): number {
    return this.filteredSemesters.find(
      (subject) => subject.course_id == this.activeCourse
    )
      ? this.filteredSemesters.find(
          (subject) => subject.course_id == this.activeCourse
        ).module[0]
        ? this.filteredSemesters.find(
            (subject) => subject.course_id == this.activeCourse
          ).module[0].module_id
        : null
      : null;
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

  getSemesterIndex(semesterObj: Semester): number {
    console.log(semesterObj);
    return this.semesters.findIndex(
      (semester) =>
        semester.course_id == semesterObj.course_id &&
        semester.semester_id == semesterObj.semester_id
    );
  }

  createNewSemesterId(): number {
    return this.semesters.length > 0
      ? this.semesters.reduce((prev, curr) => (prev.id < curr.id ? curr : prev))
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

  removeMark(markObj: any) {
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

  changeMark(markObj: any) {
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
    if (this.activeModule) {
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
    } else {
      this.toastr.error('Create or select Module infront');
    }
  }

  removeGroup(groupObj: any) {
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

  addSemester(semesterObj: Semester) {
    try {
      this.moduleService
        .addSemester(semesterObj)
        .subscribe((e) =>
          this.toastr.success('Semester has been added successfully!')
        );
    } catch (e: any) {
      this.toastr.error(
        'Error has been detected during semester adding process'
      );
      throw new Error(e);
    }
  }

  changeSemester(semesterObj: Semester) {
    console.log(semesterObj);
    try {
      this.moduleService
        .updateSemester(semesterObj, semesterObj.id)
        .subscribe((e) =>
          this.toastr.success('Semester has been updated successfully!')
        );
    } catch (e: any) {
      this.toastr.error(
        'Error has been detected during semester creating process'
      );
      throw new Error(e);
    }
  }

  removeSemester(semesterObj: any) {
    console.log(semesterObj);

    // Set active to null if same id as the deleted semester
    if (
      semesterObj.updateableSemester.course_id == this.activeCourse &&
      semesterObj.updateableSemester.semester_id == this.activeSemester
    ) {
      this.activeSemester = null;
      this.activeModule = null;
    }

    // Implement: Update marks according when delete semester
    const updateableMark = this.marks.filter(
      (marks) =>
        marks.course_id == semesterObj.updateableSemester.course_id &&
        marks.semester_id == semesterObj.updateableSemester.semester_id
    );

    // Update local data
    this.marks = semesterObj.updateableMeta;
    this.semesters.splice(semesterObj.index, 1);

    try {
      // Update api data, remove all marks related to modules in semester which is going to be deleted
      let promises = [];

      promises.push(
        new Promise((resolve, reject) => {
          this.moduleService
            .removeSemester(semesterObj.updateableSemester.id)
            .subscribe(
              (e) => resolve(e)
              //this.toastr.success('Semester has been removed successfully!')
            );
        })
      );

      for (let i = 0; i < updateableMark.length; i++) {
        promises.push(
          new Promise((resolve, reject) => {
            this.moduleService.removeMark(updateableMark[i].id).subscribe(
              (e) => resolve(e)
              //this.toastr.success('Semester has been removed successfully!')
            );
          })
        );
      }

      Promise.all(promises).then((values) => {
        console.log(values, updateableMark);
        this.toastr.success('Semester has been removed successfully!');
      });
    } catch (e: any) {
      this.toastr.error(
        'Error has been detected during semester removing process'
      );
      throw new Error(e);
    }
  }

  addModule(semesterObj: any) {
    console.log(semesterObj);
    try {
      this.moduleService
        .updateSemester(semesterObj, semesterObj.id)
        .subscribe((e) =>
          this.toastr.success('Module has been added successfully!')
        );
    } catch (e: any) {
      this.toastr.error('Error has been detected during module adding process');
      throw new Error(e);
    }
  }

  changeModule(moduleObj: any) {
    console.log(moduleObj);
  }

  removeModule(moduleObj: any) {
    console.log(moduleObj);
  }
}
