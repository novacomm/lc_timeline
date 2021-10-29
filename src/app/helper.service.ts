import { Inject, Injectable, InjectionToken } from '@angular/core';
let assets_location = '/web/modules/custom/lc_timeline/assets/js/build/assets';
// let assets_location = '/assets';
if (document.currentScript !== null) {
  let current_script_src = document.currentScript.getAttribute('src');
  let current_script_location = current_script_src.substring(0, current_script_src.lastIndexOf("/"));
  assets_location = current_script_location + '/assets';
}
@Injectable({
  providedIn: 'root'
})
export class HelperService {
  
  assets_location: string = assets_location;
  
  constructor() {}

  convertToSlug(text): string {
    if (typeof text !== 'string') {
      return ''
    }
    return text.toLowerCase().replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+/g,'');
  }

  formatDate(date_str, date_format): string {
    if (date_format == 'year') {
      let date = new Date(date_str);
      let options = { year: 'numeric' };
      return date.toLocaleString('en-GB', options);
    } else {
      let date = new Date(date_str);
      let options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleString('en-GB', options);
    }
  }

  periodYearsRangeTitle(period): string {
    if (period.end_date != null) {
      let end_date = this.getYearFromDateStr(period.end_date);
      return `${this.getYearFromDateStr(period.date)} - ${end_date} `;
    } else {
      let end_date = 'Today';
      return `${this.getYearFromDateStr(period.date)} - ${end_date} `;
    }
    
  }

  getYearFromDateStr(date_str): number {
    if (date_str == null) {
      return new Date().getFullYear();
    }
    return parseInt(date_str.substring(0, 4));
  }


}
