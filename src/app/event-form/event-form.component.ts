import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';

import { TimelineEvent } from '../timeline-event';
import { Period } from '../period';
import { Category } from '../category';

import { TimelineEventService } from '../timeline-event.service';
import { PeriodService } from '../period.service';
import { CategoryService } from '../category.service';
import { HelperService } from "../helper.service";
import { AdditionalLabelsService } from '../additional-labels.service';

import { Injectable } from '@angular/core';

import { Self, SkipSelf } from '@angular/core';
import { BROWSER_STORAGE, ThemeService } from '../theme.service';

import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: [ './event-form.component.scss', ],
  providers: [
    ThemeService,
    { provide: BROWSER_STORAGE, useFactory: () => sessionStorage }
  ],
})
export class EventFormComponent implements OnInit {
  // event: _Event;
  periods: Period[] = [];
  categories: Category[] = [];
  // events: Event[] = [];
  model_backup: TimelineEvent;
  model : TimelineEvent = {
      id: "10", // id: number;
      title: '', // title: string;
      media: [
        {url: ''}
      ], // media: string[];
      body: '', // body: string ;
      // categories: [1], // category: number;
      category: [], // category: number;
      start_date: new Date().toISOString().split('T')[0], // start_date: string;
      end_date: new Date().toISOString().split('T')[0], // end_date: string;
      date_format: 'full', // end_date: string;
    };
  eu_languages = {
    'bg': 'Bulgarian',
    'es': 'Spanish',
    'cs': 'Czech',
    'da': 'Danish',
    'de': 'German',
    'et': 'Estonian',
    'el': 'Greek',
    'en': 'English',
    'fr': 'French',
    'ga': 'Irish',
    'hr': 'Croatian',
    'it': 'Italian',
    'lt': 'Lithuanian',
    'lv': 'Latvian',
    'hu': 'Hungarian',
    'mt': 'Maltese',
    'nl': 'Dutch',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ro': 'Romanian',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'fi': 'Finnish',
    'sv': 'Swedish',
  }
  form_dates = {
    show_end_date: true,
    month_range: [...Array(31).keys()],
    year_range: [...Array(12).keys()],
    period_range: [...Array(2021-1900).keys()],
    start_year: new Date().getFullYear(),
    start_month: new Date().getMonth(),
    start_day: new Date().getDate(),
    end_year: new Date().getFullYear(),
    end_month: new Date().getMonth(),
    end_day: new Date().getDate(),

  };
  constructor(
    public additionalLabelsService: AdditionalLabelsService, 
    private route: ActivatedRoute,
    private timelineEventService: TimelineEventService,
    private location: Location,
    private categoryService: CategoryService,
    public helperService: HelperService,
    private router: Router,


    @Self() private sessionThemeService: ThemeService,
    @SkipSelf() private localThemeService: ThemeService,
    private periodService: PeriodService,
  ) {}

  ngOnInit(): void {
    this.model_backup = this.model;
    this.getPeriods();
    this.getCategories();

  }

  toggleCategory(category, _event): void {
    var target = _event.target || _event.srcElement || _event.currentTarget;
    if (target.checked) {
      this.model.category.push(category.id);
    } else {
      this.model.category = this.model.category.filter(function(item) {
          return item !== category.id
      })
    }
  }
  goBack(): void {
    this.location.back();
  }
  onSubmit(): void {
    this.location.back();
  }
  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);
  }
  earliestYear():number {
    return 0
  }
  getPeriods(): void {
    this.periodService.getPeriods()
      .subscribe(periods => this.periods = periods);
  }

  submitEvent(): void {
    const start_date = new Date(this.form_dates.start_year, this.form_dates.start_month, this.form_dates.start_day);
    this.model.start_date = start_date.toISOString().split('T')[0];
    
    const end_date = new Date(this.form_dates.end_year, this.form_dates.end_month, this.form_dates.end_day);
    this.model.end_date = end_date.toISOString().split('T')[0];
    
    this.model.id = Math.floor(Math.random() * 99999).toString();
    this.model.start_date = `${this.form_dates.start_year}-${this.form_dates.start_month}-${this.form_dates.start_day}`;
    this.model.end_date = `${this.form_dates.end_year}-${this.form_dates.end_month}-${this.form_dates.end_day}`;

    let manual_events_str = this.sessionThemeService.get('manual_events');
    if (manual_events_str === null) {
      manual_events_str = "[]";
    }
    let manual_events = JSON.parse(manual_events_str);
    let new_event = this.model;
    manual_events.push(new_event);
    this.sessionThemeService.set('manual_events', JSON.stringify(manual_events));
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
