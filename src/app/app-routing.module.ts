import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

import { EventsByCategoryComponent } from './events-by-category/events-by-category.component';
import { EventsByYearComponent } from './events-by-year/events-by-year.component';
import { EventFormComponent } from './event-form/event-form.component';
import { AllEventsComponent } from './all-events/all-events.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },


  { path: 'all-events', component: AllEventsComponent },
  { path: 'years/', component: EventsByYearComponent },
  { path: 'years/add_event', component: EventsByYearComponent, data :{ show_add_event: true } },
  { path: 'years/:year_url_alias', component: EventsByYearComponent },  
  { path: 'years/:year_url_alias/add_event', component: EventsByYearComponent, data :{ show_add_event: true }},  
  { path: 'categories/', component: EventsByCategoryComponent },
  { path: 'categories/add_event', component: EventsByCategoryComponent, data :{ show_add_event: true } },
  { path: 'categories/:category_url_alias', component: EventsByCategoryComponent },
  { path: 'categories/:category_url_alias/add_event', component: EventsByCategoryComponent, data :{ show_add_event: true } },
  { path: 'categories/:category_url_alias/periods/:period_url_alias', component: EventsByCategoryComponent, pathMatch: 'full' },
  { path: 'categories/:category_url_alias/periods/:period_url_alias/add_event', component: EventsByCategoryComponent, pathMatch: 'full', data :{ show_add_event: true } },

];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {
    useHash: true, 
    onSameUrlNavigation: 'reload', 
    urlUpdateStrategy: 'eager'
  }) ],
  exports: [ RouterModule ]
})


export class AppRoutingModule {}
