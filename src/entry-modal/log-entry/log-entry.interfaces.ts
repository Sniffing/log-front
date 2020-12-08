import { Moment } from 'moment';

export interface ILogEntry {
  dateState?: IDate;
  entryMetricState?: IEntryMetric;
  keywordsState?: IKeyword;
  textState?: IText;
}

export interface IDate {
  date?: string;
}

export interface IKeyword {
  keywords?: string[];
}

export interface IText {
  data?: string;
}

export interface IEntryMetric {
  weight?: string;
}