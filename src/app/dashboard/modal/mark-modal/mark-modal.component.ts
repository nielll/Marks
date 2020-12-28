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
import { Metas, Tests, Marks } from '../../../shared/models/mark.model';

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
  tests: Mark;

  @Input()
  course_id: number;

  @Input()
  module_id: number;

  @Input()
  semester_id: number;

  @Input()
  group_id: number;

  @Output()
  handleUpdateMark: EventEmitter<any> = new EventEmitter<Mark>();

  @Output()
  handleMetaById: EventEmitter<Meta> = new EventEmitter<Meta>();

  @Output()
  getMarkById: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit(): void {}

  ngOnChanges(changes) {
    if (changes) {
      this.tests = changes.tests.currentValue;
    }
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  handleSubmitUpdateMark(
    values: any,
    isValid: boolean,
    course_id: number,
    semester_id: number,
    module_id: number,
    group_id: number
  ) {
    if (isValid) {
      // create Array from input
      if (values.arbeitspartner.length == 0) {
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

      const markObj = {
        course_id,
        semester_id,
        module_id,
        group_id,
        updateableMark: new Marks(values),
      };

      this.handleUpdateMark.emit(markObj);
    }
  }
}
