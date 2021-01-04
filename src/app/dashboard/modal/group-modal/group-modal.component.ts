import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import {
  faPencilAlt,
  faEraser,
  IconDefinition,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Meta, Mark, Test } from '../../../shared/interface/mark.interface';
import { Metas, Tests, Marks } from '../../../shared/models/mark.model';

@Component({
  selector: 'app-group-modal',
  templateUrl: './group-modal.component.html',
  styleUrls: ['./group-modal.component.scss'],
})
export class GroupModalComponent implements OnInit {
  pencilIcon: IconDefinition = faPencilAlt;
  eraseIcon: IconDefinition = faEraser;
  plusIcon: IconDefinition = faPlus;
  closeResult: string;
  modalOptions: NgbModalOptions;
  constructor(private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
  }

  @Input()
  marks: Meta[];

  @Input()
  subject: Test;

  @Input()
  groupId: number;

  @Input()
  activeCourse: number;

  @Input()
  activeSemester: number;

  @Input()
  activeModule: number;

  @Output()
  addMark: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  removeGroup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  changeGroup: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {}

  ngOnChanges(changes) {}

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

  getActiveMeta(): Meta {
    return this.marks.find(
      (meta) =>
        meta.course_id == this.activeCourse &&
        meta.semester_id == this.activeSemester &&
        meta.module_id == this.activeModule
    );
  }

  createNewMarkId(group_id: number): number {
    const activeMeta = this.getActiveMeta();
    const tests = activeMeta.test_daten.find(
      (group) => group.group_id == group_id
    ).tests;

    return tests.length > 0
      ? tests.reduce((prev, curr) =>
          prev.test_id < curr.test_id ? curr : prev
        ).test_id + 1
      : 1;
  }

  handleAddMark(
    values: any,
    isValid,
    course_id: number,
    semester_id: number,
    module_id: number,
    group_id: number
  ) {
    if (isValid) {
      // create Array from input
      if (!values.arbeitspartner) {
        values.arbeitspartner = [];
      } else if (!Array.isArray(values.arbeitspartner)) {
        values.arbeitspartner = String(values.arbeitspartner)
          .split(/[\s]{0,}[,][\s]{0,}/)
          .filter((partner) => partner.length > 0);
      } else {
        values.arbeitspartner = values.arbeitspartner.filter(
          (partner) => partner.length > 0
        );
      }

      const {
        titel,
        arbeitspartner,
        erreichte_punkte,
        max_punkte,
        min_punkte_bestanden,
      } = values;

      const markObj = {
        course_id,
        semester_id,
        module_id,
        group_id,
        updateableMark: new Marks(
          this.createNewMarkId(this.groupId),
          titel,
          arbeitspartner,
          erreichte_punkte,
          max_punkte,
          min_punkte_bestanden
        ),
      };

      this.addMark.emit(markObj);
    }
  }

  handleRemoveGroup(groupId: number) {
    let confirmDeletion = confirm('Willst du die Gruppierung löschen?');
    if (!confirmDeletion) return;

    const groupObj = {
      course_id: this.activeCourse,
      semester_id: this.activeSemester,
      module_id: this.activeModule,
      group_id: groupId,
    };

    this.removeGroup.emit(groupObj);
  }

  handleSubmitGroupChange(values: any) {
    const activeMeta = this.marks.find(
      (meta) =>
        meta.course_id == this.activeCourse &&
        meta.semester_id == this.activeSemester &&
        meta.module_id == this.activeModule
    );

    const tests = activeMeta.test_daten.find(
      (group) => group.group_id == this.groupId
    ).tests;

    const updateableGroup = new Tests(values.group_id, values.test_art, tests);

    const groupObj = {
      course_id: this.activeCourse,
      semester_id: this.activeSemester,
      module_id: this.activeModule,
      group_id: values.group_id,
      updateableGroup,
    };

    this.changeGroup.emit(groupObj);
  }
}
