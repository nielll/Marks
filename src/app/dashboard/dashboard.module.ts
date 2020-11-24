import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// containers
import { DashboardComponent } from './dashboard.component';

// components
import { MarksComponent } from './marks/marks.component';
import { OverviewComponent } from './overview/overview.component';

// service
import { DashboardService } from '../shared/services/dashboard.service';

//import { PassengerDashboardService } from './passenger-dashboard.service';

@NgModule({
  declarations: [DashboardComponent, OverviewComponent, MarksComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [DashboardComponent],
  providers: [DashboardService], //service
})
export class DashboardModule {}
