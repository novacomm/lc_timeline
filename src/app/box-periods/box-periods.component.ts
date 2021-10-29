import { Component, OnInit } from '@angular/core';

import { Period } from '../period';
import { PeriodService } from '../period.service';
import { TimelineEvent } from '../timeline-event';
import { TimelineEventService } from '../timeline-event.service';

import { HelperService } from "../helper.service";

@Component({
  selector: 'box-periods',
  templateUrl: './box-periods.component.html',
  styleUrls: ['./box-periods.component.scss']
})
export class BoxPeriodsComponent implements OnInit {
  periods: Period[] = [];
  events: TimelineEvent[] = [];

  constructor(
    private timelineEventService:TimelineEventService,
    private periodService: PeriodService,
    public helperService: HelperService,
  ) {}

  ngOnInit() {
    this.getPeriods();
    // this.getEvents();
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

  // getEvents(period_id): void {
  //   this.timelineEventService.getEvents(null, period_id)
  //   .subscribe(events => {
  //     this.events = events; 
  //   });
  // }


  // getEarliestYear():string {
  //   console.log(this.events);
  //   let earliest_year = this.helperService.getYearFromDateStr(this.events[0].start_date);
  //   for (var i = 0; i < this.events.length; i++) {
  //     let _year = this.helperService.getYearFromDateStr(this.events[i].start_date);
  //     if (_year < earliest_year) {
  //       earliest_year = _year;
  //     }
  //   }
  //   return _year;
  // }

}
