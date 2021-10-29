import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Observable, from, of, throwError } from 'rxjs';
import { map, filter, find, first, concatMap, catchError } from 'rxjs/operators';

import { TimelineEvent } from './timeline-event';
// import { EVENTS } from './mock-events';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class TimelineEventService {
  window: any;
  api_endpoint: string;

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
  ) { 
    this.window = this.document.defaultView;
    this.api_endpoint = '';
    if ( typeof ((this.window.drupalSettings || {}).lc_timeline || {}).endpoint_url !== 'undefined' ) {
      this.api_endpoint = this.window.drupalSettings.lc_timeline.endpoint_url;
    }
  }



  getEvents(category, period): Observable<TimelineEvent[]> {
    this.messageService.add('EventService: fetched events');
    let params = new HttpParams();
    if (category) {
      params = params.append('category', category);
    }
    params = params.append('period', period);

    var headers = new HttpHeaders({
        "Content-Type": "application/json", 
        "Accept": "application/json",
        // "X-CSRF-Token": "33asdf3"
    })
    let results = this.http.get<TimelineEvent[]>(this.api_endpoint, {params: params, headers: headers})
        .pipe(
           map((data: any) => {
            return data.events;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        );
    return results
  }



  getEvent(event_id: number): Observable<any> {

    var headers = new HttpHeaders({
        "Content-Type": "application/json", 
        "Accept": "application/json",
    })
    let results = this.http.get<any>(this.api_endpoint, {headers: headers})
        .pipe(
           concatMap(data => {
            data.events.map( event => {
              event.position = data.events.indexOf(event) + 1;
            })
            return from(data.events)
          }),
           map((event: any) => {
             return (
              event.id == event_id 
              );
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        );
    return results

  }

}
