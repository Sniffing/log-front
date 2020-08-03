import { ILogEntry } from '../entry-modal/log-entry';
import { LogEntryStore } from './logEntryStore';

export const logEntryDefaults: ILogEntry = {
  dateState: {},
  entryMetricState: {},
  keywordsState: {
    keywords: []
  },
  textState: {}
};

export class LogEntryFormStore {
  public logEntry: ILogEntry = logEntryDefaults;

  private logEntryStore: LogEntryStore | undefined = undefined;

  public constructor(logEntry?: ILogEntry) {
    if (logEntry)
      this.logEntry = logEntry;
  }

  public setDate = (date: string) => {
    this.logEntry.dateState = {
      date: date.trim()
    };
  }

  public setWeight = (weight: string) => {
    this.logEntry.entryMetricState = {
      weight: weight.trim()
    };
  }

  public setKeywords = (keywords: string[]) => {
    this.logEntry.keywordsState = {
      keywords
    };
  }

  public setThoughts = (thoughts: string) => {
    this.logEntry.textState = {
      data: thoughts.trim()
    };
  }
}