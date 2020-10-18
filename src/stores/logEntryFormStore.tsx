import { action, computed, observable } from 'mobx';
import { ILogEntry } from '../entry-modal/log-entry';

export const logEntryDefaults: ILogEntry = {
  dateState: {},
  entryMetricState: {},
  keywordsState: {
    keywords: []
  },
  textState: {}
};

export class LogEntryFormStore {
  @observable
  private logEntry: ILogEntry;

  public constructor(logEntry?: ILogEntry) {
    if (logEntry) {
      this.logEntry = logEntry;
    } else {
      this.logEntry = logEntryDefaults;
    }
  }

  @computed
  public get DTO(): ILogEntry {
    return this.logEntry;
  }

  @action
  public setDate = (date: string) => {
    this.logEntry.dateState = {
      date: date.trim()
    };
  }

  @action
  public setWeight = (weight: string) => {
    this.logEntry.entryMetricState = {
      weight: weight.trim()
    };
  }

  @action
  public setKeywords = (keywords: string[]) => {
    this.logEntry.keywordsState = {
      keywords: keywords?.map(word => word.trim().toLowerCase())
    };
  }

  @action
  public setThoughts = (thoughts: string) => {
    this.logEntry.textState = {
      data: thoughts
    };
  }

  public clear() {
    // this.setDate(moment(this.props.formObject.dateState?.date, dateFormat));
    this.setWeight('');
    this.setKeywords([]);
    this.setThoughts('');
  }
}