import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { faPencilAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Meta, Mark } from '../../../shared/interface/mark.interface';
import { Metas, Tests, Marks } from '../../../shared/models/mark.model';

@Component({
  selector: 'app-mark-modal',
  templateUrl: './mark-modal.component.html',
  styleUrls: ['./mark-modal.component.scss'],
})
export class MarkModalComponent implements OnInit {
  pencilIcon: IconDefinition = faPencilAlt;
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

  updateMark(
    mark: Mark,
    course_id: number,
    semester_id: number,
    module_id: number,
    group_id: number
  ) {
    const markObj = {
      course_id,
      semester_id,
      module_id,
      group_id,
      updateableMark: new Marks(mark),
    };
    this.handleUpdateMark.emit(markObj);
  }
}
