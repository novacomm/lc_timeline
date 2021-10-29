import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Observable, from, of, throwError } from 'rxjs';
import { map, filter, find, first, concatMap, catchError } from 'rxjs/operators';

import { Category } from './category';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class CategoryService {
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





  getCategories(): Observable<Category[]> {
    this.messageService.add('CategoryService: fetched categories');
    var headers = new HttpHeaders({
        "Content-Type": "application/json", 
        "Accept": "application/json",
    })
    let results = this.http.get<Category[]>(this.api_endpoint, {headers: headers})
        .pipe(
           map((data: any) => {
             return data.categories;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        );
    return results
  }




  getCategoryByURLAlias(url_alias: string): Observable<Category> {

    this.messageService.add(`CategoryService: fetched category url_alias=${url_alias}`);
    var headers = new HttpHeaders({
        "Content-Type": "application/json", 
        "Accept": "application/json",
    });
    let results = this.http.get<any>(this.api_endpoint, {headers: headers});

    return results.
        pipe(
         concatMap(data => {
           return from(data.categories)
         }),
         find((category: any) => {
           let convertToSlug = function(text): string {
              return text.toLowerCase().replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+/g,'');
            }
            return convertToSlug(category.name) === url_alias;
             
          }), catchError( error => {
            return throwError( 'Something went wrong!' );
          }),
        );
  }
}
