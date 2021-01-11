import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../shared/services/dashboard.service';
import { Course } from '../shared/interface/course.interface';
import { Semester } from '../shared/interface/semester.interface';
import { Meta } from '../shared/interface/mark.interface';
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

  private getActiveModuleName() {
    return (
      this.getModulesFromActiveSemester()?.module?.find(
        (module) => module.module_id == this.activeModule
      )?.name || null
    );
  }

  private getActiveCourseName() {
    return this.course.find((course) => course.course_id == this.activeCourse)
      .titel;
  }

  private getModulesFromActiveSemester() {
    return this.semesters.find(
      (semester) =>
        semester.course_id == this.activeCourse &&
        semester.semester_id == this.activeSemester
    );
  }

  private getAllSemesterPerCourse(): Semester[] {
    return this.semesters
      .map((semester) => semester.course_id == this.activeCourse && semester)
      .filter((semester) => semester);
  }

  private getAllMarksPerCourse(): Meta[] {
    return this.marks
      .map((marks) => marks.course_id == this.activeCourse && marks)
      .filter((marks) => marks);
  }

  private getFirstSemesterByCourseId(): number {
    return (
      this.semesters?.find((subject) => subject.course_id == this.activeCourse)
        ?.semester_id || null
    );
  }

  private getFirstSemester(): number {
    return this.filteredSemesters?.[0]?.semester_id || null;
  }

  private getFirstCourse(data: Course[]): number {
    return (this.activeCourse = data[0].course_id);
  }

  private getFirstModuleByCourseId(): any {
    return (
      this.semesters.find((subject) => subject.course_id == this.activeCourse)
        ?.module?.[0]?.module_id || null
    );
  }

  private getFirstModule(): number {
    return (
      this.filteredSemesters.find(
        (subject) => subject.course_id == this.activeCourse
      )?.module?.[0]?.module_id || null
    );
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

  // API calls emitted from subcomponents
  addMark(metaObj: Meta) {
    try {
      this.moduleService
        .updateMark(metaObj, metaObj.id)
        .subscribe((e) =>
          this.toastr.success('Mark has been added successfully!')
        );
    } catch (e: any) {
      this.toastr.error('Error has been detected during adding process');
      throw new Error(e);
    }
  }

  changeMark(metaObj: Meta) {
    try {
      this.moduleService
        .updateMark(metaObj, metaObj.id)
        .subscribe((e) =>
          this.toastr.success('Mark has been updated successfully!')
        );
    } catch (e: any) {
      this.toastr.error('Error has been detected during update process');
      throw new Error(e);
    }
  }

  removeMark(metaObj: Meta) {
    try {
      this.moduleService
        .updateMark(metaObj, metaObj.id)
        .subscribe((e) =>
          this.toastr.success('Mark has been updated successfully!')
        );
    } catch (e: any) {
      this.toastr.error('Error has been detected during deleting process');
      throw new Error(e);
    }
  }

  addGroup(metaObj: Meta) {
    if (this.activeModule) {
      try {
        this.moduleService
          .updateMark(metaObj, metaObj.id)
          .subscribe((e) =>
            this.toastr.success('Group has been added successfully!')
          );
      } catch (e: any) {
        this.toastr.error(
          'Error has been detected during group adding process'
        );
        throw new Error(e);
      }
    } else {
      this.toastr.error('Create or select Module infront');
    }
  }

  changeGroup(metaObj: Meta) {
    try {
      this.moduleService
        .updateMark(metaObj, metaObj.id)
        .subscribe((e) =>
          this.toastr.success('Group has been updated successfully!')
        );
    } catch (e: any) {
      this.toastr.error(
        'Error has been detected during group updating process'
      );
      throw new Error(e);
    }
  }

  removeGroup(metaObj: Meta) {
    try {
      this.moduleService
        .updateMark(metaObj, metaObj.id)
        .subscribe((e) =>
          this.toastr.success('Group has been removed successfully!')
        );
    } catch (e: any) {
      this.toastr.error(
        'Error has been detected during group removing process'
      );
      throw new Error(e);
    }
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

  removeSemester({ updateableSemester, updateableMeta, index }) {
    // Set active to null if same id as the deleted semester
    if (
      updateableSemester.course_id == this.activeCourse &&
      updateableSemester.semester_id == this.activeSemester
    ) {
      this.activeSemester = null;
      this.activeModule = null;
    }

    // Implement: remove Meta of Modules from deletable semester
    const updateableMark = this.marks.filter(
      (marks) =>
        marks.course_id == updateableSemester.course_id &&
        marks.semester_id == updateableSemester.semester_id
    );

    // Update local data
    this.marks = updateableMeta;
    this.semesters.splice(index, 1);

    // Update api data, remove all marks related to modules in semester which is going to be deleted
    let promises = [];

    promises.push(
      new Promise((resolve, reject) => {
        this.moduleService
          .removeSemester(updateableSemester.id)
          .subscribe((e) => resolve(e));
      })
    );

    // delete all the meta's related to the semester => add promises to array
    for (let i = 0; i < updateableMark.length; i++) {
      promises.push(
        new Promise((resolve, reject) => {
          this.moduleService
            .removeMark(updateableMark[i].id)
            .subscribe((e) => resolve(e));
        })
      );
    }

    Promise.all(promises)
      .then((values) => {
        this.toastr.success('Semester has been removed successfully!');
      })
      .catch((e) => {
        this.toastr.error(
          'Error has been detected during semester removing process'
        );
        throw new Error(e);
      });
  }

  addModule({ updateableSemester, updateableMeta }) {
    const updateSemester = new Promise((resolve, reject) =>
      this.moduleService
        .updateSemester(updateableSemester, updateableSemester.id)
        .subscribe((e) => resolve(e))
    );

    const updateMeta = new Promise((resolve, reject) =>
      this.moduleService.addMeta(updateableMeta).subscribe((e) => resolve(e))
    );

    Promise.all([updateSemester, updateMeta])
      .then(() => this.toastr.success('Module has been added successfully!'))
      .catch((e) => {
        this.toastr.error(
          'Error has been detected during module adding process'
        );
        throw new Error(e);
      });
  }

  changeModule({ updateableSemester }) {
    try {
      this.moduleService
        .updateSemester(updateableSemester, updateableSemester.id)
        .subscribe((e) =>
          this.toastr.success('Module has been changed successfully!')
        );
    } catch (e: any) {
      this.toastr.error(
        'Error has been detected during module changing process'
      );
      throw new Error(e);
    }
  }

  removeModule({ updateableSemester, indexMeta }) {
    const updateSemester = new Promise((resolve, reject) =>
      this.moduleService
        .updateSemester(updateableSemester, updateableSemester.id)
        .subscribe((e) => resolve(e))
    );

    const updateMeta = new Promise((resolve, reject) =>
      indexMeta
        ? this.moduleService
            .removeMark(indexMeta)
            .subscribe(() => resolve('Meta deleted'))
        : resolve('Nothing to delete')
    );

    Promise.all([updateSemester, updateMeta])
      .then((e) => this.toastr.success('Module has been removed successfully!'))
      .catch((e) => {
        this.toastr.error(
          'Error has been detected during module removing process'
        );
        throw new Error(e);
      });

    // set active to null
    this.activeSemester = null;
    this.activeModule = null;
  }
}
