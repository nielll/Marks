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
  updateMark: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  deleteMark: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  addGroup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  deleteGroup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  changeGroup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  setMetaById: EventEmitter<Meta> = new EventEmitter<Meta>();

  ngOnChanges(changes) {
    if (changes.marks) {
      if (this.marks != changes.marks.currentValue)
        console.log(changes.marks.currentValue);
    }
  }

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

  handleDeleteMark(markObj: any) {
    this.deleteMark.emit(markObj);
  }

  handleAddMark(markObj: any) {
    this.addMark.emit(markObj);
  }

  handleUpdateMark(markObj: any) {
    this.updateMark.emit(markObj);
  }

  handleAddGroup(groupObj: any) {
    this.addGroup.emit(groupObj);
  }

  handleDeleteGroup(groupObj: any) {
    this.deleteGroup.emit(groupObj);
  }

  handleUpdateGroup(groupObj: any) {
    this.changeGroup.emit(groupObj);
  }
}
