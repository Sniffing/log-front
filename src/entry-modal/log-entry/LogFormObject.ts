import { action, computed, observable } from 'mobx';
import { IDate, IEntryMetric, IKeyword, ILogEntry, IText } from '.';

export const logEntryDefaults: ILogEntry = {
  dateState: {},
  entryMetricState: {},
  keywordsState: {
    keywords: []
  },
  textState: {}
};

export class LogFormObject implements ILogEntry {
  @observable
  public dateState: IDate = {}

  @observable
  public entryMetricState: IEntryMetric = {}

  @observable
  public keywordsState: IKeyword = {
    keywords:[]
  }

  @observable
  public textState: IText = {}

  public constructor(date?: string) {
    if (date) {
      this.setDate(date);
    }
  }

  @computed
  public get logEntry(): ILogEntry {
    return {
      dateState: this.dateState,
      entryMetricState: this.entryMetricState,
      keywordsState: this.keywordsState,
      textState: this.textState,
    };
  }

  @action
  public setDate = (date: string): void => {
    this.dateState = {
      date: date
    };
  }

  @action
  public setWeight = (weight: number): void => {
    this.entryMetricState = {
      weight: String(weight)
    };
  }

  @action
  public setKeywords = (keywords: string[]): void => {
    this.keywordsState = {
      keywords: keywords?.map(word => word.trim().toLowerCase())
    };
  }

  @action
  public setThoughts = (thoughts: string): void => {
    this.textState = {
      data: thoughts
    };
  }

  @action.bound
  public clear(): void {
    this.dateState = {};
    this.entryMetricState = {};
    this.keywordsState = {};
    this.textState = {};
  }
}