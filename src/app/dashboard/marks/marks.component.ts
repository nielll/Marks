import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Meta, Test, Mark } from '../../shared/interface/mark.interface';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.scss'],
})
export class MarksComponent implements OnInit, OnChanges {
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
  updateMark: EventEmitter<Mark> = new EventEmitter<Mark>();

  @Output()
  setMetaById: EventEmitter<Meta> = new EventEmitter<Meta>();

  ngOnInit(): void {}

  ngOnChanges(changes) {}

  getActiveMark(): Meta[] {
    if (this.filteredMarks) {
      return this.filteredMarks
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

  handleUpdateMark(mark: Mark) {
    this.updateMark.emit(mark);
  }
}
