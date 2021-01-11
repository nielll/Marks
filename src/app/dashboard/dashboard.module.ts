import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// containers
import { DashboardComponent } from './dashboard.component';

// components
import { MarksComponent } from './marks/marks.component';
import { OverviewComponent } from './overview/overview.component';
import { MarkModalComponent } from './modal/mark-modal/mark-modal.component';
import { GroupModalComponent } from './modal/group-modal/group-modal.component';
import { AddGroupModalComponent } from './modal/addGroup-modal/addGroup-modal.component';
import { SemesterModalComponent } from './modal/semester-modal/semester-modal.component';
import { AddSemesterModalComponent } from './modal/addSemester-modal/addSemester-modal.component';
import { ModuleModalComponent } from './modal/module-modal/module-modal.component';
import { CourseModalComponent } from './modal/course-modal/course-modal.component';

// module
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// service
import { DashboardService } from '../shared/services/dashboard.service';

@NgModule({
  declarations: [
    DashboardComponent,
    OverviewComponent,
    MarksComponent,
    MarkModalComponent,
    GroupModalComponent,
    AddGroupModalComponent,
    SemesterModalComponent,
    AddSemesterModalComponent,
    ModuleModalComponent,
    CourseModalComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  exports: [DashboardComponent],
  providers: [DashboardService], //service
})
export class DashboardModule {}
