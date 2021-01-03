import { observable, action, computed } from 'mobx';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { KEYWORD_URL, TEXT_URL, WEIGHT_URL, LAST_DATES_URL, LOG_ENTRY_URL } from '.';
import get, { AxiosResponse } from 'axios';
import { dateFormat, ILogEntry } from '../entry-modal/log-entry';
import { BaseStore, BaseStoreProps } from './baseStore';
import { mockKeywordData, mockMemoryData, mockWeightData, mockLastDateData } from './mockData/logEntryStoreMocks';
import { Utils } from '../App.utils';
import moment from 'moment';
import { IWeightDTO } from '../data-vis/analysis';
import { generateMockAxisResponse } from './mockData/mockHelpers';

export interface KeywordEntry {
  date: string;
  keywords: string[];
}

export interface Memory {
  date: string;
  text: string;
}

export interface ILastDates {
  first: string;
  last: string;
}

export class LogEntryStore extends BaseStore<ILogEntry> {

  public constructor(props: BaseStoreProps) {
    super(props);
  }

  @observable
  public fetchingMemory: IPromiseBasedObservable<AxiosResponse<any>>;

  @observable
  public fetchingWeight: IPromiseBasedObservable<AxiosResponse<any>>;

  @observable
  public fetchingKeywords: IPromiseBasedObservable<AxiosResponse<any>>;

  @observable
  public fetchingDates: IPromiseBasedObservable<AxiosResponse<ILastDates>>;

  public keywordCounts: Record<string, number> = {};

  @observable
  public keywords: KeywordEntry[] = [];

  @observable
  public memories: Memory[] = [];

  @observable
  public weights: IWeightDTO[] = [];

  @observable
  public lastDates: ILastDates = {
    first: '',
    last: '',
  };

  @action
  public async fetchKeywords(): Promise<void> {
    if (this.shouldMock) {
      this.setKeywords(mockKeywordData);
      this.fetchingKeywords = fromPromise(generateMockAxisResponse<any>());
      return;
    }

    this.fetchingKeywords = fromPromise(get(KEYWORD_URL));
    await this.fetchingKeywords.then(response => {
      this.setKeywords(response.data);
    });
  }

  @action.bound
  public async fetchMemory(): Promise<void> {
    if (this.shouldMock) {
      this.setMemories(mockMemoryData);
      this.fetchingMemory = fromPromise(generateMockAxisResponse<any>());
      return;
    }

    this.fetchingMemory = fromPromise(get(TEXT_URL));
    await this.fetchingMemory.then(response => {
      this.setMemories(response.data);
    });
  }

  @action.bound
  public async fetchWeightData(): Promise<void> {
    if (this.shouldMock) {
      this.setWeight(mockWeightData);
      this.fetchingWeight = fromPromise(generateMockAxisResponse<any>());
      return;
    }

    this.fetchingWeight = fromPromise(get(WEIGHT_URL));
    await this.fetchingWeight.then(response => {
      this.setWeight(response.data);
    });
  }

  @action.bound
  private setKeywords(keywords: any): void {
    this.keywords = keywords;
  }

  @action.bound
  private setMemories(memories: any): void {
    this.memories = memories;
  }

  @action.bound
  private setWeight(weights: any): void {
    this.weights = weights;
  }

  @action.bound
  private setLastDates(dates: ILastDates): void {
    this.lastDates = dates;
  }

  @action.bound
  public setLatestDate(date: string): void {
    this.lastDates.last = date;
  }

  @action
  public setKeywordCounts(): void {
    const localDictionary: Record<string, number> = {};

    this.keywords.forEach((entry: KeywordEntry) => {
      entry.keywords.forEach((word: string) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!localDictionary.hasOwnProperty(word)) {
          localDictionary[word] = 1;
        } else {
          localDictionary[word] += 1;
        }
      });
    });

    this.keywordCounts = localDictionary;
  }

  @action
  public async fetchLastDates(): Promise<void> {
    if (this.shouldMock) {
      this.setLastDates(mockLastDateData);
      this.fetchingDates = fromPromise(generateMockAxisResponse<ILastDates>(mockLastDateData));
      return;
    }

    this.fetchingDates = fromPromise(get(LAST_DATES_URL));
    await this.fetchingDates.then((response) => {

      const last =  moment(Utils.unreverseDateFromServer(response.data.last), dateFormat)
        .utc()
        .add(-moment().utcOffset(), 'm')
        .add(1, 'day')
        .format(dateFormat);

      this.setLastDates({
        first: Utils.unreverseDateFromServer(response.data.first),
        last,
      });
    });
  }

  public fetch = async () => {
    console.log('sort this out');
  }

  public save = async (data: ILogEntry): Promise<void> => {
    const preparedData: ILogEntry = {
      ...data,
      textState: {
        data: data.textState?.data?.trim()
      }
    };

    if (this.shouldMock) {
      console.log('Saving log entry', preparedData);
      return;
    }

    try {
      await fetch(LOG_ENTRY_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preparedData)
      });
    } catch (error) {
      throw new Error(error);
    }
  };
}