import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TimelineEvent } from '../timeline-event';
import { Period } from '../period';
import { Category } from '../category';

import { TimelineEventService } from '../timeline-event.service';
import { PeriodService } from '../period.service';
import { CategoryService } from '../category.service';
import { MessageService } from '../message.service';
import { HelperService } from "../helper.service";
import { AdditionalLabelsService } from '../additional-labels.service';

import { Self, SkipSelf } from '@angular/core';
import { BROWSER_STORAGE, ThemeService } from '../theme.service';

import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-events',
  templateUrl: './events-by-category.component.html',
  styleUrls: ['./events-by-category.component.scss'],
  providers: [
    ThemeService,
    { provide: BROWSER_STORAGE, useFactory: () => sessionStorage }
  ],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class EventsByCategoryComponent implements OnInit {
  // event: Event;
  periods: Period[] = [];
  categories: Category[] = [];
  timeline_events: TimelineEvent[] = [];
  period: Period;
  category: Category;
  category_url_alias: String;
  period_url_alias: String;

  expand_bubble: String = "";
  category_position: String = "";
  period_position: String = "";
  
  page_structure: String = "";
  
  @ViewChild('owlElement') owlElement;
  customOptions: OwlOptions = {
      loop: false,
      items: 2,
      dots: false,
      slideBy: 10,
      responsive: {
          0: {
              items: 3,
              slideBy: 3,
          },
          375: {
              items: 4,
              slideBy: 4,
          },
          768: {
              items: 7,
              slideBy: 7,
          },
          992: {
              items: 10,
          }
      },
    }


  constructor(
    public additionalLabelsService: AdditionalLabelsService, 
    private timelineEventService:TimelineEventService,
    private categoryService: CategoryService,
    private periodService: PeriodService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private messageService: MessageService,
    public helperService: HelperService,
    @Self() private sessionThemeService: ThemeService,
    @SkipSelf() private localThemeService: ThemeService,
  ) {
    this.route.params.subscribe( params => {
      this.category_url_alias = this.route.snapshot.paramMap.get('category_url_alias');
      this.period_url_alias = this.route.snapshot.paramMap.get('period_url_alias');
      this.category_url_alias = params.category_url_alias;
      
      this.getCategories();
      if (this.category_url_alias === undefined) {
        this.getPeriod(this.period_url_alias);
      } else {
        this.getCategory(this.category_url_alias);
      }
    });
    
  }


  ngOnInit() {
    
    this.getPeriods();
    
  }

  twitterUrl(): string {
    let prefix = "https://twitter.com/intent/tweet?url=";
    let sufix = "&amp;text=EU%20Timeline%20Overview%20%7C%20Learning%20Corner";
    let current_url = encodeURIComponent(window.location.href);
    return prefix + current_url + sufix;
  }
  facebookUrl(): string {
    let prefix = "http://www.facebook.com/share.php?u=";
    let sufix = "&amp;t=EU%20Timeline%20Overview%20%7C%20Learning%20Corner";
    let current_url = encodeURIComponent(window.location.href);
    return prefix + current_url + sufix;
  }
  linkedinUrl(): string {
    let prefix = "http://www.linkedin.com/shareArticle?mini=true&amp;url=";
    let sufix = "&amp;title=EU%20Timeline%20Overview%20%7C%20Learning%20Corner&amp;ro=false&amp;summary=&amp;source=";
    let current_url = encodeURIComponent(window.location.href);
    return prefix + current_url + sufix;
  }

  getCategory(category_url_alias): void {
    this.categoryService.getCategoryByURLAlias(category_url_alias)
      .subscribe(category => {
        this.category = category;
        this.getPeriod(this.period_url_alias);
        let index = this.categories.map(function(A) {return A["id"];}).indexOf(this.category.id);
        this.category_position = (index+1).toString();
      });
  }
  getPeriod(period_url_alias): void {
    this.periodService.getPeriodByURLAlias(period_url_alias)
      .subscribe(period => {
        this.period = period;
        this.getEvents();
        let index = this.periods.map(function(A) {return A["id"];}).indexOf(this.period.id);
        this.period_position = (index+1).toString();
      });
  }

  getEvents(): void {
    var _category_id = this.category ? this.category.id : null;
    var _period_id = this.period ? this.period.id : null;
    this.timelineEventService.getEvents(this.category ? this.category.id : null, this.period ? this.period.id : null)
    .subscribe(events => {
      this.timeline_events = events;
      
      // Add user manually added events.
      let period_match = false;
      let category_found = false;
      let manual_events_str = this.sessionThemeService.get('manual_events');
      if (manual_events_str) {
        let manual_events = JSON.parse(manual_events_str);
        for (var i = 0; i < manual_events.length; i++) {
          if (this.category && manual_events[i].category.indexOf(_category_id) !== -1) {
            category_found = true;
          }
          let _event_start_date = new Date(manual_events[i].start_date);
          let _period_start_date = new Date(this.period.date);
          let _period_end_date = new Date(this.period.end_date);
          if (
            _event_start_date.getFullYear() >= _period_start_date.getFullYear() &&
            _event_start_date.getFullYear() <= _period_end_date.getFullYear() 
            ) {
            period_match = true;
          }
        }
        if (period_match && category_found) {
          this.timeline_events = events.concat(manual_events); 
        }
      }

      function compare_start_dates( a, b ) {
        let a_date = new Date(a.start_date);
        let b_date = new Date(b.start_date);
        if ( a_date < b_date ){
          return -1;
        }
        if ( a_date > b_date ){
          return 1;
        }
        return 0;
      }
      
      this.timeline_events.sort( compare_start_dates );

    });
  }

  differentYears(date1,date2): boolean {
    return new Date(date1).getFullYear() !== new Date(date2).getFullYear()
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
        this.periods = periods;
      });
  }

  expandBubble(bubble_id): void {
    this.expand_bubble = bubble_id;
  }

  // Hide Bubbles when click outside.
  onClick(event) {
    if (!event.target.matches(".share-print-btns *, .select-selected, .select-selected *, .eu-timeline-share-list, .eu-timeline-share-list *, .eu-timeline-event-share-btn, .eu-timeline-event-share-btn *, .excludeme")) {
      this.expand_bubble = "";
    }
  }

}
