import { EntryFormFieldsEnum } from '.';
import { Moment } from 'moment';

export interface IEntryFormValues {
  [EntryFormFieldsEnum.DATE]: Moment;
  [EntryFormFieldsEnum.FREE_EMOTIONS]?: string[];
  [EntryFormFieldsEnum.WEIGHT]?: string;
  [EntryFormFieldsEnum.THOUGHTS]?: string;
}

export interface ILogEntry {
  dateState?: IDate;
  entryMetricState?: IEntryMetric;
  keywordsState?: IKeyword;
  textState?: IText;
}

interface IDate {
  date?: string;
}

interface IKeyword {
  keywords?: string[];
}

interface IText {
  data?: string;
}

interface IEntryMetric {
  weight?: string;
}