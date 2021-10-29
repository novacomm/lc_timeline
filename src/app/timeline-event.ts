export class TimelineEvent {
  id: string;
  title: string;
  media: {
        [rendered: string]: string
    }[];
  body: string;
  category: string[];
  start_date: string;
  end_date: string;
  date_format: string;


}
