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
import { Meta, Test } from '../../../shared/interface/mark.interface';
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private getActiveMeta(): Meta {
    return this.marks.find(
      (meta) =>
        meta.course_id == this.activeCourse &&
        meta.semester_id == this.activeSemester &&
        meta.module_id == this.activeModule
    );
  }

  private createNewMetaId(): number {
    return this.marks.length > 0
      ? this.marks.reduce((prev, curr) => (prev.id < curr.id ? curr : prev))
          .id + 1
      : 1;
  }

  private createNewMarkId(group_id: number): number {
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

  private getSpecificMeta(): Meta {
    // return meta if exists for a module, if not create one
    return (
      this.marks.find(
        (meta) =>
          meta.course_id == this.activeCourse &&
          meta.semester_id == this.activeSemester &&
          meta.module_id == this.activeModule
      ) ||
      new Metas(
        this.activeCourse,
        this.activeSemester,
        this.activeModule,
        [],
        this.createNewMetaId()
      )
    );
  }

  private getTestIndex(meta: Meta): number {
    return meta.test_daten.findIndex((group) => group.group_id == this.groupId);
  }

  private getGroupIndex(meta: Meta): number {
    return meta.test_daten.findIndex((group) => group.group_id == this.groupId);
  }

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

  handleAddMark(
    {
      titel,
      arbeitspartner,
      erreichte_punkte,
      max_punkte,
      min_punkte_bestanden,
    },
    isValid
  ) {
    if (isValid) {
      // create Array from Team input
      if (!arbeitspartner) {
        arbeitspartner = [];
      } else if (!Array.isArray(arbeitspartner)) {
        arbeitspartner = String(arbeitspartner)
          .split(/[\s]{0,}[,][\s]{0,}/)
          .filter((partner) => partner.length > 0);
      } else {
        arbeitspartner = arbeitspartner.filter((partner) => partner.length > 0);
      }

      //create Mark with input values
      const newMark = new Marks(
        this.createNewMarkId(this.groupId),
        titel,
        arbeitspartner,
        erreichte_punkte,
        max_punkte,
        min_punkte_bestanden
      );

      // update local data
      const updateableMeta = this.getSpecificMeta();
      updateableMeta.test_daten
        .find((groups) => groups.group_id == this.groupId)
        .tests.push(newMark);

      this.addMark.emit(updateableMeta);
    }
  }

  handleRemoveGroup() {
    let confirmDeletion = confirm('Willst du die Gruppierung löschen?');
    if (!confirmDeletion) return;

    let updateableMeta = this.getSpecificMeta();
    updateableMeta.test_daten.splice(this.getTestIndex(updateableMeta), 1);

    this.removeGroup.emit(updateableMeta);
  }

  handleChangeGroup({ test_art }, isValid: boolean) {
    if (isValid) {
      let updateableMeta = this.getSpecificMeta();

      const marks = updateableMeta.test_daten.find(
        (group) => group.group_id == this.groupId
      ).tests;

      updateableMeta.test_daten.splice(
        this.getGroupIndex(updateableMeta),
        1,
        new Tests(this.groupId, test_art, marks)
      );

      this.changeGroup.emit(updateableMeta);
    }
  }
}
