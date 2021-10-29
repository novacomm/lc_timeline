import { Component, ViewEncapsulation } from '@angular/core';

import { Self, SkipSelf } from '@angular/core';
import { BROWSER_STORAGE, ThemeService } from './theme.service';
import {HelperService} from "./helper.service";


@Component({
  selector: '.timeline-wrapper',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
  './app.component.scss',
  ],
  providers: [
    ThemeService,
    HelperService,
    { provide: BROWSER_STORAGE, useFactory: () => sessionStorage }
  ]
})
export class AppComponent {
  title = 'EU Timeline';


  constructor(
    @Self() private sessionThemeService: ThemeService,
    @SkipSelf() private localThemeService: ThemeService,

    ) { 
  }



  getCategoryPosition(): string {
    return this.sessionThemeService.get('category_position');
  }

  getColor(): string {
    switch(this.sessionThemeService.get('category_position')) { 
       case '0': { 
          return 'blue';
          break;
       } 
       case '1': { 
          return 'green';
          break;
       } 
       case '2': { 
          return 'orange';
          break;
       } 
       case '3': { 
          return 'violet';
          break;
       } 
       default: { 
          return 'white';
          break;
       } 
    } 
  }

}
