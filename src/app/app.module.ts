import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventFormComponent } from './event-form/event-form.component';
import { BoxPeriodsComponent } from './box-periods/box-periods.component';
import { BoxCategoriesComponent } from './box-categories/box-categories.component';
import { AllEventsComponent } from './all-events/all-events.component';

import { EventsByCategoryComponent } from './events-by-category/events-by-category.component';
import { EventsByYearComponent } from './events-by-year/events-by-year.component';
import { MessagesComponent } from './messages/messages.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';

import { ClickOutsideModule } from 'ng-click-outside';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { TopButtonsComponent } from './top-buttons/top-buttons.component';

// import {APP_BASE_HREF} from '@angular/common';

@NgModule({
  // providers: [{provide: APP_BASE_HREF, useValue: '/web/modules/custom/lc_timeline/assets/js/build/'}],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ClickOutsideModule,
    CarouselModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    EventsByCategoryComponent,
    EventsByYearComponent,
    BoxPeriodsComponent,
    BoxCategoriesComponent,
    EventFormComponent,
    AllEventsComponent,
    MessagesComponent,
    TopButtonsComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
