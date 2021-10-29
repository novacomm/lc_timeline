import { Component, OnInit, HostBinding } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { TimelineEvent } from '../timeline-event';
import { Period } from '../period';
import { Category } from '../category';

import { TimelineEventService } from '../timeline-event.service';
import { PeriodService } from '../period.service';
import { CategoryService } from '../category.service';
import { HelperService } from "../helper.service";

import { AdditionalLabelsService } from '../additional-labels.service';

import { Faq } from '../faq';
import { FaqService } from '../faq.service';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
})
export class DashboardComponent implements OnInit {
  faqs: Faq[] = [];
  events: TimelineEvent[] = [];
  periods: Period[] = [];
  categories: Category[] = [];
  tab_focus: Number = 0;
  expand_faq: String = "";
  expand_bubble: String = "";

  timeline_homepage_body: String = "";


  window: any;
  

  constructor(
    public additionalLabelsService: AdditionalLabelsService, 
    private eventService: TimelineEventService, 
    private categoryService: CategoryService,
    private periodService: PeriodService,
    public helperService: HelperService,
    private faqService: FaqService,
    @Inject(DOCUMENT) private document: Document,
    ) { 
    this.window = this.document.defaultView;
  }

  ngOnInit() {
    this.getPeriods();
    this.getCategories();
    this.getFaqs();
    if (
      typeof this.window.drupalSettings !== 'undefined' &&
      typeof this.window.drupalSettings.lc_timeline !== 'undefined' &&
      typeof this.window.drupalSettings.lc_timeline.body !== 'undefined'
      ) {
      this.timeline_homepage_body = this.window.drupalSettings.lc_timeline.body;
    }
      
  }

  getFaqs(): void {
    this.faqService.getFaqs()
      .subscribe((faqs: Faq[]) => {
        this.faqs = faqs;
      });
  }

  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);
  }  
  getPeriods(): void {
    this.periodService.getPeriods()
      .subscribe(periods => {

        function compare_start_dates( a, b ) {
          let a_date = new Date(a.date);
          let b_date = new Date(b.date);
          if ( a_date < b_date ){
            return -1;
          }
          if ( a_date > b_date ){
            return 1;
          }
          return 0;
        }

        periods.sort( compare_start_dates );
        // console.log(periods)
        this.periods = periods;
      });
  }

  showTab(tab_pos): void {
    this.tab_focus = tab_pos;
  }
  


}
