import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import {
  faPencilAlt,
  faEraser,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Meta } from 'src/app/shared/interface/mark.interface';
import { Semester, Module } from 'src/app/shared/interface/semester.interface';
import { Modules, Semesters } from '../../../shared/models/semester.model';

@Component({
  selector: 'app-module-modal',
  templateUrl: './module-modal.component.html',
  styleUrls: ['./module-modal.component.scss'],
})
export class ModuleModalComponent implements OnInit {
  pencilIcon: IconDefinition = faPencilAlt;
  eraseIcon: IconDefinition = faEraser;
  closeResult: string;
  modalOptions: NgbModalOptions;
  constructor(private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
  }

  @Input()
  subject: Module;

  @Input()
  semesters: Semester[];

  @Input()
  marks: Meta[];

  @Input()
  courseId: number;

  @Input()
  semesterId: number;

  @Output()
  removeModule: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  changeModule: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {}

  open(content) {
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getUpdateableSemester(): Semester {
    return this.semesters.find(
      (semester) =>
        semester.course_id == this.courseId &&
        semester.semester_id == this.semesterId
    );
  }

  getIndexModule(): number {
    return this.getUpdateableSemester().module.findIndex(
      (module) => module.module_id == this.subject.module_id
    );
  }

  getIndexMark(): number {
    return this.marks.findIndex(
      (mark) =>
        mark.course_id == this.courseId &&
        mark.semester_id == this.semesterId &&
        mark.module_id == this.subject.module_id
    );
  }

  getMarkId(): number {
    return (
      this.marks.find(
        (mark) =>
          mark.course_id == this.courseId &&
          mark.semester_id == this.semesterId &&
          mark.module_id == this.subject.module_id
      )?.id || null
    );
  }

  handleChangeModule(values: any) {
    const updatedModule = new Modules(
      this.subject.module_id,
      values.titelModule,
      values.beschreibungModule
    );

    let updateableSemester = this.getUpdateableSemester();
    updateableSemester.module.splice(this.getIndexModule(), 1, updatedModule);

    const semesterObj = {
      updateableSemester,
    };

    this.changeModule.emit(semesterObj);

    // Update local state
    this.getUpdateableSemester().module.splice(
      this.getIndexModule(),
      1,
      updatedModule
    );
  }

  handleRemoveModule() {
    let confirmDeletion = confirm('Willst du das Modul wirklich löschen?');
    if (!confirmDeletion) return;

    let updateableSemester = this.getUpdateableSemester();
    updateableSemester.module.splice(this.getIndexModule(), 1);

    const semesterObj = {
      indexMeta: this.getMarkId(),
      updateableSemester,
    };

    this.removeModule.emit(semesterObj);

    // Update local state
    this.marks.splice(this.getIndexMark(), 1);
  }
}
