import { Component, OnInit, Input } from '@angular/core';
import { AdditionalLabelsService } from '../additional-labels.service';

@Component({
  selector: 'app-top-buttons',
  templateUrl: './top-buttons.component.html',
  styleUrls: ['./top-buttons.component.css']
})
export class TopButtonsComponent implements OnInit {

  @Input() expand_bubble: string;
  @Input() share_url: string = '';

  constructor(
    public additionalLabelsService: AdditionalLabelsService, 
    ) { }

  ngOnInit(): void {
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

  printExternal(url) {
      var printWindow = window.open( url, 'Print', 'left=200, top=200, width=950, height=500, toolbar=0, resizable=0');

      
      function page_ready_then_print() {
          if(printWindow.document.querySelectorAll('div.eu-timeline-year-placeholder-heading > h2').length == 0) {
             window.setTimeout(page_ready_then_print, 100); 
          } else {
            window.setTimeout(function(){
              printWindow.print();
              printWindow.close();    
            }, 400);
          }
      }
      page_ready_then_print();
      printWindow.addEventListener('load', function() {
          
      }, true);
  }

}
