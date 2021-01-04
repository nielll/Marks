import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Meta } from '../../shared/interface/mark.interface';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.scss'],
})
export class MarksComponent implements OnChanges {
  constructor() {}

  @Input()
  marks: Meta[];

  @Input()
  filteredMarks: Meta[];

  @Input()
  activeModule: number;

  @Input()
  activeModuleName: string;

  @Input()
  activeCourse: number;

  @Input()
  activeCourseName: string;

  @Input()
  activeSemester: number;

  @Output()
  updateActiveModuleName: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  addMark: EventEmitter<Meta> = new EventEmitter<Meta>();

  @Output()
  changeMark: EventEmitter<Meta> = new EventEmitter<Meta>();

  @Output()
  removeMark: EventEmitter<Meta> = new EventEmitter<Meta>();

  @Output()
  addGroup: EventEmitter<Meta> = new EventEmitter<Meta>();

  @Output()
  removeGroup: EventEmitter<Meta> = new EventEmitter<Meta>();

  @Output()
  changeGroup: EventEmitter<Meta> = new EventEmitter<Meta>();

  ngOnChanges(changes) {}

  getActiveMark(): Meta[] {
    if (this.marks) {
      return this.marks
        .map(
          (marks) =>
            marks.module_id == this.activeModule &&
            marks.semester_id == this.activeSemester &&
            marks
        )
        .filter((marks) => marks);
    }
  }

  handleAddMark(metaObj: Meta) {
    this.addMark.emit(metaObj);
  }

  handleChangeMark(metaObj: Meta) {
    this.changeMark.emit(metaObj);
  }

  handleRemoveMark(metaObj: Meta) {
    this.removeMark.emit(metaObj);
  }
  handleAddGroup(metaObj: Meta) {
    this.addGroup.emit(metaObj);
  }

  handleChangeGroup(metaObj: Meta) {
    this.changeGroup.emit(metaObj);
  }

  handleRemoveGroup(metaObj: Meta) {
    this.removeGroup.emit(metaObj);
  }
}
