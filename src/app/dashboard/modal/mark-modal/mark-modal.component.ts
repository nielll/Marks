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
} from '@fortawesome/free-solid-svg-icons';
import { Meta, Mark } from '../../../shared/interface/mark.interface';
import { Metas, Marks } from '../../../shared/models/mark.model';

@Component({
  selector: 'app-mark-modal',
  templateUrl: './mark-modal.component.html',
  styleUrls: ['./mark-modal.component.scss'],
})
export class MarkModalComponent implements OnInit {
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
  marks: Meta[];

  @Input()
  tests: Mark;

  @Input()
  activeCourse: number;

  @Input()
  activeSemester: number;

  @Input()
  activeModule: number;

  @Input()
  groupId: number;

  @Output()
  changeMark: EventEmitter<any> = new EventEmitter<Mark>();

  @Output()
  removeMark: EventEmitter<any> = new EventEmitter<Mark>();

  @Output()
  handleMetaById: EventEmitter<Meta> = new EventEmitter<Meta>();

  ngOnInit(): void {}

  ngOnChanges(changes) {
    if (changes) {
      this.tests = changes.tests.currentValue;
    }
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

  private createNewMetaId(): number {
    return this.marks.length > 0
      ? this.marks.reduce((prev, curr) => (prev.id < curr.id ? curr : prev))
          .id + 1
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

  private getMarkIndex(metaObj: Meta, markObj: Mark): number {
    return metaObj.test_daten
      .find((groups) => groups.group_id == this.groupId)
      .tests.findIndex((tests) => tests.test_id == markObj.test_id);
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

  handleRemoveMark(mark: Mark) {
    let confirmDeletion = confirm('Willst du die Note wirklich löschen?');
    if (!confirmDeletion) return;

    let updateableMeta = this.getSpecificMeta();

    updateableMeta.test_daten
      .find((groups) => groups.group_id == this.groupId)
      .tests.splice(this.getMarkIndex(updateableMeta, mark), 1);

    this.removeMark.emit(updateableMeta);
  }

  handleChangeMark(
    {
      test_id,
      titel,
      arbeitspartner,
      erreichte_punkte,
      max_punkte,
      min_punkte_bestanden,
    },
    isValid: boolean
  ) {
    if (isValid) {
      // create Array from input
      if (arbeitspartner.length == 0) {
        arbeitspartner = [];
      } else if (!Array.isArray(arbeitspartner)) {
        arbeitspartner = String(arbeitspartner)
          .split(/[\s]{0,}[,][\s]{0,}/)
          .filter((partner) => partner.length > 0);
      } else {
        arbeitspartner = arbeitspartner.filter((partner) => partner.length > 0);
      }

      let updateableMeta = this.getSpecificMeta();

      const newMark = new Marks(
        test_id,
        titel,
        arbeitspartner,
        erreichte_punkte,
        max_punkte,
        min_punkte_bestanden
      );

      updateableMeta.test_daten
        .find((groups) => groups.group_id == this.groupId)
        .tests.splice(this.getMarkIndex(updateableMeta, newMark), 1, newMark);

      this.changeMark.emit(updateableMeta);
    }
  }
}
