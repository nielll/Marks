import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import {
  faPencilAlt,
  faEraser,
  faPlus,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Course } from 'src/app/shared/interface/course.interface';
import { Semester } from 'src/app/shared/interface/semester.interface';
import { Meta } from 'src/app/shared/interface/mark.interface';
import { Courses } from 'src/app/shared/models/course.model';

@Component({
  selector: 'app-course-modal',
  templateUrl: './course-modal.component.html',
  styleUrls: ['./course-modal.component.scss'],
})
export class CourseModalComponent implements OnInit, OnChanges {
  plusIcon: IconDefinition = faPlus;
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

  course: Course;

  @Input()
  courseId: number;

  @Input()
  courses: Course[];

  @Input()
  semesters: Semester[];

  @Input()
  marks: Meta[];

  @Output()
  addCourse: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  changeCourse: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  removeCourse: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.course = this.getActiveCourse();
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

  private getActiveCourse(): Course {
    return this.courses?.find((course) => course.course_id == this.courseId);
  }

  private createNewCourseId(): number {
    return this.courses.length > 0
      ? this.courses.reduce((prev, curr) => (prev.id < curr.id ? curr : prev))
          ?.id + 1 || 1
      : 1;
  }

  private getIndexOfCourse(courseObj: Course): number {
    return this.courses.findIndex(
      (course) => course.course_id == courseObj.course_id
    );
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

  handleAddCourse({ CourseTitelname }, isValid) {
    if (isValid) {
      this.addCourse.emit(
        new Courses(
          this.createNewCourseId(),
          this.createNewCourseId(),
          CourseTitelname
        )
      );
    }
  }

  handleChangeCourse({ courseTitel }, isValid) {
    if (isValid) {
      let updateableCourse = this.getActiveCourse();
      const index = this.getIndexOfCourse(updateableCourse);

      updateableCourse.titel = courseTitel;

      this.changeCourse.emit({ updateableCourse, index });
    }
  }

  handleRemoveCourse() {
    let confirmDeletion = confirm('Willst du das Semester wirklich löschen?');
    if (!confirmDeletion) return;

    const courseIndex = this.getActiveCourse()?.course_id;

    let removableSemesters = this.semesters.filter(
      (semester) => semester.course_id == courseIndex
    );

    let removableMarks = this.marks.filter(
      (marks) => marks.course_id == courseIndex
    );

    this.removeCourse.emit({ courseIndex, removableSemesters, removableMarks });
  }
}
