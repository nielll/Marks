import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// containers
import { DashboardComponent } from './dashboard.component';

// components
import { MarksComponent } from './marks/marks.component';
import { OverviewComponent } from './overview/overview.component';
import { MarkModalComponent } from './modal/mark-modal/mark-modal.component';

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
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
  ],
  exports: [DashboardComponent],
  providers: [DashboardService], //service
})
export class DashboardModule {}
