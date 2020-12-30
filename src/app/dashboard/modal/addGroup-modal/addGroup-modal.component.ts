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
import { Meta, Test, Mark } from '../../../shared/interface/mark.interface';
import { Metas, Tests, Marks } from '../../../shared/models/mark.model';

@Component({
  selector: 'app-addgroup-modal',
  templateUrl: './addGroup-modal.component.html',
  styleUrls: ['./addGroup-modal.component.scss'],
})
export class AddGroupModalComponent implements OnInit {
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
  activeCourse: number;

  @Input()
  activeSemester: number;

  @Input()
  activeModule: number;

  @Output()
  handleAddGroup: EventEmitter<any> = new EventEmitter<any>();

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

  createNewGroupId(): number {
    console.log(
      this.activeCourse,
      this.activeSemester,
      this.activeModule,
      this.marks
    );
    return this.getActiveMeta() && this.getActiveMeta().test_daten.length > 0
      ? this.getActiveMeta().test_daten.reduce((prev, curr) =>
          prev.group_id < curr.group_id ? curr : prev
        ).group_id + 1
      : 1;
  }

  handleSubmit(values: any) {
    const updateableGroup = new Tests(
      this.createNewGroupId(),
      values.test_art,
      []
    );

    const groupObj = {
      course_id: this.activeCourse,
      semester_id: this.activeSemester,
      module_id: this.activeModule,
      updateableGroup,
    };

    this.handleAddGroup.emit(groupObj);
  }
}
