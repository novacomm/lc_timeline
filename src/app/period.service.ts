import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Observable, from, of, throwError } from 'rxjs';
import { map, filter, find, first, concatMap, catchError } from 'rxjs/operators';

import { Period } from './period';
// import { PERIODS } from './mock-periods';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PeriodService {
  window: any;
  api_endpoint: string;

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
  ) { 
    this.window = this.document.defaultView;
    // If the endpoint is not provided, use the development settings.
    // Uncomment for development with ng start:
    // this.api_endpoint = 'http://web:8080/web/rest/api/timeline_en';
    this.api_endpoint = '';
    if ( typeof ((this.window.drupalSettings || {}).lc_timeline || {}).endpoint_url !== 'undefined' ) {
      this.api_endpoint = this.window.drupalSettings.lc_timeline.endpoint_url;
    }
  }



  getPeriods(): Observable<Period[]> {
    this.messageService.add('PeriodService: fetched periods');
    var headers = new HttpHeaders({
        "Content-Type": "application/json", 
        "Accept": "application/json",
        "X-CSRF-Token": "33asdf3"
    })
    let results = this.http.get<Period[]>(this.api_endpoint, {headers: headers})
        .pipe(
           map((data: any) => {
             return data.periods;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        );
    return results
  }


  // getPeriods(): Observable<Period[]> {
  //   // TODO: send the message _after_ fetching the periods
  //   this.messageService.add('PeriodService: fetched periods');
  //   return of(PERIODS);
  // }

  // getPeriod(id: number): Observable<Period> {
  //   // TODO: send the message _after_ fetching the period
  //   this.messageService.add(`PeriodService: fetched period id=${id}`);
  //   return of(PERIODS.find(period => period.id === id));
  // }

  getPeriod(period_id: number): Observable<any> {
    // TODO: send the message _after_ fetching the period
    // this.messageService.add(`PeriodService: fetched period id=${id}`);
    // return of(QUESTIONS.find(period => period.id === id));

    var headers = new HttpHeaders({
        "Content-Type": "application/json", 
        "Accept": "application/json",
        "X-CSRF-Token": "SeGfQpGVr4n-kIde0QfIvBtAyxER88ExVJDEHzDfvEw"
    })
    let results = this.http.get<any>(this.api_endpoint, {headers: headers})
        .pipe(
           concatMap(data => {
            data.periods.map( period => {
              period.position = data.periods.indexOf(period) + 1;
            })
            return from(data.periods)
          }),
           map((period: any) => {
             return (
              period.id == period_id 
              );
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        );
    return results

  }



  getYearFromDateStr(date_str): number {
    return parseInt(date_str.substring(0, 4));
  }

  getPeriodFromYear(year: number): Observable<Period> {

    this.messageService.add(`PeriodService: fetched period year=${year}`);
    var headers = new HttpHeaders({
        "Content-Type": "application/json", 
        "Accept": "application/json",
        "X-CSRF-Token": "SeGfQpGVr4n-kIde0QfIvBtAyxER88ExVJDEHzDfvEw"
    });
    let results = this.http.get<any>(this.api_endpoint, {headers: headers});

      
    if (year === null) {
      return results
        .pipe(map((val, i) => {         //index
        if (i == 0) {
          return val.periods[0]
        }
      }))

    }
    return results.
        pipe(
         concatMap(data => {
           return from(data.periods)
         }),
         find((period: any) => {
          let period_end_year;
          if (period.end_date != null)  {
            period_end_year = this.getYearFromDateStr(period.end_date);
          } else {
            period_end_year = new Date().getFullYear();
          }
            return (
              year >= this.getYearFromDateStr(period.date) &&
              year <= period_end_year
              );
             
          }), catchError( error => {
            return throwError( 'Something went wrong!' );
          }),
        );
  }



  getPeriodByURLAlias(url_alias: string): Observable<Period> {

    this.messageService.add(`PeriodService: fetched period url_alias=${url_alias}`);
    var headers = new HttpHeaders({
        "Content-Type": "application/json", 
        "Accept": "application/json",
        "X-CSRF-Token": "SeGfQpGVr4n-kIde0QfIvBtAyxER88ExVJDEHzDfvEw"
    });
    let results = this.http.get<any>(this.api_endpoint, {headers: headers});

    if (url_alias === null) {
      return results
        .pipe(map((val, i) => {         //index
        if (i == 0) {
          return val.periods[0]
        }
      }))

    }

    return results.
        pipe(
         concatMap(data => {
           return from(data.periods)
         }),
         find((period: any) => {
           let convertToSlug = function(text): string {
              return text.toLowerCase().replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+/g,'');
            }
            return convertToSlug(period.name) === url_alias;
             
          }), catchError( error => {
            return throwError( 'Something went wrong!' );
          }),
        );
  }

}
