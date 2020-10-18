import { observable, action } from 'mobx';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { KEYWORD_URL, TEXT_URL, WEIGHT_URL, LAST_DATES_URL, LOG_ENTRY_URL } from '.';
import get, { AxiosResponse } from 'axios';
import { IWeightDTO } from '../App.interfaces';
import { dateFormat, ILogEntry } from '../entry-modal/log-entry';
import { BaseStore, BaseStoreProps } from './baseStore';
import { mockKeywordData, mockMemoryData, mockWeightData, mockLastDateData } from './mockData/logEntryStoreMocks';
import { Utils } from '../App.utils';
import moment from 'moment';

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
  public fetchingMemory: IPromiseBasedObservable<AxiosResponse<any>> | undefined;

  @observable
  public fetchingWeight: IPromiseBasedObservable<AxiosResponse<any>> | undefined;

  @observable
  public fetchingKeywords: IPromiseBasedObservable<AxiosResponse<any>> | undefined;

  @observable
  public fetchingDates: IPromiseBasedObservable<AxiosResponse<ILastDates>> | undefined;

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
  public async fetchKeywords() {
    if (this.shouldMock) {
      this.setKeywords(mockKeywordData);
      return;
    }

    this.fetchingKeywords = fromPromise(get(KEYWORD_URL));
    await this.fetchingKeywords.then(response => {
      this.setKeywords(response.data);
    });
  }

  @action.bound
  public async fetchMemory() {
    if (this.shouldMock) {
      this.setMemories(mockMemoryData);
      return;
    }

    this.fetchingMemory = fromPromise(get(TEXT_URL));
    await this.fetchingMemory.then(response => {
      this.setMemories(response.data);
    });
  }

  @action.bound
  public async fetchWeightData() {
    if (this.shouldMock) {
      this.setWeight(mockWeightData);
      return;
    }

    this.fetchingWeight = fromPromise(get(WEIGHT_URL));
    await this.fetchingWeight.then(response => {
      this.setWeight(response.data);
    });
  }

  @action.bound
  private setKeywords(keywords: any) {
    this.keywords = keywords;
  }

  @action.bound
  private setMemories(memories: any) {
    this.memories = memories;
  }

  @action.bound
  private setWeight(weights: any) {
    this.weights = weights;
  }

  @action.bound
  private setLastDates(dates: ILastDates) {
    this.lastDates = dates;
  }

  @action.bound
  public setLatestDate(date: string) {
    this.lastDates.last = date;
  }

  @action
  public async fetchLastDates() {
    if (this.shouldMock) {
      this.setLastDates(mockLastDateData);
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

  public save = async (data: ILogEntry) => {
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