import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  faPencilAlt,
  faEraser,
  IconDefinition,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Semester } from '../../../shared/interface/semester.interface';
import { Semesters } from '../../../shared/models/semester.model';

@Component({
  selector: 'app-addsemester-modal',
  templateUrl: './addSemester-modal.component.html',
  styleUrls: ['./addSemester-modal.component.scss'],
})
export class AddSemesterModalComponent implements OnInit {
  pencilIcon: IconDefinition = faPencilAlt;
  eraseIcon: IconDefinition = faEraser;
  plusIcon: IconDefinition = faPlus;

  @Input()
  semesters: Semester[];

  @Input()
  activeCourse: number;

  @Input()
  name: string;

  @Output()
  handleAddGroup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  addSemester: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {}

  ngOnChanges(changes) {
    if (changes.name) {
      this.name = changes.name.currentValue;
    }
  }

  private createNewSemesterId(): number {
    return this.semesters.length > 0
      ? this.semesters.reduce((prev, curr) => (prev.id < curr.id ? curr : prev))
          .id + 1
      : 1;
  }

  handleAddSemester() {
    const newSemester = new Semesters(
      this.createNewSemesterId(),
      this.createNewSemesterId(),
      this.activeCourse,
      this.name ? this.name : 'Semester',
      []
    );

    this.semesters.push(newSemester);

    this.addSemester.emit(newSemester);
  }
}
