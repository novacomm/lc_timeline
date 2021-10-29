import { Component, OnInit, Output, EventEmitter, ViewChild, Renderer2 } from '@angular/core';
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

import { Self, SkipSelf } from '@angular/core';
import { BROWSER_STORAGE, ThemeService } from '../theme.service';



@Component({
  selector: 'app-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss'],
  providers: [
    ThemeService,
    { provide: BROWSER_STORAGE, useFactory: () => sessionStorage }
  ],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class AllEventsComponent implements OnInit {
  // event: Event;
  periods: Period[] = [];
  categories: Category[] = [];
  timeline_events: TimelineEvent[] = [];
  period: Period;
  category: Category;
  category_url_alias: string;
  year_url_alias: string;
  year: Number;
  years: Number[] = [];

  expand_bubble: string = "";
  category_position: string = "";
  period_position: string = "";

  show_add_event: boolean = false;
  
  page_structure: string = "";
  

  constructor(
    private renderer: Renderer2,
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
      this.year_url_alias = this.route.snapshot.paramMap.get('year_url_alias');
      this.year = parseInt(this.year_url_alias);
      this.category_url_alias = params.category_url_alias;
      
      this.getCategories();
      this.getPeriods();
    });
    
  }



  ngOnInit() {

  }




  getYearsFromPeriod(_period): number[] {
    let years = [];
    console.log(_period.timeline_events);


    function compare( a, b ) {
      if ( a.start_date < b.start_date ){
        return -1;
      }
      if ( a.start_date > b.start_date ){
        return 1;
      }
      return 0;
    }


    _period.timeline_events.sort( compare );


    for (var i = 0; i < _period.timeline_events.length; i++) {
      let event_year = this.helperService.getYearFromDateStr(_period.timeline_events[i].start_date);
      let period_end_year;
      if (_period.end_date !== undefined) {
        period_end_year = this.helperService.getYearFromDateStr(_period.end_date);
      } else {
        period_end_year = new Date().getFullYear();
      }
      if (
        event_year >= this.helperService.getYearFromDateStr(_period.date) && 
        event_year <= period_end_year &&
        years.indexOf(event_year) === -1
      ) {
        years.push(event_year);
      }
    }
    return years
  } 

  getEvents(_period): void {
    this.timelineEventService.getEvents(null, _period.id)
    .subscribe(events => {
      _period.timeline_events = events;
      
      // Add user manually added events.
      let period_match = false;
      let manual_events_str = this.sessionThemeService.get('manual_events');
      if (manual_events_str) {
        let manual_events = JSON.parse(manual_events_str);
        for (var i = 0; i < manual_events.length; i++) {
          let _event_start_date = new Date(manual_events[i].start_date);
          let _period_start_date = new Date(this.period.date);
          let _period_end_date = new Date(this.period.end_date);
          
          if (
            _event_start_date.getFullYear() >= _period_start_date.getFullYear() &&
            (
              this.period.end_date === null || 
              _event_start_date.getFullYear() <= _period_end_date.getFullYear()
            )
          ) {
            period_match = true;
          }
        }
        if (period_match) {
          _period.timeline_events = events.concat(manual_events); 
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
      
      _period.timeline_events.sort( compare_start_dates );
      _period.years = this.getYearsFromPeriod(_period);

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
        this.periods = periods;
        for (var i = 0; i < periods.length; i++) {
          this.getEvents(periods[i]);
        }
      });
  }

  expandBubble(bubble_id): void {
    this.expand_bubble = bubble_id;
  }

  onClick(event):void {
    if (!event.target.matches(".share-print-btns *, .select-selected, .select-selected *, .eu-timeline-share-list, .eu-timeline-share-list *, .eu-timeline-event-share-btn, .eu-timeline-event-share-btn *, .excludeme")) {
      this.expand_bubble = "";
    }
  }

  getCategoryNameFromID(cat_id):string {
    for (var i = 0; i < this.categories.length; i++) {
      if (cat_id == this.categories[i].id) {
        return this.categories[i].name;
      }
    }
    return '';
  }




  getCategoryPositionFromID(cat_id): number {
    for (var i = 0; i < this.categories.length; i++) {
      if (cat_id === this.categories[i].id) {
        return i+1;
      }
    }
    return 0;
  }


  getEventsFromYear(year): TimelineEvent[] {
    let that = this;
    return this.timeline_events.filter(function (_event) {
      let _event_year = that.helperService.getYearFromDateStr(_event.start_date);
      return _event_year === year;
    })
  }

}
