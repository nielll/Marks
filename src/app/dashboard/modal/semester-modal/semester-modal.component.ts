import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import {
  faPencilAlt,
  faEraser,
  faPlus,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Semester } from 'src/app/shared/interface/semester.interface';
import { Meta } from '../../../shared/interface/mark.interface';
import { Modules } from '../../../shared/models/semester.model';
import { Metas } from 'src/app/shared/models/mark.model';

@Component({
  selector: 'app-semester-modal',
  templateUrl: './semester-modal.component.html',
  styleUrls: ['./semester-modal.component.scss'],
})
export class SemesterModalComponent implements OnInit {
  plusIcon: IconDefinition = faPlus;
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
  semesters: Semester[];

  @Input()
  marks: Meta[];

  @Input()
  semester: Semester;

  @Input()
  activeCourse: number;

  @Input()
  activeSemester: number;

  @Input()
  courseId: number;

  @Input()
  semesterId: number;

  @Input()
  semesterName: string;

  @Output()
  changeSemesterName: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  changeSemester: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  removeSemester: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  addModule: EventEmitter<any> = new EventEmitter<any>();

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

  createNewMarkId(): number {
    return this.marks.length > 0
      ? this.marks.reduce((prev, curr) => (prev.id < curr.id ? curr : prev))
          .id + 1
      : 1;
  }

  getIndexOfSemester(semesterObj: Semester): number {
    return this.semesters.findIndex(
      (semester) =>
        semester.course_id == semesterObj.course_id &&
        semester.semester_id == semesterObj.semester_id &&
        semester.id == semesterObj.id
    );
  }

  getUpdatedMarksArray(): Meta[] {
    return this.marks.filter(
      (marks) =>
        marks.course_id != this.courseId || marks.semester_id != this.semesterId
    );
  }

  getNewModuleId(): number {
    return this.semesters.find(
      (semester) =>
        semester.course_id == this.courseId &&
        semester.semester_id == this.semesterId
    ).module.length > 0
      ? this.semesters
          .find(
            (semester) =>
              semester.course_id == this.courseId &&
              semester.semester_id == this.semesterId
          )
          .module.reduce((prev, curr) =>
            prev.module_id < curr.module_id ? curr : prev
          ).module_id + 1
      : 1;
  }

  getUpdateableSemester(): Semester {
    return this.semesters.find(
      (semester) =>
        semester.course_id == this.courseId &&
        semester.semester_id == this.semesterId
    );
  }

  handleAddModule(values: any) {
    const newModuleId = this.getNewModuleId();
    let updateableSemester = this.getUpdateableSemester();
    let updateableMeta = new Metas(
      this.courseId,
      this.semesterId,
      newModuleId,
      [],
      this.createNewMarkId()
    );

    updateableSemester.module.push(
      new Modules(newModuleId, values.titelModule, values.beschreibungModule)
    );

    const semesterObj = {
      updateableSemester,
      updateableMeta,
    };

    // create meta from new module and update state
    this.marks.push(updateableMeta);

    this.addModule.emit(semesterObj);
  }

  handleChangeSemester(values: any) {
    this.changeSemesterName.emit(values.bezeichnung);

    let updateableSemester = this.getUpdateableSemester();

    updateableSemester.name = values.bezeichnung;

    // send informations to update api upwards
    this.changeSemester.emit(updateableSemester);
  }

  handleRemoveSemester() {
    let confirmDeletion = confirm('Willst du das Semester wirklich löschen?');
    if (!confirmDeletion) return;

    this.changeSemesterName.emit(null);

    const semester = this.getUpdateableSemester();

    const semesterObj = {
      index: this.getIndexOfSemester(this.getUpdateableSemester()),
      updateableMeta: this.marks.filter(
        (meta) =>
          meta.course_id != semester.course_id ||
          meta.semester_id != semester.semester_id
      ),
      updateableSemester: semester,
    };
    this.removeSemester.emit(semesterObj);
  }
}
