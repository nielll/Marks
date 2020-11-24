import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Mark } from '../../shared/interface/mark.interface';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.scss'],
})
export class MarksComponent implements OnInit, OnChanges {
  @Input()
  marks: Mark[];

  @Input()
  activeSubject: string;

  @Input()
  activeCourse: string;

  ngOnInit(): void {}

  ngOnChanges(changes) {}

  getSpecificMarks(): any[] {
    if (this.marks) {
      return this.marks
        .map(
          (marks) =>
            marks?.fach == this.activeSubject &&
            marks?.kurs == this.activeCourse &&
            marks
        )
        .filter((notFalse) => Boolean(notFalse) !== false);
    }
  }
}
