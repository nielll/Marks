import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

import { Course } from '../interface/course.interface';
import { Module } from '../interface/module.interface';
import { Mark } from '../interface/mark.interface';

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

  getModules(): Observable<Module[]> {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get<Module[]>(`${MODULES_API}/semester`, { headers });
  }

  getMarks(): Observable<Mark[]> {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get<Mark[]>(`${MODULES_API}/noten`, { headers });
  }
}
