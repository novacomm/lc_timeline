import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Observable, from, of, throwError } from 'rxjs';
import { map, filter, find, first, concatMap, catchError } from 'rxjs/operators';

import { Faq } from './faq';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class FaqService {

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






  getFaqs(): Observable<Faq[]> {
    this.messageService.add('FaqService: fetched faqs');
    var headers = new HttpHeaders({
        "Content-Type": "application/json", 
        "Accept": "application/json",
        "X-CSRF-Token": "33asdf3"
    })
    let results = this.http.get<Faq[]>(this.api_endpoint, {headers: headers})
        .pipe(
           map((data: any) => {
             return data.faqs;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        );
    return results
  }



}
