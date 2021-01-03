import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { Meta, Test, Mark } from '../../shared/interface/mark.interface';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.scss'],
})
export class MarksComponent implements OnChanges {
  constructor(private ref: ChangeDetectorRef) {}

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
  addMark: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  changeMark: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  removeMark: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  addGroup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  removeGroup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  changeGroup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  setMetaById: EventEmitter<Meta> = new EventEmitter<Meta>();

  ngOnChanges(changes) {}

  getActiveMark(): Meta[] {
    if (this.marks) {
      return this.marks
        .map(
          (marks) =>
            +marks.module_id == this.activeModule &&
            +marks.semester_id == this.activeSemester &&
            marks
        )
        .filter((marks) => marks);
    }
  }

  handleGetMetaById(meta: Meta) {
    this.setMetaById.emit(meta);
  }

  handleAddMark(markObj: any) {
    this.addMark.emit(markObj);
  }

  handleChangeMark(markObj: any) {
    this.changeMark.emit(markObj);
  }

  handleRemoveMark(markObj: any) {
    this.removeMark.emit(markObj);
  }
  handleAddGroup(groupObj: any) {
    this.addGroup.emit(groupObj);
  }

  handleChangeGroup(groupObj: any) {
    this.changeGroup.emit(groupObj);
  }

  handleRemoveGroup(groupObj: any) {
    this.removeGroup.emit(groupObj);
  }
}
