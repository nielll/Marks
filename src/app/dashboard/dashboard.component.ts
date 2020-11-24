import { Component, OnChanges, OnInit } from '@angular/core';
import { DashboardService } from '../shared/services/dashboard.service';
import { Course } from '../shared/interface/course.interface';
import { Module } from '../shared/interface/module.interface';
import { Mark } from '../shared/interface/mark.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnChanges {
  title = 'Marks';
  course: Course[];
  modules: Module[];
  marks: Mark[];
  activeCourse: string;
  activeSubject: string;

  constructor(private moduleService: DashboardService) {}

  ngOnInit(): void {
    this.moduleService.getCourse().subscribe((data: Course[]) => {
      this.course = data;
      // set for first render
      this.getFirstCourse(data);
    });

    this.moduleService.getModules().subscribe((data: Module[]) => {
      this.modules = data;

      // set for first render
      this.getFirstSubject(data);
    });

    this.moduleService.getMarks().subscribe((data: Mark[]) => {
      this.marks = data;
    });
  }

  ngOnChanges(changes) {
    if (changes) {
      console.log(changes);
    }
  }

  getFirstCourse(data: Course[]): string {
    return (this.activeCourse = data[0].titel);
  }

  getFirstSubject(data: Module[]): string {
    return (this.activeSubject = data.find(
      (subject) => subject['kurs'] == this.activeCourse
    )['module'][0].name);
  }

  handleActiveCourse(activeCourse: string) {
    this.activeCourse = activeCourse;
    this.getFirstSubject(this.modules);
  }
  handleActiveSubject(activeSubject: string) {
    this.activeSubject = activeSubject;
  }
}
