import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

import { Course } from '../interface/course.interface';
import { Semester } from '../interface/semester.interface';
import { Meta } from '../interface/mark.interface';

const MODULES_API: string = environment.API_URL;

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {}

  getCourse(): Observable<Course[]> {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get<Course[]>(`${MODULES_API}/kurse`, { headers });
  }

  getSemester(): Observable<Semester[]> {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get<Semester[]>(`${MODULES_API}/semester`, { headers });
  }

  getMarks(): Observable<Meta[]> {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get<Meta[]>(`${MODULES_API}/noten`, { headers });
  }

  getMarkById(course_id: number, semester_id: number, module_id: number) {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get<Meta>(
      `${MODULES_API}/noten?course_id=${course_id}&semester_id=${semester_id}&module_id=${module_id}`,
      { headers }
    );
  }

  addCourse(course: Course): Observable<Course> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.post<Course>(`${MODULES_API}/kurse/`, course, {
      headers,
    });
  }

  updateCourse(course: Course, index: number): Observable<Course> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.put<Course>(`${MODULES_API}/kurse/${index}`, course, {
      headers,
    });
  }

  removeCourse(index: number): Observable<Course> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.delete<Course>(`${MODULES_API}/kurse/${index}`, {
      headers,
    });
  }

  addSemester(semesterObj: Semester): Observable<Semester> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.post<Semester>(`${MODULES_API}/semester`, semesterObj, {
      headers,
    });
  }

  updateSemester(semesterObj: Semester, index: number): Observable<Semester> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.put<Semester>(
      `${MODULES_API}/semester/${index}`,
      semesterObj,
      {
        headers,
      }
    );
  }

  removeSemester(index: number): Observable<Semester> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.delete<Semester>(`${MODULES_API}/semester/${index}`, {
      headers,
    });
  }

  addMeta(meta: Meta): Observable<Meta> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.post<Meta>(`${MODULES_API}/noten/`, meta, {
      headers,
    });
  }

  updateMark(metaObj: Meta, index: number): Observable<Meta> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.put<Meta>(`${MODULES_API}/noten/${index}`, metaObj, {
      headers,
    });
  }

  removeMark(index: number): Observable<Meta> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.delete<Meta>(`${MODULES_API}/noten/${index}`, {
      headers,
    });
  }
}
