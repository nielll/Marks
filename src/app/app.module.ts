import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// components
import { AppComponent } from './app.component';

// modules
import { DashboardModule } from './dashboard/dashboard.module';
import { HeaderComponent } from './common/header/header.component';
import { NavComponent } from './common/nav/nav.component';
import { FooterComponent } from './common/footer/footer.component';

@NgModule({
  declarations: [AppComponent, NavComponent, HeaderComponent, FooterComponent],
  imports: [BrowserModule, DashboardModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
